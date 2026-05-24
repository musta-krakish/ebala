import { useState } from 'react';
import { Loader2, Network, Trash2 } from 'lucide-react';
import { useDockerList } from './useDocker';
import { summarizePruneOutput } from './prune-summary';

const SYSTEM_NETWORKS = new Set(['bridge', 'host', 'none']);

interface NetworksTabProps {
    enabled: boolean;
}

export function NetworksTab({ enabled }: NetworksTabProps) {
    const { items, loading, error, refresh } = useDockerList<DockerNetwork>(
        () => window.dockerAPI.listNetworks(),
        enabled
    );

    const [busyName, setBusyName] = useState<string | null>(null);
    const [pruning, setPruning] = useState(false);

    const handleRemove = async (network: DockerNetwork) => {
        if (!window.confirm(`Remove network "${network.name}"?`)) return;
        setBusyName(network.name);
        try {
            await window.dockerAPI.removeNetwork(network.name);
            await refresh();
        } catch (err) {
            window.alert(`Remove failed: ${err instanceof Error ? err.message : 'unknown'}`);
        } finally {
            setBusyName(null);
        }
    };

    const handlePrune = async () => {
        if (!window.confirm('Remove all networks not used by any container?')) return;
        setPruning(true);
        try {
            const result = await window.dockerAPI.pruneNetworks();
            await refresh();
            window.alert(summarizePruneOutput(result));
        } catch (err) {
            window.alert(`Prune failed: ${err instanceof Error ? err.message : 'unknown'}`);
        } finally {
            setPruning(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">{items.length} networks</div>
                <button
                    type="button"
                    onClick={handlePrune}
                    disabled={pruning}
                    className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                    {pruning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    Prune unused
                </button>
            </div>

            {error && (
                <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
                    {error}
                </div>
            )}

            {loading && items.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-zinc-500">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading networks…
                </div>
            ) : (
                <ul className="space-y-1.5">
                    {items.map((network) => {
                        const isSystem = SYSTEM_NETWORKS.has(network.name);
                        return (
                            <li
                                key={network.id}
                                className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-2.5 dark:border-zinc-800 dark:bg-zinc-900"
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                    <Network className="h-3.5 w-3.5" aria-hidden="true" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="truncate text-sm font-medium text-zinc-950 dark:text-zinc-50" title={network.name}>
                                            {network.name}
                                        </span>
                                        {isSystem && (
                                            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                                                system
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-0.5 truncate text-[11px] text-zinc-400">
                                        {network.driver} · {network.scope} · {network.id.substring(0, 12)}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemove(network)}
                                    disabled={busyName === network.name || isSystem}
                                    title={isSystem ? 'System network cannot be removed' : 'Remove network'}
                                    className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition hover:bg-rose-100 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-400 dark:hover:bg-rose-950 dark:hover:text-rose-300"
                                >
                                    {busyName === network.name ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
