import { execFile } from 'child_process';
import { promisify } from 'util';
import os from 'os';

const execFileP = promisify(execFile);

export interface TerminalContext {
    /** Home-abbreviated cwd for display (e.g. ~/Documents/app). */
    cwd: string;
    gitBranch?: string;
    gitDirty?: boolean;
    node?: string;
    python?: string;
}

let cachedNode: string | undefined;
let cachedPython: string | undefined;
let versionsLoaded = false;

async function run(cmd: string, args: string[]): Promise<string | undefined> {
    try {
        const { stdout } = await execFileP(cmd, args, { timeout: 2500, env: process.env });
        return stdout.trim();
    } catch {
        return undefined;
    }
}

// node/python versions don't change per cwd — resolve once and cache.
async function loadVersions(): Promise<void> {
    if (versionsLoaded) return;
    versionsLoaded = true;
    cachedNode = await run('node', ['-v']);
    const py = (await run('python3', ['--version'])) ?? (await run('python', ['--version']));
    cachedPython = py?.replace(/^Python\s+/i, 'v');
}

function abbreviate(cwd: string): string {
    const home = os.homedir();
    return cwd === home ? '~' : cwd.startsWith(home + '/') ? '~' + cwd.slice(home.length) : cwd;
}

export async function getTerminalContext(cwd: string): Promise<TerminalContext> {
    await loadVersions();

    const branch = await run('git', ['-C', cwd, 'rev-parse', '--abbrev-ref', 'HEAD']);
    const gitBranch = branch && branch !== 'HEAD' ? branch : undefined;
    let gitDirty: boolean | undefined;
    if (gitBranch) {
        const status = await run('git', ['-C', cwd, 'status', '--porcelain']);
        gitDirty = Boolean(status && status.length > 0);
    }

    return { cwd: abbreviate(cwd), gitBranch, gitDirty, node: cachedNode, python: cachedPython };
}
