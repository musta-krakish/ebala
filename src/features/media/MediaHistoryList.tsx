import { useState } from 'react';
import { ChevronDown, ChevronRight, Music2, Trash2, User } from 'lucide-react';
import { formatDuration, formatRelativeTime } from '../../lib/format';

type ViewMode = 'recent' | 'artists';

interface MediaHistoryListProps {
    history: MediaHistoryEntry[];
    artists: MediaArtistGroup[];
    onClearRecent: () => void;
    onClearAll: () => void;
}

export function MediaHistoryList({ history, artists, onClearRecent, onClearAll }: MediaHistoryListProps) {
    const [view, setView] = useState<ViewMode>('recent');

    const empty = view === 'recent' ? history.length === 0 : artists.length === 0;

    return (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
                <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">History</h3>
                    <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                        {view === 'recent'
                            ? history.length === 0
                                ? 'No recent tracks (kept for ~30 days)'
                                : `Last ${history.length} tracks · recent listening`
                            : artists.length === 0
                                ? 'No artists yet'
                                : `${artists.length} artists · cumulative stats`}
                    </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <div className="flex rounded-md border border-zinc-200 bg-zinc-50 p-0.5 text-xs dark:border-zinc-800 dark:bg-zinc-950">
                        <ViewButton active={view === 'recent'} onClick={() => setView('recent')}>
                            Recent
                        </ViewButton>
                        <ViewButton active={view === 'artists'} onClick={() => setView('artists')}>
                            By artist
                        </ViewButton>
                    </div>
                    <ClearMenu onClearRecent={onClearRecent} onClearAll={onClearAll} />
                </div>
            </div>

            {empty ? (
                <div className="p-10 text-center">
                    <Music2 className="mx-auto h-8 w-8 text-zinc-400" aria-hidden="true" />
                    <div className="mt-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        {view === 'recent' ? 'No recent tracks' : 'No listening stats yet'}
                    </div>
                    <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        Play something for at least 5 seconds — it will appear here.
                    </div>
                </div>
            ) : view === 'recent' ? (
                <RecentList history={history} />
            ) : (
                <ArtistList artists={artists} />
            )}
        </div>
    );
}

function ViewButton({
    active,
    onClick,
    children
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded px-2.5 py-1 font-medium transition ${
                active
                    ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50'
                    : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
        >
            {children}
        </button>
    );
}

function ClearMenu({ onClearRecent, onClearAll }: { onClearRecent: () => void; onClearAll: () => void }) {
    const [open, setOpen] = useState(false);

    const wrap = (fn: () => void, prompt: string) => {
        if (window.confirm(prompt)) fn();
        setOpen(false);
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-md border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50 dark:border-rose-900 dark:bg-zinc-900 dark:text-rose-300 dark:hover:bg-rose-950"
            >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Clear
                <ChevronDown className="h-3 w-3" aria-hidden="true" />
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-full z-20 mt-1 w-56 overflow-hidden rounded-md border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                        <button
                            type="button"
                            onClick={() => wrap(onClearRecent, 'Clear recent tracks list?\nCumulative artist/track stats are kept.')}
                            className="block w-full px-3 py-2 text-left text-xs text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
                        >
                            Clear recent tracks
                            <div className="text-[10px] text-zinc-500 dark:text-zinc-400">Stats are kept</div>
                        </button>
                        <button
                            type="button"
                            onClick={() => wrap(onClearAll, 'Reset ALL listening stats (artists, tracks, history)?\nThis cannot be undone.')}
                            className="block w-full border-t border-zinc-200 px-3 py-2 text-left text-xs text-rose-700 transition hover:bg-rose-50 dark:border-zinc-700 dark:text-rose-300 dark:hover:bg-rose-950"
                        >
                            Reset all stats
                            <div className="text-[10px] text-rose-500/80 dark:text-rose-400/70">Wipes aggregates too</div>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

function RecentList({ history }: { history: MediaHistoryEntry[] }) {
    return (
        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {history.map((entry) => {
                const artwork = entry.artworkDataUrl || entry.artworkUrl;
                return (
                    <li
                        key={entry.id}
                        className="flex items-center gap-3 px-4 py-3 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                    >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                            {artwork ? (
                                <img src={artwork} alt="" className="h-full w-full object-cover" />
                            ) : (
                                <Music2 className="h-5 w-5 text-zinc-400" aria-hidden="true" />
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium text-zinc-950 dark:text-zinc-50" title={entry.title ?? ''}>
                                {entry.title || '(unknown)'}
                            </div>
                            <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                                {[entry.artist, entry.album].filter(Boolean).join(' — ') || entry.appName || '—'}
                            </div>
                        </div>

                        <div className="shrink-0 text-right text-xs">
                            <div className="font-medium text-zinc-700 dark:text-zinc-300">
                                {formatDuration(entry.listenedSeconds)}
                            </div>
                            <div className="text-zinc-500 dark:text-zinc-400">
                                {formatRelativeTime(entry.startedAt)}
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

function ArtistList({ artists }: { artists: MediaArtistGroup[] }) {
    return (
        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {artists.map((group) => (
                <ArtistRow key={group.artist} group={group} />
            ))}
        </ul>
    );
}

function ArtistRow({ group }: { group: MediaArtistGroup }) {
    const [expanded, setExpanded] = useState(false);
    const sampleArtwork = group.tracks.find((t) => t.artworkDataUrl || t.artworkUrl);
    const artwork = sampleArtwork?.artworkDataUrl || sampleArtwork?.artworkUrl;

    return (
        <li>
            <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
            >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                    {artwork ? (
                        <img src={artwork} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <User className="h-5 w-5 text-zinc-400" aria-hidden="true" />
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-zinc-950 dark:text-zinc-50" title={group.artist}>
                        {group.artist}
                    </div>
                    <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                        {group.tracks.length} track{group.tracks.length === 1 ? '' : 's'} ·{' '}
                        {group.totalPlays} play{group.totalPlays === 1 ? '' : 's'}
                    </div>
                </div>
                <div className="shrink-0 text-right text-xs">
                    <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {formatDuration(group.totalSeconds)}
                    </div>
                    <div className="text-zinc-500 dark:text-zinc-400">
                        last {formatRelativeTime(group.lastPlayedAt)}
                    </div>
                </div>
                {expanded ? (
                    <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                )}
            </button>

            {expanded && (
                <ul className="border-t border-zinc-100 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-950/40">
                    {group.tracks.map((track) => {
                        const trackArt = track.artworkDataUrl || track.artworkUrl;
                        return (
                            <li
                                key={track.title}
                                className="flex items-center gap-3 px-4 py-2.5 pl-16 text-xs"
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800">
                                    {trackArt ? (
                                        <img src={trackArt} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <Music2 className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="truncate font-medium text-zinc-800 dark:text-zinc-200" title={track.title}>
                                        {track.title}
                                    </div>
                                    {track.album && (
                                        <div className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                                            {track.album}
                                        </div>
                                    )}
                                </div>
                                <div className="shrink-0 text-right">
                                    <div className="font-medium text-zinc-700 dark:text-zinc-300">
                                        {formatDuration(track.totalSeconds)}
                                    </div>
                                    <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                                        {track.totalPlays} play{track.totalPlays === 1 ? '' : 's'}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </li>
    );
}
