import { useEffect, useState } from 'react';
import { Music2, Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { formatTime } from '../../lib/format';

interface MediaCardProps {
    track: MediaTrack;
    onControl: (action: MediaAction, bundleId?: string | null) => void;
}

export function MediaCard({ track, onControl }: MediaCardProps) {
    const [now, setNow] = useState(Date.now());
    const hasTrack = Boolean(track.title || track.artist || track.album);
    const effectiveElapsed =
        track.elapsed !== undefined && track.elapsed !== null
            ? track.elapsed + (track.isPlaying && track.fetchedAt ? Math.max((now - track.fetchedAt) / 1000, 0) : 0)
            : null;
    const progress =
        effectiveElapsed !== null && track.duration && track.duration > 0
            ? Math.min(Math.max((effectiveElapsed / track.duration) * 100, 0), 100)
            : 0;
    const artworkSrc = track.artworkDataUrl || track.artworkUrl;

    useEffect(() => {
        if (!track.isPlaying) return;
        const interval = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(interval);
    }, [track.isPlaying]);

    return (
        <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 text-white shadow-sm">
            <div className="grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center">
                <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-cyan-500 text-white">
                        {artworkSrc ? (
                            <img src={artworkSrc} alt="" className="h-full w-full object-cover" />
                        ) : (
                            <Music2 className="h-7 w-7" aria-hidden="true" />
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-base font-semibold tracking-normal">
                                {hasTrack ? track.title ?? track.artist ?? track.album : track.app ?? 'Unknown app'}
                            </h3>
                            {track.app && (
                                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-zinc-300">
                                    {track.app}
                                </span>
                            )}
                            {track.source === 'client-only' && (
                                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-amber-300">
                                    info unavailable
                                </span>
                            )}
                        </div>
                        <p className="mt-1 truncate text-sm text-zinc-300">
                            {hasTrack
                                ? [track.artist, track.album].filter(Boolean).join(' — ') || ' '
                                : track.source === 'client-only'
                                  ? 'Now Playing client registered; title/artist not exposed by macOS.'
                                  : 'Play something to populate this card.'}
                        </p>

                        {track.duration ? (
                            <div className="mt-3 grid grid-cols-[auto_1fr_auto] items-center gap-2 text-xs text-zinc-400">
                                <span>{formatTime(effectiveElapsed)}</span>
                                <div className="h-1 overflow-hidden rounded-full bg-white/15">
                                    <div className="h-full rounded-full bg-cyan-400" style={{ width: `${progress}%` }} />
                                </div>
                                <span>{formatTime(track.duration)}</span>
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="flex items-center gap-2 md:justify-end">
                    <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white transition hover:bg-white/15"
                        onClick={() => onControl('previous', track.bundleId)}
                        title="Previous"
                    >
                        <SkipBack className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-zinc-950 transition hover:bg-zinc-200"
                        onClick={() => onControl('play-pause', track.bundleId)}
                        title={track.isPlaying ? 'Pause' : 'Play'}
                    >
                        {track.isPlaying ? (
                            <Pause className="h-5 w-5" aria-hidden="true" />
                        ) : (
                            <Play className="h-5 w-5" aria-hidden="true" />
                        )}
                    </button>
                    <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white transition hover:bg-white/15"
                        onClick={() => onControl('next', track.bundleId)}
                        title="Next"
                    >
                        <SkipForward className="h-4 w-4" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    );
}
