import { Edit3, Loader2, Lock, Monitor, Square, Tv2 } from 'lucide-react';

interface RdpHostRowProps {
    host: RdpHost;
    isConnecting?: boolean;
    activeSessionId?: string;
    onConnect: (host: RdpHost) => void;
    onEdit: (host: RdpHost) => void;
    onDisconnect: (sessionId: string) => void;
}

const COLOR_CLASSES: Record<string, string> = {
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400'
};

export function RdpHostRow({
    host,
    isConnecting,
    activeSessionId,
    onConnect,
    onEdit,
    onDisconnect
}: RdpHostRowProps) {
    const iconClass = COLOR_CLASSES[host.color ?? 'sky'] ?? COLOR_CLASSES.sky;
    const portLabel = host.port && host.port !== 3389 ? `:${host.port}` : '';
    const target = host.domain ? `${host.domain}\\${host.username}@${host.hostname}` : `${host.username}@${host.hostname}`;
    const isActive = Boolean(activeSessionId);

    return (
        <div className="group flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
                <Monitor className="h-4 w-4" aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50" title={host.label}>
                        {host.label}
                    </span>
                    {host.hasPassword && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300" title="Password stored">
                            <Lock className="h-2.5 w-2.5" aria-hidden="true" />
                            pwd
                        </span>
                    )}
                    {isActive && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            active
                        </span>
                    )}
                </div>
                <div className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400" title={target + portLabel}>
                    {target}{portLabel}
                </div>
                {host.notes && (
                    <div className="mt-1 truncate text-[11px] text-zinc-400" title={host.notes}>
                        {host.notes}
                    </div>
                )}
            </div>

            <div className="flex shrink-0 items-center gap-1">
                <button
                    type="button"
                    onClick={() => onEdit(host)}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 opacity-0 transition hover:bg-zinc-100 hover:text-zinc-900 group-hover:opacity-100 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                    title="Edit host"
                >
                    <Edit3 className="h-4 w-4" aria-hidden="true" />
                </button>
                {isActive ? (
                    <button
                        type="button"
                        onClick={() => onDisconnect(activeSessionId!)}
                        className="inline-flex h-9 items-center gap-2 rounded-md border border-rose-200 bg-white px-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50 dark:border-rose-900 dark:bg-zinc-900 dark:text-rose-300 dark:hover:bg-rose-950"
                    >
                        <Square className="h-4 w-4" aria-hidden="true" />
                        Disconnect
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => onConnect(host)}
                        disabled={isConnecting}
                        className="inline-flex h-9 items-center gap-2 rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Tv2 className="h-4 w-4" aria-hidden="true" />}
                        Connect
                    </button>
                )}
            </div>
        </div>
    );
}
