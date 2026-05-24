import { Music2, RefreshCw } from 'lucide-react';
import { MediaCard } from './MediaCard';
import { MediaHistoryList } from './MediaHistoryList';
import { MediaStats } from './MediaStats';
import { useMediaHistory } from './useMediaHistory';

interface MediaPanelProps {
    tracks: MediaTrack[];
    loading: boolean;
    onRefresh: () => void;
    onControl: (action: MediaAction, bundleId?: string | null) => void;
}

export function MediaPanel({ tracks, loading, onRefresh, onControl }: MediaPanelProps) {
    const { history, artists, stats, clearRecent, clearAll } = useMediaHistory();

    return (
        <section className="flex flex-col gap-5">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Now Playing</h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {tracks.length === 0
                            ? loading
                                ? 'Loading…'
                                : 'Nothing playing'
                            : `${tracks.length} active session${tracks.length === 1 ? '' : 's'}`}
                    </p>
                </div>
                <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    onClick={onRefresh}
                    disabled={loading}
                    title="Refresh"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
                </button>
            </div>

            {tracks.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
                    <Music2 className="mx-auto h-8 w-8 text-zinc-400" aria-hidden="true" />
                    <div className="mt-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">Nothing playing</div>
                    <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        Play something in Music, Spotify, or a browser tab.
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {tracks.map((track) => (
                        <MediaCard key={track.id} track={track} onControl={onControl} />
                    ))}
                </div>
            )}

            <MediaStats stats={stats} />
            <MediaHistoryList
                history={history}
                artists={artists}
                onClearRecent={clearRecent}
                onClearAll={clearAll}
            />
        </section>
    );
}
