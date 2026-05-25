import { existsSync } from 'fs';
import { lstat, opendir } from 'fs/promises';
import path from 'path';
import { EventEmitter } from 'events';

export interface DiskNode {
    name: string;
    path: string;
    size: number;
    isDir: boolean;
    children?: DiskNode[];
}

export interface ScanProgress {
    pathsSeen: number;
    bytesSoFar: number;
}

const SKIP_BASENAMES = new Set([
    '.Spotlight-V100',
    '.Trashes',
    '.fseventsd',
    '.DocumentRevisions-V100',
    '.TemporaryItems',
    '.MobileBackups',
    '.PKInstallSandboxManager',
    '.HFS+ Private Directory Data'
]);

const SKIP_PATH_PREFIXES = [
    '/dev',
    '/Volumes',
    '/private/var/folders',
    '/.vol',
    '/System/Volumes/VM',
    '/System/Volumes/Preboot',
    '/System/Volumes/Update'
];

// Path suffixes that hang readdir because the file provider tries to fetch
// remote content on demand. iCloud Drive is the worst offender — touching
// it can stall the scan indefinitely.
const SKIP_PATH_CONTAINS = [
    '/Library/Mobile Documents',
    '/.MobileBackups',
    '/.PreviousSystemInformation',
    '/Library/Application Support/MobileSync',
    '/Library/CloudStorage'
];

function shouldSkip(filePath: string, basename: string): boolean {
    if (SKIP_BASENAMES.has(basename)) return true;
    for (const prefix of SKIP_PATH_PREFIXES) {
        if (filePath === prefix || filePath.startsWith(prefix + '/')) return true;
    }
    for (const fragment of SKIP_PATH_CONTAINS) {
        if (filePath.includes(fragment)) return true;
    }
    return false;
}

const KEEP_DEPTH = 12;
const PROGRESS_EVERY_PATHS = 250;
const FS_TIMEOUT_MS = 5000;
const MAX_CONCURRENT_FS = 32;

class Semaphore {
    private active = 0;
    private waiters: Array<() => void> = [];
    private readonly max: number;

    constructor(max: number) {
        this.max = max;
    }

    async acquire(): Promise<void> {
        if (this.active >= this.max) {
            await new Promise<void>((resolve) => this.waiters.push(resolve));
        }
        this.active += 1;
    }

    release(): void {
        this.active -= 1;
        const next = this.waiters.shift();
        if (next) next();
    }
}

// Race a promise against a timeout. The underlying op continues in libuv
// even after we give up — we just stop waiting. With FS_TIMEOUT_MS at 5s
// and MAX_CONCURRENT_FS at 32, the pool can still suffer if many calls
// genuinely hang, but the scan as a whole keeps moving instead of stalling.
async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
    let timer: NodeJS.Timeout | undefined;
    try {
        return await Promise.race([
            promise,
            new Promise<null>((resolve) => {
                timer = setTimeout(() => resolve(null), ms);
            })
        ]);
    } finally {
        if (timer) clearTimeout(timer);
    }
}

interface ScanContext {
    sem: Semaphore;
    cancelled: { value: boolean };
    pathsSeen: number;
    bytesSoFar: number;
    emitter: EventEmitter;
}

function emitProgress(ctx: ScanContext): void {
    ctx.emitter.emit('progress', {
        pathsSeen: ctx.pathsSeen,
        bytesSoFar: ctx.bytesSoFar
    } satisfies ScanProgress);
}

class CancelledError extends Error {
    constructor() {
        super('cancelled');
        this.name = 'CancelledError';
    }
}

async function walk(dirPath: string, depth: number, ctx: ScanContext): Promise<DiskNode> {
    if (ctx.cancelled.value) throw new CancelledError();

    const baseName = path.basename(dirPath) || dirPath;
    if (depth > 0 && shouldSkip(dirPath, baseName)) {
        return { name: baseName, path: dirPath, size: 0, isDir: true };
    }

    ctx.pathsSeen += 1;
    if (ctx.pathsSeen % PROGRESS_EVERY_PATHS === 0) emitProgress(ctx);

    let filesBytes = 0;
    const subdirPaths: string[] = [];

    // Phase 1 — hold a slot only while doing this dir's fs work.
    // Releasing before awaiting children is critical; otherwise sub-walks
    // can't acquire slots and we deadlock at concurrency depth = MAX.
    await ctx.sem.acquire();
    try {
        const dir = await withTimeout(opendir(dirPath), FS_TIMEOUT_MS);
        if (!dir) {
            return { name: baseName, path: dirPath, size: 0, isDir: true };
        }
        try {
            for await (const entry of dir) {
                if (ctx.cancelled.value) break;
                if (entry.isSymbolicLink()) continue;

                const full = path.join(dirPath, entry.name);
                if (shouldSkip(full, entry.name)) continue;

                if (entry.isDirectory()) {
                    subdirPaths.push(full);
                } else if (entry.isFile()) {
                    const stats = await withTimeout(lstat(full), FS_TIMEOUT_MS);
                    if (stats) {
                        filesBytes += stats.size;
                        ctx.bytesSoFar += stats.size;
                    }
                }
            }
        } catch {
            // for-await may throw mid-iteration on permission errors —
            // keep what we counted so far.
        }
    } catch {
        // opendir failed entirely (permission denied, vanished, etc).
    } finally {
        ctx.sem.release();
    }

    if (ctx.cancelled.value) throw new CancelledError();

    // Phase 2 — fan out children outside the slot.
    const children = await Promise.all(
        subdirPaths.map((p) => walk(p, depth + 1, ctx))
    );

    const subSize = children.reduce((sum, child) => sum + child.size, 0);
    const totalSize = filesBytes + subSize;

    if (depth >= KEEP_DEPTH) {
        return { name: baseName, path: dirPath, size: totalSize, isDir: true };
    }

    const kept = children.filter((child) => child.size > 0);
    if (filesBytes > 0) {
        kept.push({
            name: '(files)',
            path: `${dirPath}/.files`,
            size: filesBytes,
            isDir: false
        });
    }
    kept.sort((a, b) => b.size - a.size);

    return {
        name: baseName,
        path: dirPath,
        size: totalSize,
        isDir: true,
        children: kept
    };
}

export class DiskScanner extends EventEmitter {
    private currentCancel: { value: boolean } | null = null;

    isScanning(): boolean {
        return this.currentCancel !== null;
    }

    cancel(): void {
        if (this.currentCancel) this.currentCancel.value = true;
        this.currentCancel = null;
    }

    resolveRoot(requested: string): string {
        if (!requested || requested === '/') {
            if (existsSync('/System/Volumes/Data')) return '/System/Volumes/Data';
        }
        return requested;
    }

    async scan(rootPath: string): Promise<DiskNode | null> {
        this.cancel();
        const resolvedRoot = this.resolveRoot(rootPath);
        const cancelled = { value: false };
        this.currentCancel = cancelled;

        const ctx: ScanContext = {
            sem: new Semaphore(MAX_CONCURRENT_FS),
            cancelled,
            pathsSeen: 0,
            bytesSoFar: 0,
            emitter: this
        };

        try {
            const tree = await walk(resolvedRoot, 0, ctx);
            emitProgress(ctx);
            return tree;
        } catch (err) {
            // Cancellation is normal — the renderer pre-empted the scan or
            // the user cancelled. Don't surface it as an IPC error.
            if (err instanceof CancelledError) return null;
            throw err;
        } finally {
            if (this.currentCancel === cancelled) this.currentCancel = null;
        }
    }
}
