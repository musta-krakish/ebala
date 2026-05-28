import type { MediaManager, MediaTrack } from './media-manager.ts';
import { closeEntry, extendEntry, startEntry } from './media-history.ts';

const POLL_INTERVAL_MS = 5000;

interface ActiveEntry {
    id: number;
    key: string;
    lastTickAt: number;
}

const trackKey = (track: MediaTrack) =>
    `${track.bundleId ?? ''}|${track.title ?? ''}|${track.artist ?? ''}|${track.album ?? ''}`;

export class MediaTracker {
    private timer: NodeJS.Timeout | null = null;
    private active: ActiveEntry | null = null;
    private running = false;
    private readonly mediaManager: MediaManager;

    constructor(mediaManager: MediaManager) {
        this.mediaManager = mediaManager;
    }

    start() {
        if (this.timer) return;
        // Fire immediately, then on interval.
        void this.tick();
        this.timer = setInterval(() => void this.tick(), POLL_INTERVAL_MS);
    }

    async stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        if (this.active) {
            await closeEntry(this.active.id, Date.now());
            this.active = null;
        }
    }

    private async tick() {
        if (this.running) return;
        this.running = true;
        try {
            const tracks = await this.mediaManager.getAllNowPlaying();
            const primary = tracks[0] ?? null;
            await this.observe(primary);
        } catch (error) {
            console.error('[MediaTracker] tick failed:', error);
        } finally {
            this.running = false;
        }
    }

    private async observe(track: MediaTrack | null) {
        const now = Date.now();

        if (!track || (!track.title && !track.artist)) {
            if (this.active) {
                await closeEntry(this.active.id, now);
                this.active = null;
            }
            return;
        }

        const key = trackKey(track);

        if (this.active && this.active.key === key) {
            if (track.isPlaying) {
                const delta = Math.max(0, (now - this.active.lastTickAt) / 1000);
                if (delta > 0) await extendEntry(this.active.id, delta);
            }
            this.active.lastTickAt = now;
            return;
        }

        if (this.active) {
            await closeEntry(this.active.id, now);
        }

        const id = await startEntry({
            title: track.title,
            artist: track.artist,
            album: track.album,
            bundleId: track.bundleId,
            appName: track.app,
            artworkUrl: track.artworkUrl ?? null,
            artworkDataUrl: track.artworkDataUrl ?? null,
            durationSeconds: track.duration ? Math.round(track.duration) : null,
            startedAt: now
        });
        this.active = { id, key, lastTickAt: now };
    }
}
