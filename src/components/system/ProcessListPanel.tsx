import { useMemo, useState } from 'react';
import {
    AlertTriangle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Loader2,
    RefreshCw,
    Search,
    ShieldAlert,
    Terminal,
    X
} from 'lucide-react';
import { formatBytes, formatPercent } from '../../lib/format';
import { useProcessList, type RankedProcess } from './useProcessList';
import { useAppIcon } from './useAppIcon';

type SortKey = 'cpu' | 'memory';

const PAGE_SIZE = 6;
// Single grid template used for both parent and child rows so columns
// line up vertically when a group is expanded.
const ROW_GRID = 'grid grid-cols-[1.5rem_2rem_minmax(0,1fr)_5.5rem_6.5rem_5rem_8rem] items-center gap-3';

interface ProcessGroup {
    key: string;
    isApp: boolean;
    appPath: string | null;
    label: string;
    user: string;
    isOwnUser: boolean;
    cpuPercent: number;
    memoryBytes: number;
    smoothedCpu: number;
    smoothedMemory: number;
    rootPid: number;
    children: RankedProcess[];
}

function buildGroups(processes: RankedProcess[]): ProcessGroup[] {
    const byKey = new Map<string, RankedProcess[]>();

    for (const item of processes) {
        const key = item.appName ? `app:${item.appName}` : `proc:${item.name}:${item.user}`;
        const bucket = byKey.get(key);
        if (bucket) bucket.push(item);
        else byKey.set(key, [item]);
    }

    return Array.from(byKey.entries()).map(([key, members]) => {
        const cpuPercent = members.reduce((s, m) => s + m.cpuPercent, 0);
        const memoryBytes = members.reduce((s, m) => s + m.memoryBytes, 0);
        const smoothedCpu = members.reduce((s, m) => s + m.smoothedCpu, 0);
        const smoothedMemory = members.reduce((s, m) => s + m.smoothedMemory, 0);
        const isApp = key.startsWith('app:');
        const root = members.reduce((acc, m) => (m.pid < acc.pid ? m : acc), members[0]);
        return {
            key,
            isApp,
            appPath: isApp ? root.appPath : null,
            label: isApp ? root.appName ?? root.name : root.name,
            user: root.user,
            isOwnUser: root.isOwnUser,
            cpuPercent,
            memoryBytes,
            smoothedCpu,
            smoothedMemory,
            rootPid: root.pid,
            children: members.sort((a, b) => b.smoothedCpu - a.smoothedCpu)
        };
    });
}

interface ProcessListPanelProps {
    enabled: boolean;
}

