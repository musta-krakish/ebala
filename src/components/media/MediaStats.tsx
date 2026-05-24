import { Clock, Headphones, Mic, Music2 } from 'lucide-react';
import { formatDuration } from '../../lib/format';

interface MediaStatsProps {
    stats: MediaStats | null;
}

function StatTile({
    label,
    value,
    sub,
    icon: Icon,
    tone
}: {
    label: string;
    value: string;
    sub?: string;
    icon: React.ElementType;
    tone: string;
}) {
    return (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{label}</div>
                    <div className="mt-1 text-xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-50">{value}</div>
                    {sub && <div className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">{sub}</div>}
                </div>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tone}`}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
            </div>
        </div>
    );
}

export function MediaStats({ stats }: MediaStatsProps) {
    const total = stats?.totalListenedSeconds ?? 0;
    const last24h = stats?.last24hSeconds ?? 0;
    const last7d = stats?.last7dSeconds ?? 0;
    const topArtist = stats?.topArtists[0];
    const topTrack = stats?.topTracks[0];

    return (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <StatTile
                label="Total listened"
                value={formatDuration(total)}
                sub={`${stats?.uniqueTracks ?? 0} tracks · ${stats?.uniqueArtists ?? 0} artists`}
                icon={Clock}
                tone="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
            />
            <StatTile
                label="Last 24h / 7d"
                value={formatDuration(last24h)}
                sub={`${formatDuration(last7d)} in past 7 days`}
                icon={Headphones}
                tone="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
            />
            <StatTile
                label="Top artist"
                value={topArtist?.artist ?? '—'}
                sub={topArtist ? `${formatDuration(topArtist.totalSeconds)} · ${topArtist.plays} plays` : 'No data yet'}
                icon={Mic}
                tone="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
            />
            <StatTile
                label="Top track"
                value={topTrack?.title ?? '—'}
                sub={
                    topTrack
                        ? `${topTrack.artist ?? 'Unknown'} · ${formatDuration(topTrack.totalSeconds)}`
                        : 'No data yet'
                }
                icon={Music2}
                tone="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
            />
        </div>
    );
}
