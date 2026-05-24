import { useCallback, useEffect, useState } from 'react';

const REFRESH_INTERVAL_MS = 8000;

export function useMediaHistory() {
    const [history, setHistory] = useState<MediaHistoryEntry[]>([]);
    const [artists, setArtists] = useState<MediaArtistGroup[]>([]);
    const [stats, setStats] = useState<MediaStats | null>(null);
    const [loading, setLoading] = useState(false);

    const available = typeof window !== 'undefined' && Boolean(window.mediaAPI);

    const refresh = useCallback(async () => {
        if (!available) return;
        setLoading(true);
        try {
            const [list, artistList, statsResult] = await Promise.all([
                window.mediaAPI.listHistory(50),
                window.mediaAPI.listArtists(30),
                window.mediaAPI.getStats()
            ]);
            setHistory(list);
            setArtists(artistList);
            setStats(statsResult);
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    }, [available]);

    useEffect(() => {
        if (!available) return;
        refresh();
        const interval = window.setInterval(refresh, REFRESH_INTERVAL_MS);
        return () => window.clearInterval(interval);
    }, [available, refresh]);

    const clearRecent = useCallback(async () => {
        if (!available) return;
        await window.mediaAPI.clearHistory();
        await refresh();
    }, [available, refresh]);

    const clearAll = useCallback(async () => {
        if (!available) return;
        await window.mediaAPI.clearAllStats();
        await refresh();
    }, [available, refresh]);

    return { history, artists, stats, loading, refresh, clearRecent, clearAll };
}
