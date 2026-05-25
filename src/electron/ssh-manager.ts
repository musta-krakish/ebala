import { EventEmitter } from 'events';
import net from 'net';
import os from 'os';
import { randomUUID } from 'crypto';
import { spawn as ptySpawn, type IPty } from 'node-pty';
import { Client as Ssh2Client, type ClientChannel } from 'ssh2';
import type { SshHost } from './ssh-config-parser.ts';
import { getSavedHost, getSavedHostPassword } from './saved-hosts.ts';
import { getOverridePassword } from './host-overrides.ts';
import { resolveHost, tcpPreflight } from './host-resolver.ts';
import { listPortForwards, type PortForward } from './port-forwards.ts';

interface PtySession {
    id: string;
    host: SshHost;
    kind: 'pty';
    pty: IPty;
}

interface Ssh2Session {
    id: string;
    host: SshHost;
    kind: 'ssh2';
    client: Ssh2Client;
    stream: ClientChannel | null;
    forwardServers: net.Server[];
    remoteForwards: Array<{ address: string; port: number }>;
    pendingPrefix: string;
}

type Session = PtySession | Ssh2Session;

const enabledForwards = (hostId: string): PortForward[] =>
    listPortForwards(hostId).filter((forward) => forward.enabled);

const buildSshCliArgs = (host: SshHost): string[] => {
    const args: string[] = [];

    for (const forward of enabledForwards(host.id)) {
        const bind = forward.bindAddress || (forward.type === 'local' ? '127.0.0.1' : '');
        const flag = forward.type === 'local' ? '-L' : '-R';
        const spec = bind
            ? `${bind}:${forward.bindPort}:${forward.targetHost}:${forward.targetPort}`
            : `${forward.bindPort}:${forward.targetHost}:${forward.targetPort}`;
        args.push(flag, spec);
    }

    if (host.source === 'config') {
        args.push(host.alias);
        return args;
    }

    if (host.port) args.push('-p', String(host.port));
    args.push(host.hostname);
    return args;
};

export class SshManager extends EventEmitter {
    private sessions = new Map<string, Session>();

    private emitData(sessionId: string, data: string) {
        const session = this.sessions.get(sessionId);
        if (session?.kind === 'ssh2' && session.pendingPrefix) {
            this.emit('data', { sessionId, data: session.pendingPrefix + data });
            session.pendingPrefix = '';
            return;
        }
        this.emit('data', { sessionId, data });
    }

    private appendPending(session: Ssh2Session, data: string) {
        session.pendingPrefix += data;
        if (session.pendingPrefix.length > 4096) {
            session.pendingPrefix = session.pendingPrefix.slice(-4096);
        }
    }

    list(): Array<{ sessionId: string; host: SshHost }> {
        return Array.from(this.sessions.values()).map((session) => ({
            sessionId: session.id,
            host: session.host
        }));
    }

    async create(host: SshHost, cols = 120, rows = 30): Promise<{ sessionId: string }> {
        if (host.source === 'saved') {
            return this.createSavedSsh2Session(host, cols, rows);
        }

        if (host.hasOverridePassword) {
            return this.createOverrideSsh2Session(host, cols, rows);
        }

        return this.createPtySession(host, cols, rows);
    }

    private async createOverrideSsh2Session(
        host: SshHost,
        cols: number,
        rows: number
    ): Promise<{ sessionId: string }> {
        const password = getOverridePassword(host.id);
        if (!password) {
            throw new Error('Override password is unavailable or not stored');
        }
        if (!host.user) {
            throw new Error('Override requires a username');
        }

        return this.openSsh2Stream({
            host,
            cols,
            rows,
            target: {
                hostname: host.hostname,
                port: host.port ?? 22,
                username: host.user,
                password
            }
        });
    }

    private createPtySession(host: SshHost, cols: number, rows: number): { sessionId: string } {
        const id = randomUUID();
        const args = buildSshCliArgs(host);

        const pty = ptySpawn('ssh', args, {
            name: 'xterm-256color',
            cols,
            rows,
            cwd: os.homedir(),
            env: process.env as Record<string, string>
        });

        const session: PtySession = { id, host, kind: 'pty', pty };
        this.sessions.set(id, session);

        pty.onData((data) => this.emit('data', { sessionId: id, data }));
        pty.onExit(({ exitCode, signal }) => {
            this.sessions.delete(id);
            this.emit('exit', { sessionId: id, exitCode, signal });
        });

        return { sessionId: id };
    }

