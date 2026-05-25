import { stat as fsStat, readdir } from 'fs/promises';
import os from 'os';
import path from 'path';

export interface LocalEntry {
    name: string;
    path: string;
    isDir: boolean;
    isLink: boolean;
    size: number;
    mtimeMs: number;
}

export async function listLocal(dirPath: string): Promise<LocalEntry[]> {
    const target = dirPath || os.homedir();
    const entries = await readdir(target, { withFileTypes: true });

    const results = await Promise.all(
        entries.map(async (entry): Promise<LocalEntry | null> => {
            const full = path.join(target, entry.name);
            try {
                const stats = await fsStat(full);
                return {
                    name: entry.name,
                    path: full,
                    isDir: stats.isDirectory(),
                    isLink: entry.isSymbolicLink(),
                    size: stats.size,
                    mtimeMs: stats.mtimeMs
                };
            } catch {
                // Permission errors on individual entries shouldn't take out
                // the whole listing — skip the entry and keep going.
                return null;
            }
        })
    );

    return results
        .filter((entry): entry is LocalEntry => entry !== null)
        .sort((a, b) => {
            if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
            return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
        });
}

export function localHome(): string {
    return os.homedir();
}
