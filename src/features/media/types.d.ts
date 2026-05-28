// Ambient (no import/export) so these stay global, and the `interface Window`
// block merges with the central one in vite-env.d.ts.

interface MediaTrack {
    id: string;
    title: string | null;
    artist: string | null;
    album: string | null;
    app: string | null;
    bundleId: string | null;
    pid: number | null;
    artworkUrl?: string | null;
    artworkDataUrl?: string | null;
    duration?: number | null;
    elapsed?: number | null;
    fetchedAt?: number;
    isPlaying: boolean;
    source: 'media-remote' | 'applescript' | 'client-only' | 'none';
}

type MediaAction = 'play-pause' | 'next' | 'previous';

interface MediaHistoryEntry {
    id: number;
    title: string | null;
    artist: string | null;
    album: string | null;
    bundleId: string | null;
    appName: string | null;
    artworkUrl: string | null;
    artworkDataUrl: string | null;
    durationSeconds: number | null;
    listenedSeconds: number;
    startedAt: number;
    endedAt: number | null;
}

interface MediaStats {
    totalListenedSeconds: number;
    uniqueTracks: number;
    uniqueArtists: number;
    topArtists: Array<{ artist: string; totalSeconds: number; plays: number }>;
    topTracks: Array<{ title: string; artist: string | null; totalSeconds: number; plays: number }>;
    last24hSeconds: number;
    last7dSeconds: number;
}

interface MediaArtistGroup {
    artist: string;
    totalSeconds: number;
    totalPlays: number;
    lastPlayedAt: number;
    firstPlayedAt: number;
    tracks: Array<{
        title: string;
        album: string | null;
        artworkUrl: string | null;
        artworkDataUrl: string | null;
        totalSeconds: number;
        totalPlays: number;
        lastPlayedAt: number;
    }>;
}

interface MediaAPI {
    getNowPlaying: () => Promise<MediaTrack[]>;
    control: (action: MediaAction, bundleId?: string | null) => Promise<{ success: boolean; error?: string }>;
    listHistory: (limit?: number) => Promise<MediaHistoryEntry[]>;
    listArtists: (limit?: number) => Promise<MediaArtistGroup[]>;
    getStats: () => Promise<MediaStats>;
    clearHistory: () => Promise<boolean>;
    clearAllStats: () => Promise<boolean>;
}

interface Window {
    mediaAPI: MediaAPI;
}