    private async createSavedSsh2Session(
        host: SshHost,
        cols: number,
        rows: number
    ): Promise<{ sessionId: string }> {
        const savedId = host.savedId;
        if (!savedId) {
            throw new Error('saved host missing savedId');
        }
        const saved = getSavedHost(savedId);
        if (!saved) {
            throw new Error(`Saved host ${savedId} not found`);
        }

        const password = saved.authMethod === 'password' ? getSavedHostPassword(savedId) : null;
        if (saved.authMethod === 'password' && !password) {
            throw new Error('Password is not stored for this host');
        }

        return this.openSsh2Stream({
            host,
            cols,
            rows,
            target: {
                hostname: saved.hostname,
                port: saved.port,
                username: saved.username,
                password: password ?? undefined
            }
        });
    }

    private openSsh2Stream(args: {
        host: SshHost;
        cols: number;
        rows: number;
        target: { hostname: string; port: number; username: string; password?: string };
    }): { sessionId: string } {
        const { host, cols, rows, target } = args;
        const id = randomUUID();
        const client = new Ssh2Client();
        const resolvePromise = resolveHost(target.hostname);
        const session: Ssh2Session = {
            id,
            host,
            kind: 'ssh2',
            client,
            stream: null,
            forwardServers: [],
            remoteForwards: [],
            pendingPrefix: ''
        };
        this.sessions.set(id, session);

        const fail = (err: Error) => {
            this.cleanupSsh2Tunnels(session);
            this.sessions.delete(id);
            this.emit('exit', { sessionId: id, exitCode: 1, error: err.message });
        };

        client.on('error', (err) => {
            const hint =
                /handshake/i.test(err.message)
                    ? ' (TCP works but the SSH service did not respond. Wrong port, sshd down, or a Tailscale ACL blocking port?)'
                    : '';
            this.emitData(id, `\r\n\x1b[31mError: ${err.message}${hint}\x1b[0m\r\n`);
            fail(err);
        });

        client.on('end', () => {
            this.cleanupSsh2Tunnels(session);
            this.sessions.delete(id);
            this.emit('exit', { sessionId: id, exitCode: 0 });
        });

        // Honour reverse-forwarded connections initiated by the remote side.
        client.on('tcp connection', (info, accept, reject) => {
            const match = session.remoteForwards.find(
                (f) => f.address === info.destIP && f.port === info.destPort
            );
            const forwardConfig = match
                ? enabledForwards(host.id).find(
                      (f) =>
                          f.type === 'remote' &&
                          (f.bindAddress || '') === info.destIP &&
                          f.bindPort === info.destPort
                  )
                : undefined;

            if (!forwardConfig) {
                reject();
                return;
            }

            const local = net.connect(forwardConfig.targetPort, forwardConfig.targetHost);
            local.on('error', () => reject());
            local.on('connect', () => {
                const remote = accept();
                local.pipe(remote).pipe(local);
            });
        });

        client.on('ready', () => {
            this.emitData(
                id,
                `\x1b[32mConnected to ${target.username}@${target.hostname}:${target.port}\x1b[0m\r\n`
            );

            this.setupSsh2Tunnels(session);

            client.shell({ term: 'xterm-256color', cols, rows }, (err, stream) => {
                if (err) {
                    fail(err);
                    return;
                }

                session.stream = stream;

                stream.on('data', (data: Buffer) => {
                    this.emit('data', { sessionId: id, data: data.toString('utf-8') });
                });

                stream.stderr.on('data', (data: Buffer) => {
                    this.emit('data', { sessionId: id, data: data.toString('utf-8') });
                });

                stream.on('close', () => {
                    try {
                        client.end();
                    } catch {
                        // ignore
                    }
                });
            });
        });

        resolvePromise
            .then(async ({ address, via }) => {
                if (via === 'unresolved') {
                    this.emitData(
                        id,
                        `\r\n\x1b[31mCould not resolve ${target.hostname}. For Tailscale: try the 100.x.x.x IP or full \`.ts.net\` name.\x1b[0m\r\n`
                    );
                    fail(new Error(`Could not resolve ${target.hostname}`));
                    return;
                }
                if (via !== 'literal') {
                    this.appendPending(
                        session,
                        `\x1b[36mResolved ${target.hostname} → ${address} (${via})\x1b[0m\r\n`
                    );
                }

                try {
                    await tcpPreflight(address, target.port, 8000);
                } catch (err) {
                    const message = err instanceof Error ? err.message : String(err);
                    this.emitData(
                        id,
                        `\r\n\x1b[31m${message}. Tailscale tunnel up? Try \`tailscale status\` / \`tailscale ping ${target.hostname}\`.\x1b[0m\r\n`
                    );
                    fail(err instanceof Error ? err : new Error(message));
                    return;
                }
                this.appendPending(session, `\x1b[36mTCP ok ${address}:${target.port}, waiting for SSH banner…\x1b[0m\r\n`);

                try {
                    client.connect({
                        host: address,
                        port: target.port,
                        username: target.username,
                        password: target.password,
                        readyTimeout: 30000,
                        keepaliveInterval: 30000
                    });
                } catch (err) {
                    fail(err as Error);
                }
            })
            .catch((err: Error) => fail(err));

        return { sessionId: id };
    }

