import { useCallback, useEffect, useState } from 'react';

type Lister = (path: string) => Promise<FileEntry[]>;

export function useDirectory(initialPath: string, list: Lister, ready: boolean) {
    const [path, setPath] = useState(initialPath);
    const [entries, setEntries] = useState<FileEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reloadToken, setReloadToken] = useState(0);

    useEffect(() => {
        setPath(initialPath);
    }, [initialPath]);

    useEffect(() => {
        if (!ready || !path) return;
        let cancelled = false;
        setLoading(true);
        list(path)
            .then((next) => {
                if (cancelled) return;
                setEntries(next);
                setError(null);
            })
            .catch((err: unknown) => {
                if (cancelled) return;
                setError(err instanceof Error ? err.message : 'Failed to list directory');
                setEntries([]);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [path, list, ready, reloadToken]);

    const refresh = useCallback(() => setReloadToken((token) => token + 1), []);
    const navigate = useCallback((next: string) => setPath(next || '/'), []);

    return { path, entries, loading, error, navigate, refresh };
}
