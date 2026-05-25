import { randomUUID } from 'crypto';
import { Client as Ssh2Client, type SFTPWrapper } from 'ssh2';
import { resolveCredentials } from './ssh-credentials.ts';
import { resolveHost, tcpPreflight } from './host-resolver.ts';
import type { SshHost } from './ssh-config-parser.ts';

export interface SftpEntry {
    name: string;
    path: string;
    isDir: boolean;
    isLink: boolean;
    size: number;
    mtimeMs: number;
}

interface SftpSession {
    id: string;
    hostId: string;
    client: Ssh2Client;
    sftp: SFTPWrapper;
    homePath: string;
}

export class SftpManager {
    private sessions = new Map<string, SftpSession>();

    async connect(host: SshHost): Promise<{ sessionId: string; homePath: string }> {
        const creds = resolveCredentials(host);
        const resolved = await resolveHost(creds.hostname);
        if (resolved.via === 'unresolved') {
            throw new Error(
                `Could not resolve ${creds.hostname}. For Tailscale, try the 100.x.x.x IP or full .ts.net name.`
            );
        }
        try {
            await tcpPreflight(resolved.address, creds.port, 8000);
        } catch (err) {
            const detail = err instanceof Error ? err.message : String(err);
            throw new Error(
                `${detail}. Tailscale tunnel up? Try \`tailscale ping ${creds.hostname}\`.`
            );
        }
        const client = new Ssh2Client();

        const ready = new Promise<void>((resolve, reject) => {
            client.once('ready', () => resolve());
            client.once('error', (err) => reject(err));
        });

        client.connect({
            host: resolved.address,
            port: creds.port,
            username: creds.username,
            password: creds.password,
            privateKey: creds.privateKey,
            agent: creds.agentSocket,
            tryKeyboard: false,
            readyTimeout: 15000,
            keepaliveInterval: 30000
        });

        await ready;

        const sftp = await new Promise<SFTPWrapper>((resolve, reject) => {
            client.sftp((err, wrapper) => (err ? reject(err) : resolve(wrapper)));
        });

        const homePath = await new Promise<string>((resolve) => {
            sftp.realpath('.', (err, resolved) => {
                if (err || !resolved) resolve('/');
                else resolve(resolved);
            });
        });

        const id = randomUUID();
        this.sessions.set(id, { id, hostId: host.id, client, sftp, homePath });

        client.on('close', () => {
            this.sessions.delete(id);
        });

        return { sessionId: id, homePath };
    }

    async list(sessionId: string, dirPath: string): Promise<SftpEntry[]> {
        const session = this.requireSession(sessionId);
        const target = dirPath || session.homePath;

        const resolved = await new Promise<string>((resolve, reject) => {
            session.sftp.realpath(target, (err, value) => (err ? reject(err) : resolve(value)));
        });

        const entries = await new Promise<Array<{ filename: string; longname: string; attrs: { isDirectory: () => boolean; isSymbolicLink: () => boolean; size: number; mtime: number } }>>((resolve, reject) => {
            session.sftp.readdir(resolved, (err, list) => (err ? reject(err) : resolve(list as any)));
        });

        return entries
            .filter((entry) => entry.filename !== '.' && entry.filename !== '..')
            .map((entry) => ({
                name: entry.filename,
                path: posixJoin(resolved, entry.filename),
                isDir: entry.attrs.isDirectory(),
                isLink: entry.attrs.isSymbolicLink(),
                size: entry.attrs.size ?? 0,
                mtimeMs: (entry.attrs.mtime ?? 0) * 1000
            }))
            .sort(compareEntries);
    }

    async mkdir(sessionId: string, dirPath: string): Promise<void> {
        const session = this.requireSession(sessionId);
        await new Promise<void>((resolve, reject) => {
            session.sftp.mkdir(dirPath, (err) => (err ? reject(err) : resolve()));
        });
    }

    async remove(sessionId: string, targetPath: string, isDir: boolean): Promise<void> {
        const session = this.requireSession(sessionId);
        await new Promise<void>((resolve, reject) => {
            const op = isDir ? session.sftp.rmdir.bind(session.sftp) : session.sftp.unlink.bind(session.sftp);
            op(targetPath, (err) => (err ? reject(err) : resolve()));
        });
    }

    disconnect(sessionId: string): boolean {
        const session = this.sessions.get(sessionId);
        if (!session) return false;
        try {
            session.client.end();
        } catch {
            // ignore
        }
        this.sessions.delete(sessionId);
        return true;
    }

    dispose(): void {
        for (const session of this.sessions.values()) {
            try {
                session.client.end();
            } catch {
                // ignore
            }
        }
        this.sessions.clear();
    }

    private requireSession(sessionId: string): SftpSession {
        const session = this.sessions.get(sessionId);
        if (!session) throw new Error(`SFTP session ${sessionId} not found`);
        return session;
    }
}

function posixJoin(dir: string, name: string): string {
    if (dir.endsWith('/')) return `${dir}${name}`;
    return `${dir}/${name}`;
}

function compareEntries(a: SftpEntry, b: SftpEntry): number {
    if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
}