    private setupSsh2Tunnels(session: Ssh2Session) {
        const forwards = enabledForwards(session.host.id);
        if (forwards.length === 0) return;

        const emitInfo = (message: string) => {
            this.emit('data', { sessionId: session.id, data: `\x1b[36m${message}\x1b[0m\r\n` });
        };
        const emitError = (message: string) => {
            this.emit('data', { sessionId: session.id, data: `\x1b[31m${message}\x1b[0m\r\n` });
        };

        for (const forward of forwards) {
            if (forward.type === 'local') {
                const bindAddr = forward.bindAddress || '127.0.0.1';
                const server = net.createServer((local) => {
                    session.client.forwardOut(
                        bindAddr,
                        forward.bindPort,
                        forward.targetHost,
                        forward.targetPort,
                        (err, remote) => {
                            if (err) {
                                local.end();
                                emitError(
                                    `Tunnel ${bindAddr}:${forward.bindPort} → ${forward.targetHost}:${forward.targetPort} failed: ${err.message}`
                                );
                                return;
                            }
                            local.pipe(remote).pipe(local);
                        }
                    );
                });

                server.on('error', (err) => {
                    emitError(`Tunnel ${bindAddr}:${forward.bindPort} error: ${err.message}`);
                });

                server.listen(forward.bindPort, bindAddr, () => {
                    emitInfo(
                        `Tunnel -L ${bindAddr}:${forward.bindPort} → ${forward.targetHost}:${forward.targetPort} ready`
                    );
                });

                session.forwardServers.push(server);
            } else {
                const bindAddr = forward.bindAddress || '';
                session.client.forwardIn(bindAddr, forward.bindPort, (err, port) => {
                    if (err) {
                        emitError(`Reverse tunnel ${bindAddr}:${forward.bindPort} failed: ${err.message}`);
                        return;
                    }
                    session.remoteForwards.push({ address: bindAddr, port });
                    emitInfo(
                        `Tunnel -R ${bindAddr}:${port} → ${forward.targetHost}:${forward.targetPort} ready`
                    );
                });
            }
        }
    }

    private cleanupSsh2Tunnels(session: Ssh2Session) {
        for (const server of session.forwardServers) {
            try {
                server.close();
            } catch {
                // ignore
            }
        }
        session.forwardServers = [];

        for (const remote of session.remoteForwards) {
            try {
                session.client.unforwardIn(remote.address, remote.port, () => {});
            } catch {
                // ignore
            }
        }
        session.remoteForwards = [];
    }

    write(sessionId: string, data: string): boolean {
        const session = this.sessions.get(sessionId);
        if (!session) return false;

        if (session.kind === 'pty') {
            session.pty.write(data);
            return true;
        }

        if (session.stream) {
            session.stream.write(data);
            return true;
        }
        return false;
    }

    resize(sessionId: string, cols: number, rows: number): boolean {
        const session = this.sessions.get(sessionId);
        if (!session) return false;

        const safeCols = Math.max(cols, 1);
        const safeRows = Math.max(rows, 1);

        try {
            if (session.kind === 'pty') {
                session.pty.resize(safeCols, safeRows);
                return true;
            }
            if (session.stream) {
                session.stream.setWindow(safeRows, safeCols, 0, 0);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }

    close(sessionId: string): boolean {
        const session = this.sessions.get(sessionId);
        if (!session) return false;

        try {
            if (session.kind === 'pty') {
                session.pty.kill();
            } else {
                this.cleanupSsh2Tunnels(session);
                session.stream?.end();
                session.client.end();
            }
        } catch {
            // ignore
        }

        this.sessions.delete(sessionId);
        return true;
    }

    dispose() {
        for (const session of this.sessions.values()) {
            try {
                if (session.kind === 'pty') {
                    session.pty.kill();
                } else {
                    this.cleanupSsh2Tunnels(session);
                    session.stream?.end();
                    session.client.end();
                }
            } catch {
                // ignore
            }
        }
        this.sessions.clear();
    }
}
