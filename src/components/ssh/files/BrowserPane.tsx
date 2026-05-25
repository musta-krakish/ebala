import { useMemo } from 'react';
import { ArrowUp, File, Folder, FolderSymlink, Home, Loader2, RefreshCw } from 'lucide-react';
import { formatBytes } from '../../../lib/format';
import { joinSegments, parentPath, splitSegments } from './posixPath';

export interface DragPayload {
    sourceSide: 'local' | 'remote';
    items: FileEntry[];
}

interface BrowserPaneProps {
    title: string;
    subtitle?: string;
    side: 'local' | 'remote';
    path: string;
    entries: FileEntry[];
    loading: boolean;
    error: string | null;
    selected: FileEntry[];
    onSelect: (entries: FileEntry[]) => void;
    onNavigate: (path: string) => void;
    onRefresh: () => void;
    onHome: () => void;
    onDrop: (payload: DragPayload, targetPath: string) => void;
    onTransfer: () => void;
    transferLabel: string;
    transferDisabled?: boolean;
}

export function BrowserPane({
    title,
    subtitle,
    side,
    path,
    entries,
    loading,
    error,
    selected,
    onSelect,
    onNavigate,
    onRefresh,
    onHome,
    onDrop,
    onTransfer,
    transferLabel,
    transferDisabled
}: BrowserPaneProps) {
    const selectedIds = useMemo(() => new Set(selected.map((entry) => entry.path)), [selected]);

    const handleEntryClick = (entry: FileEntry, ctrl: boolean) => {
        if (ctrl) {
            const next = selectedIds.has(entry.path)
                ? selected.filter((item) => item.path !== entry.path)
                : [...selected, entry];
            onSelect(next);
        } else {
            onSelect(selectedIds.has(entry.path) && selected.length === 1 ? [] : [entry]);
        }
    };

    const handleEntryDoubleClick = (entry: FileEntry) => {
        if (entry.isDir) onNavigate(entry.path);
    };

    const handleDragStart = (event: React.DragEvent, entry: FileEntry) => {
        // Drag picks up the selection if the dragged row is part of it,
        // otherwise just the single row.
        const items = selectedIds.has(entry.path) && selected.length > 1 ? selected : [entry];
        event.dataTransfer.setData(
            'application/x-ebala-files',
            JSON.stringify({ sourceSide: side, items })
        );
        event.dataTransfer.effectAllowed = 'copy';
    };

    const handleDragOver = (event: React.DragEvent) => {
        if (event.dataTransfer.types.includes('application/x-ebala-files')) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
        }
    };

    const handleDrop = (event: React.DragEvent) => {
        const raw = event.dataTransfer.getData('application/x-ebala-files');
        if (!raw) return;
        event.preventDefault();
        try {
            const payload = JSON.parse(raw) as DragPayload;
            if (payload.sourceSide === side) return;
            onDrop(payload, path);
        } catch {
            // ignore malformed payload
        }
    };

    const segments = splitSegments(path);

    return (
        <div
            className="flex h-full min-h-0 flex-col rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                            {title}
                        </div>
                        {subtitle && (
                            <div className="text-[11px] text-zinc-400">{subtitle}</div>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={onHome}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                            title="Go home"
                        >
                            <Home className="h-3.5 w-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => onNavigate(parentPath(path))}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-100 disabled:opacity-40 dark:text-zinc-400 dark:hover:bg-zinc-800"
                            disabled={path === '/' || !path}
                            title="Up one level"
                        >
                            <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={onRefresh}
                            disabled={loading}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-100 disabled:opacity-40 dark:text-zinc-400 dark:hover:bg-zinc-800"
                            title="Refresh"
                        >
                            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                        </button>
                    </div>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                    <button
                        type="button"
                        onClick={() => onNavigate('/')}
                        className="rounded px-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                        /
                    </button>
                    {segments.map((segment, idx) => {
                        const fullPath = joinSegments(segments.slice(0, idx + 1));
                        const isLast = idx === segments.length - 1;
                        return (
                            <span key={`${segment}-${idx}`} className="flex items-center gap-1">
                                <button
                                    type="button"
                                    disabled={isLast}
                                    onClick={() => onNavigate(fullPath)}
                                    className={`rounded px-1 truncate ${
                                        isLast
                                            ? 'font-medium text-zinc-700 dark:text-zinc-200'
                                            : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                    }`}
                                    title={fullPath}
                                >
                                    {segment}
                                </button>
                                {!isLast && <span className="text-zinc-300">/</span>}
                            </span>
                        );
                    })}
                </div>
            </div>

            {error && (
                <div className="border-b border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300">
                    {error}
                </div>
            )}

            <div className="flex-1 min-h-0 overflow-y-auto">
                {entries.length === 0 ? (
                    <div className="px-3 py-10 text-center text-xs text-zinc-500 dark:text-zinc-400">
                        {loading ? 'Loading…' : 'Empty directory'}
                    </div>
                ) : (
                    <ul>
                        {entries.map((entry) => {
                            const isSelected = selectedIds.has(entry.path);
                            const Icon = entry.isLink ? FolderSymlink : entry.isDir ? Folder : File;
                            return (
                                <li
                                    key={entry.path}
                                    draggable
                                    onDragStart={(event) => handleDragStart(event, entry)}
                                    onClick={(event) => handleEntryClick(entry, event.metaKey || event.ctrlKey)}
                                    onDoubleClick={() => handleEntryDoubleClick(entry)}
                                    className={`flex cursor-pointer items-center gap-2 border-b border-zinc-100 px-3 py-1.5 text-xs last:border-b-0 dark:border-zinc-800/60 ${
                                        isSelected
                                            ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-100'
                                            : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                                    }`}
                                    title={entry.path}
                                >
                                    <Icon className={`h-3.5 w-3.5 shrink-0 ${entry.isDir ? 'text-indigo-500' : 'text-zinc-400'}`} aria-hidden="true" />
                                    <span className="min-w-0 flex-1 truncate">{entry.name}</span>
                                    <span className="w-20 shrink-0 text-right text-zinc-500 dark:text-zinc-400">
                                        {entry.isDir ? '—' : formatBytes(entry.size)}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-zinc-200 px-3 py-2 dark:border-zinc-800">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {selected.length > 0 ? `${selected.length} selected` : `${entries.length} items`}
                </span>
                <button
                    type="button"
                    onClick={onTransfer}
                    disabled={transferDisabled || selected.length === 0}
                    className="inline-flex h-8 items-center gap-2 rounded-md bg-indigo-600 px-3 text-xs font-medium text-white transition hover:bg-indigo-700 disabled:opacity-40"
                >
                    {transferLabel}
                </button>
            </div>
        </div>
    );
}