export function ProcessListPanel({ enabled }: ProcessListPanelProps) {
    const { processes, loading, error, refresh, kill } = useProcessList(enabled);
    const [query, setQuery] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('cpu');
    const [expandedKey, setExpandedKey] = useState<string | null>(null);
    const [confirmKey, setConfirmKey] = useState<string | null>(null);
    const [busyPid, setBusyPid] = useState<number | null>(null);
    const [killError, setKillError] = useState<string | null>(null);
    const [page, setPage] = useState(0);

    const groups = useMemo(() => buildGroups(processes), [processes]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const matched = q
            ? groups.filter(
                  (g) =>
                      g.label.toLowerCase().includes(q) ||
                      g.user.toLowerCase().includes(q) ||
                      String(g.rootPid).includes(q) ||
                      g.children.some((c) => String(c.pid).includes(q) || c.command.toLowerCase().includes(q))
              )
            : groups;

        return [...matched].sort((a, b) =>
            sortKey === 'cpu' ? b.smoothedCpu - a.smoothedCpu : b.smoothedMemory - a.smoothedMemory
        );
    }, [groups, query, sortKey]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages - 1);
    const visible = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

    const handleKill = async (pid: number, signal: KillSignal = 'SIGTERM') => {
        setBusyPid(pid);
        setKillError(null);
        try {
            const result = await kill(pid, signal);
            if (!result.success) {
                const hint = result.code === 'EPERM' ? ' (нет прав — нужны sudo)' : '';
                setKillError(`PID ${pid}: ${result.error ?? 'unknown error'}${hint}`);
            }
        } finally {
            setBusyPid(null);
            setConfirmKey(null);
        }
    };

    const requestKillGroup = (group: ProcessGroup) => {
        if (group.isApp || !group.isOwnUser || group.children.length > 1) {
            setConfirmKey(group.key);
        } else {
            handleKill(group.rootPid, 'SIGTERM');
        }
    };

    return (
        <div className="flex h-full flex-col">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
                <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400">
                        {processes.length} processes · {groups.length} apps & services
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="inline-flex overflow-hidden rounded-md border border-zinc-700">
                        <SortToggle active={sortKey === 'cpu'} onClick={() => setSortKey('cpu')} label="CPU" />
                        <SortToggle active={sortKey === 'memory'} onClick={() => setSortKey('memory')} label="RAM" />
                    </div>
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
                        <input
                            type="search"
                            placeholder="Filter…"
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value);
                                setPage(0);
                            }}
                            className="h-7 w-56 rounded-md border border-zinc-700 bg-zinc-950 pl-7 pr-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={refresh}
                        disabled={loading}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-700 bg-zinc-950 text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-50"
                        title="Refresh"
                    >
                        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                    </button>
                </div>
            </div>

            {(error || killError) && (
                <div className="space-y-1 border-b border-zinc-800 bg-rose-950/60 px-4 py-2">
                    {error && (
                        <div className="flex items-center gap-2 text-xs text-rose-300">
                            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                            {error}
                        </div>
                    )}
                    {killError && (
                        <div className="flex items-center justify-between gap-2 text-xs text-rose-300">
                            <span className="flex items-center gap-2">
                                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                                {killError}
                            </span>
                            <button
                                type="button"
                                onClick={() => setKillError(null)}
                                className="rounded p-0.5 hover:bg-rose-900"
                                aria-label="Dismiss"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className={`${ROW_GRID} border-b border-zinc-800 bg-zinc-900/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-500`}>
                <span />
                <span />
                <span>Process</span>
                <span className="text-right">CPU</span>
                <span className="text-right">RAM</span>
                <span className="text-right">PID</span>
                <span className="text-right">Action</span>
            </div>

            <div className="flex-1 overflow-y-auto">
                {visible.length === 0 ? (
                    <div className="px-3 py-10 text-center text-xs text-zinc-500">
                        {loading ? 'Loading…' : 'No processes match'}
                    </div>
                ) : (
                    visible.map((group) => (
                        <GroupRow
                            key={group.key}
                            group={group}
                            expanded={expandedKey === group.key}
                            confirming={confirmKey === group.key}
                            busyPid={busyPid}
                            onToggleExpand={() =>
                                setExpandedKey((prev) => (prev === group.key ? null : group.key))
                            }
                            onKillRequest={() => requestKillGroup(group)}
                            onKillConfirm={() => handleKill(group.rootPid, 'SIGTERM')}
                            onCancelConfirm={() => setConfirmKey(null)}
                            onKillChild={(pid) => handleKill(pid, 'SIGTERM')}
                        />
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-900 px-4 py-2 text-xs text-zinc-400">
                    <span>
                        Page {safePage + 1} of {totalPages}
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={safePage === 0}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-700 bg-zinc-950 text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-40"
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={safePage >= totalPages - 1}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-700 bg-zinc-950 text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-40"
                        >
                            <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

interface GroupRowProps {
    group: ProcessGroup;
    expanded: boolean;
    confirming: boolean;
    busyPid: number | null;
    onToggleExpand: () => void;
    onKillRequest: () => void;
    onKillConfirm: () => void;
    onCancelConfirm: () => void;
    onKillChild: (pid: number) => void;
}

function GroupRow({
    group,
    expanded,
    confirming,
    busyPid,
    onToggleExpand,
    onKillRequest,
    onKillConfirm,
    onCancelConfirm,
    onKillChild
}: GroupRowProps) {
    const icon = useAppIcon(group.appPath);
    const busy = busyPid === group.rootPid;

    return (
        <div className="border-b border-zinc-800/80 last:border-b-0">
            <div className={`${ROW_GRID} px-4 py-2 hover:bg-zinc-800/40`}>
                <button
                    type="button"
                    onClick={onToggleExpand}
                    className="flex h-6 w-6 items-center justify-center rounded text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-200"
                    aria-label={expanded ? 'Collapse' : 'Expand'}
                >
                    {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                </button>

                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-800">
                    {icon ? (
                        <img src={icon} alt="" className="h-6 w-6" />
                    ) : (
                        <Terminal className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
                    )}
                </div>

                <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-zinc-100">
                    <span className="truncate" title={group.appPath ?? group.label}>
                        {group.label}
                    </span>
                    {group.children.length > 1 && (
                        <span className="rounded-full bg-zinc-800 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-300">
                            {group.children.length}
                        </span>
                    )}
                    {!group.isOwnUser && (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-950 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                            <ShieldAlert className="h-2.5 w-2.5" />
                            {group.user}
                        </span>
                    )}
                </div>

                <span className="text-right text-xs tabular-nums text-zinc-200">
                    {formatPercent(group.cpuPercent)}
                </span>
                <span className="text-right text-xs tabular-nums text-zinc-200">
                    {formatBytes(group.memoryBytes)}
                </span>
                <span className="text-right font-mono text-[11px] text-zinc-500">#{group.rootPid}</span>

                <div className="flex items-center justify-end gap-1">
                    {confirming ? (
                        <>
                            <button
                                type="button"
                                onClick={onCancelConfirm}
                                className="rounded px-2 py-1 text-[11px] text-zinc-300 hover:bg-zinc-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={onKillConfirm}
                                disabled={busy}
                                className="flex h-7 items-center gap-1 rounded bg-rose-600 px-2 text-[11px] font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                                title={group.children.length > 1 ? `Kill ${group.children.length} processes` : 'Kill'}
                            >
                                {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Confirm'}
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={onKillRequest}
                            disabled={busy}
                            className="rounded border border-zinc-700 px-3 py-1 text-xs font-medium text-zinc-300 transition hover:border-rose-700 hover:bg-rose-950 hover:text-rose-300 disabled:opacity-50"
                        >
                            {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Kill'}
                        </button>
                    )}
                </div>
            </div>

            {expanded && (
                <div className="border-t border-zinc-800/80 bg-zinc-950/60">
                    {group.children.map((child) => {
                        const childBusy = busyPid === child.pid;
                        return (
                            <div key={child.pid} className={`${ROW_GRID} px-4 py-1.5 hover:bg-zinc-800/40`}>
                                <span />
                                <span className="h-px w-3 justify-self-end bg-zinc-800" aria-hidden="true" />
                                <div className="min-w-0">
                                    <div className="truncate text-xs text-zinc-200" title={child.command}>
                                        {child.name}
                                    </div>
                                    <div className="mt-0.5 truncate text-[10px] text-zinc-500" title={child.command}>
                                        {child.command}
                                    </div>
                                </div>
                                <span className="text-right text-xs tabular-nums text-zinc-300">
                                    {formatPercent(child.cpuPercent)}
                                </span>
                                <span className="text-right text-xs tabular-nums text-zinc-300">
                                    {formatBytes(child.memoryBytes)}
                                </span>
                                <span className="text-right font-mono text-[11px] text-zinc-500">#{child.pid}</span>
                                <div className="flex items-center justify-end">
                                    <button
                                        type="button"
                                        onClick={() => onKillChild(child.pid)}
                                        disabled={childBusy}
                                        className="rounded border border-transparent px-2 py-0.5 text-[11px] font-medium text-zinc-400 transition hover:border-rose-700 hover:bg-rose-950 hover:text-rose-300 disabled:opacity-50"
                                    >
                                        {childBusy ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Kill'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function SortToggle({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`h-7 px-3 text-xs font-medium transition ${
                active ? 'bg-indigo-600 text-white' : 'bg-zinc-950 text-zinc-300 hover:bg-zinc-800'
            }`}
        >
            {label}
        </button>
    );
}
