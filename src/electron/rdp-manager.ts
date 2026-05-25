import { spawn, type ChildProcess, execFileSync } from 'child_process';
import { randomUUID } from 'crypto';
import { EventEmitter } from 'events';
import { getRdpHost, getRdpHostPassword, type RdpHost } from './rdp-hosts.ts';

export interface ActiveRdpSession {
    id: string;
    hostId: number;
    label: string;
    hostname: string;
    port: number;
    pid: number;
    startedAt: number;
}

interface InternalSession extends ActiveRdpSession {
    process: ChildProcess;
    stderrBuffer: string;
}

function detectBinary(): string | null {
    // Prefer the SDL client on macOS — xfreerdp is the X11 client and
    // hangs on "failed to open display" without XQuartz. SDL renders
    // natively into a Cocoa window. FreeRDP 3.x: `sdl-freerdp3`. Some
    // brew formulae also expose `sdl-freerdp`.
    for (const candidate of ['sdl-freerdp3', 'sdl-freerdp', 'xfreerdp3', 'xfreerdp']) {
        try {
            execFileSync('which', [candidate], { stdio: ['ignore', 'pipe', 'ignore'] });
            return candidate;
        } catch {
            // try next
        }
    }
    return null;
}

export class RdpManager extends EventEmitter {
    private sessions = new Map<string, InternalSession>();
    private binary: string | null | undefined;

    getBinary(): string | null {
        if (this.binary === undefined) {
            this.binary = detectBinary();
        }
        return this.binary;
    }

    isAvailable(): boolean {
        return this.getBinary() !== null;
    }

    list(): ActiveRdpSession[] {
        return Array.from(this.sessions.values()).map((session) => ({
            id: session.id,
            hostId: session.hostId,
            label: session.label,
            hostname: session.hostname,
            port: session.port,
            pid: session.pid,
            startedAt: session.startedAt
        }));
    }

    async connect(hostId: number): Promise<{ sessionId: string }> {
        const binary = this.getBinary();
        if (!binary) {
            throw new Error(
                'xfreerdp is not installed. Run `brew install freerdp` and restart the app.'
            );
        }

        const host = getRdpHost(hostId);
        if (!host) throw new Error(`RDP host ${hostId} not found`);

        const password = getRdpHostPassword(hostId);
        const args = buildArgs(host, password);

        const child = spawn(binary, args, {
            detached: true,
            stdio: ['ignore', 'ignore', 'pipe']
        });

        // Detach from our process group so xfreerdp's window survives if the
        // app reloads (Cmd+R in dev). disconnect() is the canonical way to
        // close it.
        if (typeof child.unref === 'function') child.unref();

        const id = randomUUID();
        const session: InternalSession = {
            id,
            hostId: host.id,
            label: host.label,
            hostname: host.hostname,
            port: host.port,
            pid: child.pid ?? -1,
            startedAt: Date.now(),
            process: child,
            stderrBuffer: ''
        };

        this.sessions.set(id, session);
        this.emit('active-changed', this.list());

        child.stderr?.on('data', (chunk: Buffer) => {
            session.stderrBuffer += chunk.toString('utf8');
            if (session.stderrBuffer.length > 4000) {
                session.stderrBuffer = session.stderrBuffer.slice(-4000);
            }
        });

        child.on('error', (err) => {
            this.sessions.delete(id);
            this.emit('active-changed', this.list());
            this.emit('exit', {
                sessionId: id,
                hostId: host.id,
                error: err.message,
                stderr: session.stderrBuffer
            });
        });

        child.on('close', (code) => {
            this.sessions.delete(id);
            this.emit('active-changed', this.list());
            this.emit('exit', {
                sessionId: id,
                hostId: host.id,
                exitCode: code,
                stderr: session.stderrBuffer
            });
        });

        return { sessionId: id };
    }

    disconnect(sessionId: string): boolean {
        const session = this.sessions.get(sessionId);
        if (!session) return false;
        try {
            session.process.kill('SIGTERM');
        } catch {
            // ignore
        }
        setTimeout(() => {
            if (this.sessions.has(sessionId)) {
                try {
                    session.process.kill('SIGKILL');
                } catch {
                    // ignore
                }
            }
        }, 2000);
        return true;
    }

    dispose(): void {
        for (const session of this.sessions.values()) {
            try {
                session.process.kill('SIGTERM');
            } catch {
                // ignore
            }
        }
        this.sessions.clear();
    }
}

function buildArgs(host: RdpHost, password: string | null): string[] {
    const args: string[] = [];
    args.push(`/v:${host.hostname}:${host.port}`);
    args.push(`/u:${host.username}`);
    if (host.domain) args.push(`/d:${host.domain}`);
    if (password) args.push(`/p:${password}`);
    args.push('/cert:ignore', '+clipboard', '/dynamic-resolution');
    // Tokenise extra args on whitespace — naive split is fine for flag-style
    // args; users wanting to embed spaces can supply them via the form one
    // arg per line and we still split on \s+.
    if (host.extraArgs) {
        const tokens = host.extraArgs
            .split(/\s+/)
            .map((token) => token.trim())
            .filter(Boolean);
        args.push(...tokens);
    }
    return args;
}
