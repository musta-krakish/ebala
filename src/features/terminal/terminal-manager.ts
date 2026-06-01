import { EventEmitter } from 'events';
import { randomUUID } from 'crypto';
import os from 'os';
import { spawn as ptySpawn, type IPty } from 'node-pty';
import { buildShellIntegration } from './shell-integration.ts';

interface TerminalSession {
    id: string;
    pty: IPty;
    cleanup: () => void;
}

export interface SpawnOptions {
    shell?: string;
    cwd?: string;
    cols?: number;
    rows?: number;
}

/**
 * Owns local shell PTY sessions for the Warp-like Terminal tab. Mirrors the
 * DockerManager exec lifecycle (spawn → onData/onExit → write/resize/kill) but
 * runs the user's own $SHELL on this machine. Independent of SSH/Docker — its
 * own `terminal:*` IPC channels carry a raw, unshared stream so the renderer
 * can layer block segmentation on top later.
 */
export class TerminalManager extends EventEmitter {
    private sessions = new Map<string, TerminalSession>();

    spawn(options: SpawnOptions = {}): { sessionId: string } {
        const id = randomUUID();
        const shell = options.shell || process.env.SHELL || '/bin/zsh';
        const cwd = options.cwd || os.homedir();
        const cols = options.cols ?? 120;
        const rows = options.rows ?? 30;

        // Inject OSC-133 shell integration (login+interactive, rc files loaded).
        const integration = buildShellIntegration(shell, process.env);

        const pty = ptySpawn(shell, integration.args, {
            name: 'xterm-256color',
            cols,
            rows,
            cwd,
            env: integration.env
        });

        this.sessions.set(id, { id, pty, cleanup: integration.cleanup });

        pty.onData((data) => this.emit('data', { sessionId: id, data }));
        pty.onExit(({ exitCode, signal }) => {
            this.sessions.delete(id);
            integration.cleanup();
            this.emit('exit', { sessionId: id, exitCode, signal });
        });

        return { sessionId: id };
    }

    write(sessionId: string, data: string): boolean {
        const session = this.sessions.get(sessionId);
        if (!session) return false;
        session.pty.write(data);
        return true;
    }

    resize(sessionId: string, cols: number, rows: number): boolean {
        const session = this.sessions.get(sessionId);
        if (!session) return false;
        try {
            session.pty.resize(Math.max(1, cols), Math.max(1, rows));
            return true;
        } catch {
            return false;
        }
    }

    close(sessionId: string): boolean {
        const session = this.sessions.get(sessionId);
        if (!session) return false;
        try {
            session.pty.kill();
        } catch {
            // already gone
        }
        session.cleanup();
        this.sessions.delete(sessionId);
        return true;
    }

    owns(sessionId: string): boolean {
        return this.sessions.has(sessionId);
    }

    dispose(): void {
        for (const { pty, cleanup } of this.sessions.values()) {
            try {
                pty.kill();
            } catch {
                // ignore
            }
            cleanup();
        }
        this.sessions.clear();
    }
}
