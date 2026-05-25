import { spawn, type ChildProcess, execFileSync } from 'child_process';
import { randomUUID } from 'crypto';
import { EventEmitter } from 'events';
import os from 'os';
import path from 'path';
import { resolveCredentials } from './ssh-credentials.ts';
import type { SshHost } from './ssh-config-parser.ts';

export type TransferDirection = 'upload' | 'download';

export interface TransferOptions {
    direction: TransferDirection;
    localPath: string;
    remotePath: string;
    dryRun?: boolean;
    mirror?: boolean;
    compress?: boolean;
}

export interface ActiveTransfer {
    id: string;
    hostId: string;
    hostAlias: string;
    direction: TransferDirection;
    localPath: string;
    remotePath: string;
    options: TransferOptions;
    state: 'running' | 'done' | 'error' | 'cancelled';
    bytesTransferred: number;
    percent: number;
    bytesPerSecond: number;
    eta: string;
    log: string[];
    stderr: string;
    command: string;
    startedAt: number;
    finishedAt?: number;
    exitCode?: number;
    error?: string;
}

interface InternalTransfer extends ActiveTransfer {
    process: ChildProcess;
    stdoutBuffer: string;
}

const PROGRESS_LINE = /([\d,]+)\s+(\d+)%\s+([\d.]+\S+)\s+(\d+:\d{2}:\d{2})/;

function expandHome(filePath: string): string {
    if (filePath.startsWith('~/')) return path.join(os.homedir(), filePath.slice(2));
    if (filePath === '~') return os.homedir();
    return filePath;
}

function buildSshFlag(creds: ReturnType<typeof resolveCredentials>, usingPassword: boolean): string {
    const parts = ['ssh', '-o', 'StrictHostKeyChecking=accept-new', '-o', 'ConnectTimeout=15'];
    // With key auth, force a non-interactive ssh — if the key isn't accepted
    // we get a clean error instead of rsync hanging on a password prompt.
    // With sshpass, BatchMode would block the password injection.
    if (!usingPassword) parts.push('-o', 'BatchMode=yes');
    if (creds.port && creds.port !== 22) parts.push('-p', String(creds.port));
    if (creds.identityFile) parts.push('-i', expandHome(creds.identityFile));
    return parts.join(' ');
}

function detectSshpass(): boolean {
    try {
        execFileSync('which', ['sshpass'], { stdio: ['ignore', 'pipe', 'ignore'] });
        return true;
    } catch {
        return false;
    }
}

// Apple ships rsync 2.6.9 (2006) which lacks --info=progress2 and
// --protect-args. Detect once so we can build legacy-compatible args
// when modern rsync (≥ 3.0) isn't installed.
function detectRsyncMajor(): number {
    try {
        const output = execFileSync('rsync', ['--version'], {
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore']
        });
        const match = output.match(/version\s+(\d+)\./);
        return match ? Number(match[1]) : 0;
    } catch {
        return 0;
    }
}

