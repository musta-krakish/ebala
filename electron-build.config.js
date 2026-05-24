import { build } from 'vite';

async function buildElectron() {
    await build({
        build: {
            outDir: 'dist-electron',
            emptyOutDir: true,
            rollupOptions: {
                input: {
                    preload: 'src/electron/preload.ts',
                    main: 'main.js'
                },
                output: {
                    format: 'cjs',
                    entryFileNames: '[name].js'
                }
            }
        }
    });
}

buildElectron();