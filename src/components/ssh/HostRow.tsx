import { ArrowLeftRight, Edit3, FileKey, FolderTree, Lock, Server, Terminal as TerminalIcon } from 'lucide-react';

interface HostRowProps {
    host: SshHost;
    onConnect: (host: SshHost) => void;
    onEdit?: (host: SshHost) => void;
    onBrowseFiles?: (host: SshHost) => void;
    showOriginal?: boolean;
}

const COLOR_CLASSES: Record<string, string> = {
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400'
};

const SOURCE_LABELS: Record<SshHostSource, { text: string; className: string }> = {
    config: { text: 'config', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
    known_hosts: { text: 'known', className: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300' },
    saved: { text: 'saved', className: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' }
};

export function HostRow({ host, onConnect, onEdit, onBrowseFiles, showOriginal }: HostRowProps) {
    const target = host.user ? `${host.user}@${host.hostname}` : host.hostname;
    const portLabel = host.port && host.port !== 22 ? `:${host.port}` : '';
    const sourceMeta = SOURCE_LABELS[host.source];
    const iconClass = COLOR_CLASSES[host.color ?? 'indigo'] ?? COLOR_CLASSES.indigo;

    return (
        <div className="group flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
                <Server className="h-4 w-4" aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50" title={host.alias}>
                        {host.alias}
                    </span>
                    {showOriginal && host.originalAlias && host.originalAlias !== host.alias && (
                        <span className="truncate text-xs text-zinc-400" title={`Original: ${host.originalAlias}`}>
                            ({host.originalAlias})
                        </span>
                    )}
                    <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${sourceMeta.className}`}
                    >
                        {sourceMeta.text}
                    </span>
                    {((host.source === 'saved' && host.authMethod === 'password') || host.hasOverridePassword) && (
                        <span
                            className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                            title="Password authentication"
                        >
                            <Lock className="h-2.5 w-2.5" aria-hidden="true" />
                            pwd
                        </span>
                    )}
                    {host.forwardCount && host.forwardCount > 0 && (
                        <span
                            className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-medium text-sky-700 dark:bg-sky-950 dark:text-sky-300"
                            title={`${host.forwardCount} port forward${host.forwardCount === 1 ? '' : 's'}`}
                        >
                            <ArrowLeftRight className="h-2.5 w-2.5" aria-hidden="true" />
                            {host.forwardCount} tunnel{host.forwardCount === 1 ? '' : 's'}
                        </span>
                    )}
                </div>
                <div className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400" title={target + portLabel}>
                    {target}{portLabel}
                </div>
                {host.identityFile && (
                    <div className="mt-1 flex items-center gap-1 truncate text-[11px] text-zinc-400">
                        <FileKey className="h-3 w-3" aria-hidden="true" />
                        <span className="truncate" title={host.identityFile}>{host.identityFile}</span>
                    </div>
                )}
            </div>

            <div className="flex shrink-0 items-center gap-1">
                {onEdit && (
                    <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 opacity-0 transition hover:bg-zinc-100 hover:text-zinc-900 group-hover:opacity-100 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                        onClick={() => onEdit(host)}
                        title="Edit host"
                    >
                        <Edit3 className="h-4 w-4" aria-hidden="true" />
                    </button>
                )}
                {onBrowseFiles && (
                    <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 opacity-0 transition hover:bg-zinc-100 hover:text-zinc-900 group-hover:opacity-100 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                        onClick={() => onBrowseFiles(host)}
                        title="Browse files (rsync)"
                    >
                        <FolderTree className="h-4 w-4" aria-hidden="true" />
                    </button>
                )}
                <button
                    type="button"
                    className="inline-flex h-9 items-center gap-2 rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700"
                    onClick={() => onConnect(host)}
                    title="Open SSH session"
                >
                    <TerminalIcon className="h-4 w-4" aria-hidden="true" />
                    Connect
                </button>
            </div>
        </div>
    );
}
