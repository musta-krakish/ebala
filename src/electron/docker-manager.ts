import { EventEmitter } from 'events';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { randomUUID } from 'crypto';
import { spawn as ptySpawn, type IPty } from 'node-pty';

const execFileP = promisify(execFile);

const RUN_TIMEOUT = 30_000;
const PRUNE_TIMEOUT = 120_000;

export interface DockerContainer {
    id: string;
    name: string;
    image: string;
    state: string;
    status: string;
    ports: string;
    command: string;
    createdAt: string;
    size: string;
}

export interface DockerImage {
    id: string;
    repository: string;
    tag: string;
    size: string;
    createdSince: string;
}

export interface DockerVolume {
    name: string;
    driver: string;
    mountpoint: string;
    scope: string;
}

export interface DockerNetwork {
    id: string;
    name: string;
    driver: string;
    scope: string;
}

export interface DockerRunOptions {
    image: string;
    name?: string | null;
    detached?: boolean;
    autoRemove?: boolean;
    ports?: Array<{ host: string; container: string }>;
    env?: Array<{ key: string; value: string }>;
    volumes?: Array<{ host: string; container: string }>;
    command?: string | null;
}

interface ExecSession {
    id: string;
    pty: IPty;
    containerId: string;
    containerName: string;
}

const parseJsonLines = <T>(stdout: string, map: (raw: Record<string, string>) => T): T[] => {
    return stdout
        .split('\n')
        .filter((line) => line.trim().length > 0)
        .map((line) => {
            try {
                return map(JSON.parse(line));
            } catch {
                return null;
            }
        })
        .filter((value): value is T => value !== null);
};

export class DockerManager extends EventEmitter {
    private execSessions = new Map<string, ExecSession>();

    async isAvailable(): Promise<{ available: boolean; version?: string; error?: string }> {
        try {
            const { stdout } = await execFileP(
                'docker',
                ['version', '--format', '{{.Server.Version}}'],
                { timeout: 4000 }
            );
            const version = stdout.trim();
            if (!version) {
                return { available: false, error: 'Docker daemon not responding' };
            }
            return { available: true, version };
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return { available: false, error: message };
        }
    }

    async listContainers(): Promise<DockerContainer[]> {
        const { stdout } = await execFileP(
            'docker',
            ['container', 'ls', '-a', '--format', '{{json .}}'],
            { timeout: RUN_TIMEOUT, maxBuffer: 4 * 1024 * 1024 }
        );

        return parseJsonLines<DockerContainer>(stdout, (raw) => ({
            id: raw.ID ?? '',
            name: raw.Names ?? '',
            image: raw.Image ?? '',
            state: (raw.State ?? '').toLowerCase(),
            status: raw.Status ?? '',
            ports: raw.Ports ?? '',
            command: raw.Command ?? '',
            createdAt: raw.CreatedAt ?? '',
            size: raw.Size ?? ''
        }));
    }

    async listImages(): Promise<DockerImage[]> {
        const { stdout } = await execFileP(
            'docker',
            ['image', 'ls', '--format', '{{json .}}'],
            { timeout: RUN_TIMEOUT, maxBuffer: 4 * 1024 * 1024 }
        );

        return parseJsonLines<DockerImage>(stdout, (raw) => ({
            id: raw.ID ?? '',
            repository: raw.Repository ?? '',
            tag: raw.Tag ?? '',
            size: raw.Size ?? '',
            createdSince: raw.CreatedSince ?? ''
        }));
    }

    async listVolumes(): Promise<DockerVolume[]> {
        const { stdout } = await execFileP(
            'docker',
            ['volume', 'ls', '--format', '{{json .}}'],
            { timeout: RUN_TIMEOUT, maxBuffer: 2 * 1024 * 1024 }
        );

        return parseJsonLines<DockerVolume>(stdout, (raw) => ({
            name: raw.Name ?? '',
            driver: raw.Driver ?? '',
            mountpoint: raw.Mountpoint ?? '',
            scope: raw.Scope ?? ''
        }));
    }

    async listNetworks(): Promise<DockerNetwork[]> {
        const { stdout } = await execFileP(
            'docker',
            ['network', 'ls', '--format', '{{json .}}'],
            { timeout: RUN_TIMEOUT, maxBuffer: 2 * 1024 * 1024 }
        );

        return parseJsonLines<DockerNetwork>(stdout, (raw) => ({
            id: raw.ID ?? '',
            name: raw.Name ?? '',
            driver: raw.Driver ?? '',
            scope: raw.Scope ?? ''
        }));
    }

    async runImage(options: DockerRunOptions): Promise<{ containerId: string }> {
        const args: string[] = ['run'];

        const detached = options.detached !== false;
        if (detached) args.push('-d');
        if (options.autoRemove) args.push('--rm');
        if (options.name && options.name.trim()) {
            args.push('--name', options.name.trim());
        }

        for (const port of options.ports ?? []) {
            const host = port.host.trim();
            const container = port.container.trim();
            if (!host || !container) continue;
            args.push('-p', `${host}:${container}`);
        }

        for (const env of options.env ?? []) {
            const key = env.key.trim();
            if (!key) continue;
            args.push('-e', `${key}=${env.value}`);
        }

        for (const volume of options.volumes ?? []) {
            const host = volume.host.trim();
            const container = volume.container.trim();
            if (!host || !container) continue;
            args.push('-v', `${host}:${container}`);
        }

        args.push(options.image);

        if (options.command && options.command.trim()) {
            // Naive split — docker run accepts the remaining args as the
            // container command. Users wanting shell quoting can wrap with
            // sh -c '...' explicitly.
            const tokens = options.command.trim().split(/\s+/);
            args.push(...tokens);
        }

        const { stdout } = await execFileP('docker', args, { timeout: RUN_TIMEOUT });
        return { containerId: stdout.trim() };
    }

