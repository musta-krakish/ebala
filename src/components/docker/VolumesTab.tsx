import { useState } from 'react';
import { Database, Loader2, Trash2 } from 'lucide-react';
import { useDockerList } from './useDocker';
import { summarizePruneOutput } from './prune-summary';

interface VolumesTabProps {
    enabled: boolean;
}

export function VolumesTab({ enabled }: VolumesTabProps) {
    const { items, loading, error, refresh } = useDockerList<DockerVolume>(
        () => window.dockerAPI.listVolumes(),
        enabled
    );

    const [busyName, setBusyName] = useState<string | null>(null);
    const [pruning, setPruning] = useState(false);

    const handleRemove = async (volume: DockerVolume) => {
        if (!window.confirm(`Remove volume "${volume.name}"? Data inside will be lost.`)) return;
        setBusyName(volume.name);
        try {
            await window.dockerAPI.removeVolume(volume.name, false);
            await refresh();
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'unknown';
            if (window.confirm(`Remove failed: ${msg}\n\nForce remove?`)) {
                try {
                    await window.dockerAPI.removeVolume(volume.name, true);
                    await refresh();
                } catch (err2) {
                    window.alert(`Force remove failed: ${err2 instanceof Error ? err2.message : 'unknown'}`);
                }
            }
        } finally {
            setBusyName(null);
        }
    };

    const handlePrune = async () => {
        if (!window.confirm('Remove all volumes not attached to any container?')) return;
        setPruning(true);
        try {
            const result = await window.dockerAPI.pruneVolumes();
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
                <div className="text-xs text-zinc-500 dark:text-zinc-400">{items.length} volumes</div>
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading volumes…
                </div>
            ) : items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-300 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
                    No volumes
                </div>
            ) : (
                <ul className="space-y-1.5">
                    {items.map((volume) => (
                        <li
                            key={volume.name}
                            className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-2.5 dark:border-zinc-800 dark:bg-zinc-900"
                        >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                                <Database className="h-3.5 w-3.5" aria-hidden="true" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-medium text-zinc-950 dark:text-zinc-50" title={volume.name}>
                                    {volume.name}
                                </div>
                                <div className="mt-0.5 truncate text-[11px] text-zinc-400" title={volume.mountpoint}>
                                    {volume.driver} · {volume.mountpoint}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemove(volume)}
                                disabled={busyName === volume.name}
                                title="Remove volume"
                                className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition hover:bg-rose-100 hover:text-rose-600 disabled:opacity-40 dark:text-zinc-400 dark:hover:bg-rose-950 dark:hover:text-rose-300"
                            >
                                {busyName === volume.name ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
