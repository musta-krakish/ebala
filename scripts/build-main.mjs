#!/usr/bin/env node
// Bundles main.js (and every .ts file it imports under src/electron) into a
// single CJS file at dist-electron/main.cjs. Native modules and Electron
// stay external — electron-builder copies them via the regular node_modules
// inclusion. Swift sources are not bundled; electron-builder copies them
// separately via the `extraResources` setting.

import esbuild from 'esbuild';
import { copyFile, mkdir, readdir, rm } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const outDir = path.join(projectRoot, 'dist-electron');

// Things that must NOT be bundled: Electron itself + every native module +
// sql.js (loads its own .wasm at runtime via require.resolve).
const EXTERNAL = [
    'electron',
    'electron/main',
    'node-pty',
    'ssh2',
    'cpu-features',
    'sql.js',
    'better-sqlite3'
];

async function main() {
    await rm(outDir, { recursive: true, force: true });
    await mkdir(outDir, { recursive: true });

    await esbuild.build({
        entryPoints: [path.join(projectRoot, 'main.js')],
        outfile: path.join(outDir, 'main.cjs'),
        bundle: true,
        platform: 'node',
        format: 'cjs',
        target: 'node20',
        external: EXTERNAL,
        sourcemap: 'linked',
        logLevel: 'info',
        // Tell esbuild how to resolve `.ts` imports in main.js — we strip the
        // extension at runtime via Node 22 type stripping in dev, but for the
        // bundle we just consume the files directly.
        resolveExtensions: ['.ts', '.mjs', '.cjs', '.js', '.json'],
        loader: { '.ts': 'ts' },
        // Source code uses `import.meta.url` (ESM) for resolving paths next
        // to the current file. After bundling to a single CJS file we need a
        // CJS-equivalent — point both at the bundle itself.
        banner: {
            js: "const __cjs_meta_url = require('url').pathToFileURL(__filename).href;"
        },
        define: {
            'import.meta.url': '__cjs_meta_url'
        }
    });

    // Preload — copied verbatim, no bundling needed (it only uses Electron's
    // built-in contextBridge / ipcRenderer).
    await copyFile(
        path.join(projectRoot, 'src', 'electron', 'preload.cjs'),
        path.join(outDir, 'preload.cjs')
    );

    // Swift sources are flattened into a sibling `swift/` dir; electron-builder
    // ships them to Contents/Resources/swift/ (where helperSourceDir() reads
    // them in packaged builds). Sources live next to their feature
    // (src/features/<f>/) or in src/electron — collect from anywhere under src.
    // Filenames must stay unique since they flatten into one dir.
    const swiftDir = path.join(outDir, 'swift');
    await mkdir(swiftDir, { recursive: true });
    const collectSwift = async (dir) => {
        const found = [];
        for (const entry of await readdir(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) found.push(...(await collectSwift(full)));
            else if (entry.name.endsWith('.swift')) found.push(full);
        }
        return found;
    };
    for (const file of await collectSwift(path.join(projectRoot, 'src'))) {
        await copyFile(file, path.join(swiftDir, path.basename(file)));
    }

    console.log(`✓ Bundled main → ${path.relative(projectRoot, outDir)}/main.cjs`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