    async startContainer(id: string): Promise<void> {
        await execFileP('docker', ['start', id], { timeout: RUN_TIMEOUT });
    }

    async stopContainer(id: string): Promise<void> {
        await execFileP('docker', ['stop', id], { timeout: RUN_TIMEOUT });
    }

    async restartContainer(id: string): Promise<void> {
        await execFileP('docker', ['restart', id], { timeout: RUN_TIMEOUT });
    }

    async removeContainer(id: string, force = false): Promise<void> {
        const args = ['rm', ...(force ? ['-f'] : []), id];
        await execFileP('docker', args, { timeout: RUN_TIMEOUT });
    }

    async removeImage(id: string, force = false): Promise<void> {
        const args = ['rmi', ...(force ? ['-f'] : []), id];
        await execFileP('docker', args, { timeout: RUN_TIMEOUT });
    }

    async removeVolume(name: string, force = false): Promise<void> {
        const args = ['volume', 'rm', ...(force ? ['-f'] : []), name];
        await execFileP('docker', args, { timeout: RUN_TIMEOUT });
    }

    async removeNetwork(name: string): Promise<void> {
        await execFileP('docker', ['network', 'rm', name], { timeout: RUN_TIMEOUT });
    }

    async pruneContainers(): Promise<string> {
        const { stdout } = await execFileP('docker', ['container', 'prune', '-f'], { timeout: PRUNE_TIMEOUT });
        return stdout;
    }

    async pruneImages(all = false): Promise<string> {
        const args = ['image', 'prune', '-f', ...(all ? ['-a'] : [])];
        const { stdout } = await execFileP('docker', args, { timeout: PRUNE_TIMEOUT });
        return stdout;
    }

    async pruneVolumes(): Promise<string> {
        const { stdout } = await execFileP('docker', ['volume', 'prune', '-f'], { timeout: PRUNE_TIMEOUT });
        return stdout;
    }

    async pruneNetworks(): Promise<string> {
        const { stdout } = await execFileP('docker', ['network', 'prune', '-f'], { timeout: PRUNE_TIMEOUT });
        return stdout;
    }

    async pruneSystem(all = false): Promise<string> {
        const args = ['system', 'prune', '-f', ...(all ? ['-a'] : [])];
        const { stdout } = await execFileP('docker', args, { timeout: PRUNE_TIMEOUT });
        return stdout;
    }

    async getLogs(containerId: string, tail = 500): Promise<string> {
        const { stdout, stderr } = await execFileP(
            'docker',
            ['logs', '--tail', String(tail), '--timestamps', containerId],
            { timeout: 15_000, maxBuffer: 16 * 1024 * 1024 }
        );
        // Docker writes container stdout to stdout and stderr to stderr; merge for display.
        return stdout + stderr;
    }

    startExec(containerId: string, containerName: string, cols = 120, rows = 30): { sessionId: string } {
        const id = randomUUID();
        // Prefer bash if present, fall back to sh — works for both Debian-ish and Alpine images.
        const shellCmd = '[ -x /bin/bash ] && exec /bin/bash || exec /bin/sh';
        const pty = ptySpawn(
            'docker',
            ['exec', '-it', containerId, '/bin/sh', '-c', shellCmd],
            {
                name: 'xterm-256color',
                cols,
                rows,
                cwd: process.cwd(),
                env: process.env as Record<string, string>
            }
        );

        this.execSessions.set(id, { id, pty, containerId, containerName });

        pty.onData((data) => this.emit('exec-data', { sessionId: id, data }));
        pty.onExit(({ exitCode, signal }) => {
            this.execSessions.delete(id);
            this.emit('exec-exit', { sessionId: id, exitCode, signal });
        });

        return { sessionId: id };
    }

    writeExec(sessionId: string, data: string): boolean {
        const session = this.execSessions.get(sessionId);
        if (!session) return false;
        session.pty.write(data);
        return true;
    }

    resizeExec(sessionId: string, cols: number, rows: number): boolean {
        const session = this.execSessions.get(sessionId);
        if (!session) return false;
        try {
            session.pty.resize(Math.max(cols, 1), Math.max(rows, 1));
            return true;
        } catch {
            return false;
        }
    }

    closeExec(sessionId: string): boolean {
        const session = this.execSessions.get(sessionId);
        if (!session) return false;
        try {
            session.pty.kill();
        } catch {
            // ignore
        }
        this.execSessions.delete(sessionId);
        return true;
    }

    ownsExec(sessionId: string): boolean {
        return this.execSessions.has(sessionId);
    }

    dispose(): void {
        for (const session of this.execSessions.values()) {
            try {
                session.pty.kill();
            } catch {
                // ignore
            }
        }
        this.execSessions.clear();
    }
}