// Single-quote the path so the remote shell receives spaces / shell
// metacharacters as literal bytes. Only matters for rsync < 3.0 where
// --protect-args is unavailable.
function shellQuote(value: string): string {
    return `'${value.replace(/'/g, `'\\''`)}'`;
}

export class RsyncManager extends EventEmitter {
    private transfers = new Map<string, InternalTransfer>();
    private sshpassAvailable: boolean | null = null;
    private rsyncMajor: number | null = null;

    isSshpassAvailable(): boolean {
        if (this.sshpassAvailable === null) {
            this.sshpassAvailable = detectSshpass();
        }
        return this.sshpassAvailable;
    }

    getRsyncMajor(): number {
        if (this.rsyncMajor === null) {
            this.rsyncMajor = detectRsyncMajor();
        }
        return this.rsyncMajor;
    }

    list(): ActiveTransfer[] {
        return Array.from(this.transfers.values()).map(stripInternal);
    }

    async start(host: SshHost, options: TransferOptions): Promise<{ transferId: string }> {
        const creds = resolveCredentials(host);
        // If we have a stored password — use sshpass. ssh still tries keys
        // first; sshpass only kicks in when the server asks for a password.
        // Previously we also checked `!creds.agentSocket`, but SSH_AUTH_SOCK
        // is set on virtually every macOS shell whether the agent holds the
        // right key or not, so the password path was never taken.
        const usingPassword = Boolean(creds.password);

        if (usingPassword && !this.isSshpassAvailable()) {
            throw new Error(
                'This host needs a password, but sshpass is not installed. Install it via `brew install hudochenkov/sshpass/sshpass` or switch to key auth.'
            );
        }

        const id = randomUUID();
        const sshFlag = buildSshFlag(creds, usingPassword);
        const modernRsync = this.getRsyncMajor() >= 3;
        // Apple's bundled rsync 2.6.9 doesn't grok --info=progress2 or
        // --protect-args. Fall back to --progress (per-file) and quote the
        // remote path so spaces survive the remote shell.
        const remoteSpec = modernRsync
            ? `${creds.username}@${creds.hostname}:${options.remotePath}`
            : `${creds.username}@${creds.hostname}:${shellQuote(options.remotePath)}`;

        const rsyncArgs = ['-a'];
        if (modernRsync) {
            rsyncArgs.push('--info=progress2', '--protect-args');
        } else {
            rsyncArgs.push('--progress');
        }
        rsyncArgs.push('--partial', '-e', sshFlag);
        if (options.compress) rsyncArgs.push('--compress');
        if (options.mirror) rsyncArgs.push('--delete');
        if (options.dryRun) rsyncArgs.push('--dry-run');

        if (options.direction === 'upload') {
            rsyncArgs.push(options.localPath, remoteSpec);
        } else {
            rsyncArgs.push(remoteSpec, options.localPath);
        }

        let command: string;
        let args: string[];
        let env = { ...process.env } as NodeJS.ProcessEnv;

        if (usingPassword) {
            command = 'sshpass';
            args = ['-e', 'rsync', ...rsyncArgs];
            env = { ...env, SSHPASS: creds.password };
        } else {
            command = 'rsync';
            args = rsyncArgs;
        }

        const child = spawn(command, args, { env });

        const transfer: InternalTransfer = {
            id,
            hostId: host.id,
            hostAlias: host.alias,
            direction: options.direction,
            localPath: options.localPath,
            remotePath: options.remotePath,
            options,
            state: 'running',
            bytesTransferred: 0,
            percent: 0,
            bytesPerSecond: 0,
            eta: '',
            log: [],
            stderr: '',
            command: `${command} ${args.join(' ')}`,
            startedAt: Date.now(),
            process: child,
            stdoutBuffer: ''
        };
        this.transfers.set(id, transfer);
        this.emit('progress', stripInternal(transfer));

        child.stdout?.on('data', (chunk: Buffer) => this.handleStdout(transfer, chunk));
        child.stderr?.on('data', (chunk: Buffer) => this.handleStderr(transfer, chunk));

        child.on('error', (err) => {
            transfer.state = 'error';
            transfer.error = err.message;
            transfer.finishedAt = Date.now();
            this.emit('done', stripInternal(transfer));
            this.transfers.delete(id);
        });

        child.on('close', (code) => {
            if (transfer.state === 'cancelled') {
                transfer.finishedAt = Date.now();
                transfer.exitCode = code ?? undefined;
                this.emit('done', stripInternal(transfer));
                this.transfers.delete(id);
                return;
            }
            transfer.exitCode = code ?? undefined;
            transfer.finishedAt = Date.now();
            if (code === 0) {
                transfer.state = 'done';
                transfer.percent = 100;
            } else {
                transfer.state = 'error';
                transfer.error = transfer.stderr.trim() || `rsync exited with code ${code}`;
            }
            this.emit('done', stripInternal(transfer));
            this.transfers.delete(id);
        });

        return { transferId: id };
    }

    cancel(transferId: string): boolean {
        const transfer = this.transfers.get(transferId);
        if (!transfer) return false;
        transfer.state = 'cancelled';
        try {
            transfer.process.kill('SIGINT');
        } catch {
            // ignore
        }
        // Fall back to SIGKILL if rsync ignores SIGINT (rare for partials).
        setTimeout(() => {
            const stale = this.transfers.get(transferId);
            if (stale && !stale.process.killed) {
                try {
                    stale.process.kill('SIGKILL');
                } catch {
                    // ignore
                }
            }
        }, 2000);
        return true;
    }

    dispose(): void {
        for (const transfer of this.transfers.values()) {
            try {
                transfer.process.kill('SIGKILL');
            } catch {
                // ignore
            }
        }
        this.transfers.clear();
    }

    private handleStdout(transfer: InternalTransfer, chunk: Buffer): void {
        transfer.stdoutBuffer += chunk.toString('utf8');
        const segments = transfer.stdoutBuffer.split(/[\r\n]+/);
        transfer.stdoutBuffer = segments.pop() ?? '';

        for (const segment of segments) {
            const trimmed = segment.trim();
            if (!trimmed) continue;

            const match = trimmed.match(PROGRESS_LINE);
            if (match) {
                transfer.bytesTransferred = Number(match[1].replace(/,/g, ''));
                transfer.percent = Number(match[2]);
                transfer.bytesPerSecond = parseRate(match[3]);
                transfer.eta = match[4];
                this.emit('progress', stripInternal(transfer));
            } else {
                // Non-progress lines are file names and final summary — keep
                // the last ~50 for the UI log.
                transfer.log.push(trimmed);
                if (transfer.log.length > 50) transfer.log.shift();
            }
        }
    }

    private handleStderr(transfer: InternalTransfer, chunk: Buffer): void {
        transfer.stderr += chunk.toString('utf8');
        if (transfer.stderr.length > 4000) {
            transfer.stderr = transfer.stderr.slice(-4000);
        }
        // Push the stderr through the progress channel so the UI shows the
        // ssh / rsync diagnostic in real time instead of waiting for exit.
        this.emit('progress', stripInternal(transfer));
    }
}

function stripInternal(transfer: InternalTransfer): ActiveTransfer {
    const { process: _process, stdoutBuffer: _stdout, ...rest } = transfer;
    return rest;
}

function parseRate(token: string): number {
    const match = token.match(/^([\d.]+)([kMG]?B)\/s$/);
    if (!match) return 0;
    const value = Number(match[1]);
    const unit = match[2];
    const multiplier = unit === 'GB' ? 1024 ** 3 : unit === 'MB' ? 1024 ** 2 : unit === 'kB' ? 1024 : 1;
    return value * multiplier;
}
