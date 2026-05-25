import { useEffect, useState } from 'react';
import { useVisibility } from '../../lib/useVisibility';

const POLL_INTERVAL_MS = 3000;

export function useMedia(onError: (message: string) => void) {
    const [tracks, setTracks] = useState<MediaTrack[]>([]);
    const [loading, setLoading] = useState(false);
    const visible = useVisibility();

    const available = typeof window !== 'undefined' && Boolean(window.mediaAPI);

    const load = async () => {
        if (!available) return;

        setLoading(true);
        try {
            setTracks(await window.mediaAPI.getNowPlaying());
        } catch {
            setTracks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!available || !visible) return;

        load();
        const interval = window.setInterval(load, POLL_INTERVAL_MS);

        return () => window.clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [available, visible]);

    const control = async (action: MediaAction, bundleId?: string | null) => {
        if (!available) {
            onError('Media API is not available');
            return;
        }

        const result = await window.mediaAPI.control(action, bundleId);
        if (!result.success) {
            onError(result.error ? `Media control failed: ${result.error}` : 'Media control failed');
            return;
        }

        window.setTimeout(load, 300);
    };

    return { tracks, loading, refresh: load, control };
}
