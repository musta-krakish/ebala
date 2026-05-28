// Plugin install/uninstall: clone a git repo, validate its structure, and
// delete it if invalid. Validation happens on the cloned files before any
// plugin code is loaded.
import { existsSync } from 'fs';
import { mkdir, rename, rm, writeFile } from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import { readPluginDir } from './external-main.js';

const CLONE_TIMEOUT_MS = 60000;

function runGit(args, cwd) {
    return new Promise((resolve, reject) => {
        const proc = spawn('git', args, { cwd, env: process.env });
        let stderr = '';
        proc.stderr.on('data', (chunk) => {
            stderr += chunk.toString();
        });
        const timer = setTimeout(() => {
            proc.kill('SIGKILL');
            reject(new Error('git clone timed out'));
        }, CLONE_TIMEOUT_MS);
        proc.on('error', (err) => {
            clearTimeout(timer);
            reject(err);
        });
        proc.on('close', (code) => {
            clearTimeout(timer);
            if (code === 0) resolve();
            else reject(new Error(stderr.trim() || `git exited with code ${code}`));
        });
    });
}

// Clone → validate → keep-or-delete. `existingIds` are ids already taken
// (built-in + installed) so we reject collisions. Returns { ok, manifest, dir }
// or { ok:false, errors }.
export async function installPlugin(gitUrl, baseDir, existingIds) {
    await mkdir(baseDir, { recursive: true });
    const tmp = path.join(baseDir, `.tmp-${Date.now()}`);

    try {
        await runGit(['clone', '--depth', '1', gitUrl, tmp], baseDir);
    } catch (err) {
        await rm(tmp, { recursive: true, force: true });
        return { ok: false, errors: [`clone failed: ${err.message}`] };
    }

    const res = await readPluginDir(tmp);
    if (!res.manifest) {
        await rm(tmp, { recursive: true, force: true });
        return { ok: false, errors: res.errors };
    }

    const manifest = res.manifest;
    if (existingIds.includes(manifest.id)) {
        await rm(tmp, { recursive: true, force: true });
        return { ok: false, errors: [`a plugin with id "${manifest.id}" is already installed or built-in`] };
    }

    const dest = path.join(baseDir, manifest.id);
    if (existsSync(dest)) await rm(dest, { recursive: true, force: true });
    await rename(tmp, dest);

    // Remember where it came from (shown in settings, kept out of plugin.json).
    manifest.source = gitUrl;
    await writeFile(path.join(dest, '.installed.json'), JSON.stringify({ source: gitUrl, installedAt: Date.now() }, null, 2));

    return { ok: true, manifest, dir: dest };
}

export async function uninstallPlugin(id, baseDir) {
    await rm(path.join(baseDir, id), { recursive: true, force: true });
}
