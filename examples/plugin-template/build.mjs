// Builds the plugin into dist/main.cjs (CJS) and dist/renderer.js (IIFE).
// Run: node build.mjs   (esbuild is resolved from the host repo's node_modules)
import esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));

// Main: CJS, electron + node builtins stay external (provided by the host).
await esbuild.build({
    entryPoints: [path.join(dir, 'src/main.ts')],
    outfile: path.join(dir, 'dist/main.cjs'),
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'node20',
    external: ['electron'],
    logLevel: 'info'
});

// Renderer: IIFE, classic JSX, react aliased to the host's React instance.
await esbuild.build({
    entryPoints: [path.join(dir, 'src/renderer.tsx')],
    outfile: path.join(dir, 'dist/renderer.js'),
    bundle: true,
    format: 'iife',
    target: 'es2020',
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    alias: { react: path.join(dir, 'src/host-react.ts') },
    logLevel: 'info'
});

console.log('✓ plugin built → dist/');
