// Discovery + loading of installed external plugins (userData/plugins/<id>/).
// Validation is static (reads plugin.json + checks declared files exist) and
// runs BEFORE any plugin code executes.
import { existsSync } from 'fs';
import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';
import { validateManifest } from './manifest.ts';

export function pluginsDir(userDataPath) {
    return path.join(userDataPath, 'plugins');
}

// Read + validate one plugin directory. Returns { dir, manifest } on success,
// or { dir, errors } describing why it was rejected. Never executes code.
export async function readPluginDir(dir) {
    const manifestPath = path.join(dir, 'plugin.json');
    if (!existsSync(manifestPath)) return { dir, errors: ['plugin.json is missing'] };

    let parsed;
    try {
        parsed = JSON.parse(await readFile(manifestPath, 'utf8'));
    } catch {
        return { dir, errors: ['plugin.json is not valid JSON'] };
    }

    const result = validateManifest(parsed);
    if (!result.ok) return { dir, errors: result.errors };

    const manifest = result.manifest;
    const fileErrors = [];
    if (manifest.capabilities.main && !existsSync(path.join(dir, manifest.capabilities.main))) {
        fileErrors.push(`main entry not found: ${manifest.capabilities.main}`);
    }
    if (manifest.capabilities.renderer && !existsSync(path.join(dir, manifest.capabilities.renderer))) {
        fileErrors.push(`renderer entry not found: ${manifest.capabilities.renderer}`);
    }
    if (fileErrors.length > 0) return { dir, errors: fileErrors };

    // Source URL persisted at install time (sidecar, kept out of plugin.json).
    try {
        const meta = JSON.parse(await readFile(path.join(dir, '.installed.json'), 'utf8'));
        if (typeof meta.source === 'string') manifest.source = meta.source;
    } catch {
        // no sidecar — source unknown, fine
    }

    return { dir, manifest };
}

export async function discoverPlugins(baseDir) {
    if (!existsSync(baseDir)) return [];
    const out = [];
    for (const entry of await readdir(baseDir, { withFileTypes: true })) {
        if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
        const res = await readPluginDir(path.join(baseDir, entry.name));
        if (res.manifest) out.push(res);
    }
    return out;
}

// Dynamically import an external plugin's main entry → MainPlugin object.
// Cache-busted so a reinstall picks up fresh code without an app restart.
export async function loadExternalMainPlugin(dir, manifest) {
    if (!manifest.capabilities.main) return null;
    const mainPath = path.join(dir, manifest.capabilities.main);
    const url = `${pathToFileURL(mainPath).href}?t=${Date.now()}`;
    const mod = await import(url);
    const factory = mod.createPlugin ?? mod.default;
    const plugin = typeof factory === 'function' ? factory() : factory;
    if (!plugin || typeof plugin.setup !== 'function') {
        throw new Error(`plugin "${manifest.id}" main entry must export createPlugin() returning { setup }`);
    }
    plugin.id = manifest.id;
    return plugin;
}
