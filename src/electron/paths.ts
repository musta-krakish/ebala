import { app } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// In dev this file is loaded as `src/electron/paths.ts` so __dirname points at
// src/electron/ — alongside the media .swift sources. In packaged builds every
// .swift source is flattened into Contents/Resources/swift/ via electron-
// builder's `extraResources`, so the source location no longer matters.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// `devDir` lets a co-located feature point at its own folder for the dev-time
// .swift sources (e.g. src/features/bluetooth). Packaged builds ignore it and
// always read from the flattened resources dir.
export function helperSourceDir(devDir?: string): string {
    return app.isPackaged
        ? path.join(process.resourcesPath, 'swift')
        : (devDir ?? __dirname);
}

// Compiled Swift helpers must live somewhere writable. In dev we used to
// stuff them under node_modules/.cache, but that's read-only inside an
// installed .app — userData is always writable.
export function helperCacheDir(): string {
    return path.join(app.getPath('userData'), 'swift-helpers');
}
