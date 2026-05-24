import { app } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// In dev, this file is loaded as `src/electron/paths.ts` so __dirname points
// at src/electron/ — alongside the .swift sources. In packaged builds the
// whole main bundle lives at .../app.asar/dist-electron/main.cjs and the
// Swift files are unpacked via electron-builder's `extraResources` to
// Contents/Resources/swift/.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function helperSourceDir(): string {
    return app.isPackaged
        ? path.join(process.resourcesPath, 'swift')
        : __dirname;
}

// Compiled Swift helpers must live somewhere writable. In dev we used to
// stuff them under node_modules/.cache, but that's read-only inside an
// installed .app — userData is always writable.
export function helperCacheDir(): string {
    return path.join(app.getPath('userData'), 'swift-helpers');
}
