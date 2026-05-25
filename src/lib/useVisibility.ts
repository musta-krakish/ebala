import { useEffect, useState } from 'react';

// Page Visibility API — fires when an Electron BrowserWindow is hidden
// (Cmd+W to tray, hide(), occluded by another window). Polling hooks gate
// on this so we don't burn CPU/memory while nothing renders the result.
export function useVisibility(): boolean {
    const [visible, setVisible] = useState(() =>
        typeof document === 'undefined' || document.visibilityState === 'visible'
    );

    useEffect(() => {
        if (typeof document === 'undefined') return;
        const handler = () => setVisible(document.visibilityState === 'visible');
        document.addEventListener('visibilitychange', handler);
        return () => document.removeEventListener('visibilitychange', handler);
    }, []);

    return visible;
}
