import { useEffect, useState } from 'react';

export function useTransfers() {
    const [active, setActive] = useState<ActiveTransfer[]>([]);
    const [recentDone, setRecentDone] = useState<ActiveTransfer[]>([]);

    useEffect(() => {
        if (typeof window === 'undefined' || !window.transferAPI) return;
        let cancelled = false;
        window.transferAPI.list().then((list) => {
            if (!cancelled) setActive(list);
        });

        const offProgress = window.transferAPI.onProgress((payload) => {
            setActive((prev) => {
                const idx = prev.findIndex((t) => t.id === payload.id);
                if (idx === -1) return [...prev, payload];
                const next = prev.slice();
                next[idx] = payload;
                return next;
            });
        });

        const offDone = window.transferAPI.onDone((payload) => {
            setActive((prev) => prev.filter((t) => t.id !== payload.id));
            setRecentDone((prev) => [payload, ...prev].slice(0, 5));
        });

        return () => {
            cancelled = true;
            offProgress();
            offDone();
        };
    }, []);

    const cancel = (id: string) => window.transferAPI?.cancel(id);

    return { active, recentDone, cancel };
}
