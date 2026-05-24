import { useCallback, useEffect, useState } from 'react';

const POLL_INTERVAL_MS = 5000;

interface UseDockerStatusReturn {
    status: DockerStatus | null;
    loading: boolean;
    refresh: () => void;
}

export function useDockerStatus(): UseDockerStatusReturn {
    const [status, setStatus] = useState<DockerStatus | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        if (typeof window === 'undefined' || !window.dockerAPI) return;
        setLoading(true);
        try {
            setStatus(await window.dockerAPI.status());
        } catch (err) {
            setStatus({ available: false, error: err instanceof Error ? err.message : 'unknown' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
        const interval = window.setInterval(refresh, 15_000);
        return () => window.clearInterval(interval);
    }, [refresh]);

    return { status, loading, refresh };
}

export function useDockerList<T>(
    fetcher: () => Promise<T[]>,
    enabled: boolean,
    deps: unknown[] = []
) {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        if (!enabled) return;
        setLoading(true);
        setError(null);
        try {
            setItems(await fetcher());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'failed');
            setItems([]);
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, ...deps]);

    useEffect(() => {
        if (!enabled) return;
        refresh();
        const interval = window.setInterval(refresh, POLL_INTERVAL_MS);
        return () => window.clearInterval(interval);
    }, [enabled, refresh]);

    return { items, loading, error, refresh };
}
