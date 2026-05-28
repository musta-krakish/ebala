import { useState } from 'react';
import {
    Box,
    FileText,
    Loader2,
    Play,
    RotateCw,
    Square,
    Terminal as TerminalIcon,
    Trash2
} from 'lucide-react';
import { useDockerList } from './useDocker';
import { LogsModal } from './LogsModal';
import { summarizePruneOutput } from './prune-summary';

interface ContainersTabProps {
    enabled: boolean;
    onExec: (target: { id: string; name: string; image: string }) => void;
}

type RowAction = 'start' | 'stop' | 'restart' | 'remove' | null;

export function ContainersTab({ enabled, onExec }: ContainersTabProps) {
    const { items, loading, error, refresh } = useDockerList<DockerContainer>(
        () => window.dockerAPI.listContainers(),
        enabled
    );

    const [busy, setBusy] = useState<{ id: string; action: RowAction }>({ id: '', action: null });
    const [logsFor, setLogsFor] = useState<DockerContainer | null>(null);
    const [pruning, setPruning] = useState(false);

    const runAction = async (container: DockerContainer, action: RowAction, fn: () => Promise<unknown>) => {
        setBusy({ id: container.id, action });
        try {
            await fn();
            await refresh();
        } catch (err) {
            window.alert(`Failed: ${err instanceof Error ? err.message : 'unknown'}`);
        } finally {
            setBusy({ id: '', action: null });
        }
    };

    const handleRemove = (container: DockerContainer) => {
        const running = container.state === 'running';
        const msg = running
            ? `Force-remove running container "${container.name}"?`
            : `Remove container "${container.name}"?`;
        if (!window.confirm(msg)) return;
        runAction(container, 'remove', () => window.dockerAPI.removeContainer(container.id, running));
    };

    const handlePrune = async () => {
        if (!window.confirm('Remove all stopped containers?')) return;
        setPruning(true);
        try {
            const result = await window.dockerAPI.pruneContainers();
            await refresh();
            window.alert(summarizePruneOutput(result));
        } catch (err) {
            window.alert(`Prune failed: ${err instanceof Error ? err.message : 'unknown'}`);
        } finally {
            setPruning(false);
        }
    };

    const running = items.filter((c) => c.state === 'running');
    const stopped = items.filter((c) => c.state !== 'running');

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {items.length} containers · {running.length} running
                </div>
                <button
                    type="button"
                    onClick={handlePrune}
                    disabled={pruning || stopped.length === 0}
                    className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                    {pruning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    Prune stopped
                </button>
            </div>

            {error && (
                <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
                    {error}
                </div>
            )}

            {loading && items.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-zinc-500">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading containers…
                </div>
            ) : items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-300 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
                    No containers
                </div>
            ) : (
                <ul className="space-y-2">
                    {items.map((container) => (
                        <ContainerRow
                            key={container.id}
                            container={container}
                            busy={busy.id === container.id ? busy.action : null}
                            onStart={() => runAction(container, 'start', () => window.dockerAPI.startContainer(container.id))}
                            onStop={() => runAction(container, 'stop', () => window.dockerAPI.stopContainer(container.id))}
                            onRestart={() => runAction(container, 'restart', () => window.dockerAPI.restartContainer(container.id))}
                            onRemove={() => handleRemove(container)}
                            onLogs={() => setLogsFor(container)}
                            onExec={() => onExec({ id: container.id, name: container.name, image: container.image })}
                        />
                    ))}
                </ul>
            )}

            {logsFor && <LogsModal container={logsFor} onClose={() => setLogsFor(null)} />}
        </div>
    );
}

interface ContainerRowProps {
    container: DockerContainer;
    busy: RowAction;
    onStart: () => void;
    onStop: () => void;
    onRestart: () => void;
    onRemove: () => void;
    onLogs: () => void;
    onExec: () => void;
}

function ContainerRow({ container, busy, onStart, onStop, onRestart, onRemove, onLogs, onExec }: ContainerRowProps) {
    const running = container.state === 'running';
    const stateClass = running
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
        : container.state === 'exited'
            ? 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';

    return (
        <li className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                <Box className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-semibold" title={container.name}>{container.name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${stateClass}`}>
                        {container.state}
                    </span>
                </div>
                <div className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400" title={container.image}>
                    {container.image} · {container.status}
                </div>
                {container.ports && (
                    <div className="mt-0.5 truncate font-mono text-[11px] text-zinc-400" title={container.ports}>
                        {container.ports}
                    </div>
                )}
            </div>
            <div className="flex shrink-0 items-center gap-1">
                {running ? (
                    <ActionBtn title="Stop" onClick={onStop} busy={busy === 'stop'}>
                        <Square className="h-3.5 w-3.5" />
                    </ActionBtn>
                ) : (
                    <ActionBtn title="Start" onClick={onStart} busy={busy === 'start'}>
                        <Play className="h-3.5 w-3.5" />
                    </ActionBtn>
                )}
                <ActionBtn title="Restart" onClick={onRestart} busy={busy === 'restart'} disabled={!running}>
                    <RotateCw className="h-3.5 w-3.5" />
                </ActionBtn>
                <ActionBtn title="Logs" onClick={onLogs}>
                    <FileText className="h-3.5 w-3.5" />
                </ActionBtn>
                <ActionBtn title="Exec" onClick={onExec} disabled={!running}>
                    <TerminalIcon className="h-3.5 w-3.5" />
                </ActionBtn>
                <ActionBtn title="Remove" onClick={onRemove} busy={busy === 'remove'} variant="danger">
                    <Trash2 className="h-3.5 w-3.5" />
                </ActionBtn>
            </div>
        </li>
    );
}

interface ActionBtnProps {
    title: string;
    onClick: () => void;
    children: React.ReactNode;
    busy?: boolean;
    disabled?: boolean;
    variant?: 'default' | 'danger';
}

function ActionBtn({ title, onClick, children, busy, disabled, variant = 'default' }: ActionBtnProps) {
    const base = 'flex h-8 w-8 items-center justify-center rounded-md transition disabled:cursor-not-allowed disabled:opacity-40';
    const themed =
        variant === 'danger'
            ? 'text-zinc-500 hover:bg-rose-100 hover:text-rose-600 dark:text-zinc-400 dark:hover:bg-rose-950 dark:hover:text-rose-300'
            : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100';

    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            disabled={disabled || busy}
            className={`${base} ${themed}`}
        >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : children}
        </button>
    );
}
