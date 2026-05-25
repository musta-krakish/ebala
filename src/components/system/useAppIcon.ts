import { useEffect, useState } from 'react';

// Renderer-side cache: same .app bundle is requested by every row of the
// group on every poll, and the main-process icon lookup is cached too —
// this just avoids the IPC round-trip.
const iconCache = new Map<string, string | null>();
const pending = new Map<string, Promise<string | null>>();

async function fetchIcon(appPath: string): Promise<string | null> {
    if (iconCache.has(appPath)) return iconCache.get(appPath) ?? null;
    if (pending.has(appPath)) return pending.get(appPath)!;

    const promise = (async () => {
        try {
            const dataUrl = (await window.systemAPI.getAppIcon(appPath)) ?? null;
            iconCache.set(appPath, dataUrl);
            return dataUrl;
        } catch {
            iconCache.set(appPath, null);
            return null;
        } finally {
            pending.delete(appPath);
        }
    })();
    pending.set(appPath, promise);
    return promise;
}

export function useAppIcon(appPath: string | null): string | null {
    const [icon, setIcon] = useState<string | null>(() => (appPath ? iconCache.get(appPath) ?? null : null));

    useEffect(() => {
        if (!appPath) {
            setIcon(null);
            return;
        }
        let cancelled = false;
        fetchIcon(appPath).then((value) => {
            if (!cancelled) setIcon(value);
        });
        return () => {
            cancelled = true;
        };
    }, [appPath]);

    return icon;
}
