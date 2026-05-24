import { useEffect, useState } from 'react';

const POLL_INTERVAL_MS = 2000;

export function useSystemMetrics() {
    const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
    const [loading, setLoading] = useState(false);

    const available = typeof window !== 'undefined' && Boolean(window.systemAPI);

    const load = async () => {
        if (!available) return;

        setLoading(true);
        try {
            setMetrics(await window.systemAPI.getMetrics());
        } catch {
            setMetrics(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!available) return;

        load();
        const interval = window.setInterval(load, POLL_INTERVAL_MS);

        return () => window.clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [available]);

    return { metrics, loading, refresh: load };
}
