import { useState } from 'react';
import { ImageIcon, Loader2, Play, Trash2 } from 'lucide-react';
import { useDockerList } from './useDocker';
import { summarizePruneOutput } from './prune-summary';
import { RunImageModal } from './RunImageModal';

interface ImagesTabProps {
    enabled: boolean;
}

export function ImagesTab({ enabled }: ImagesTabProps) {
    const { items, loading, error, refresh } = useDockerList<DockerImage>(
        () => window.dockerAPI.listImages(),
        enabled
    );

    const [busyId, setBusyId] = useState<string | null>(null);
    const [pruning, setPruning] = useState(false);
    const [runFor, setRunFor] = useState<DockerImage | null>(null);

    const handleRemove = async (image: DockerImage) => {
        const label = `${image.repository}:${image.tag}`;
        const force = window.confirm(
            `Remove image "${label}"?\n\nClick OK to remove, Cancel to abort. Use Force-remove for images used by stopped containers via prune.`
        );
        if (!force) return;

        setBusyId(image.id);
        try {
            await window.dockerAPI.removeImage(image.id, false);
            await refresh();
        } catch (err) {
            // Maybe in use — try force
            const msg = err instanceof Error ? err.message : 'unknown';
            if (window.confirm(`Remove failed: ${msg}\n\nForce remove (will untag)?`)) {
                try {
                    await window.dockerAPI.removeImage(image.id, true);
                    await refresh();
                } catch (err2) {
                    window.alert(`Force remove failed: ${err2 instanceof Error ? err2.message : 'unknown'}`);
                }
            }
        } finally {
            setBusyId(null);
        }
    };

    const handlePrune = async (all: boolean) => {
        const msg = all
            ? 'Remove ALL unused images (including ones not referenced by any container)?'
            : 'Remove dangling images (untagged)?';
        if (!window.confirm(msg)) return;
        setPruning(true);
        try {
            const result = await window.dockerAPI.pruneImages(all);
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
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {items.length} images
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => handlePrune(false)}
                        disabled={pruning}
                        className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                        {pruning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                        Prune dangling
                    </button>
                    <button
                        type="button"
                        onClick={() => handlePrune(true)}
                        disabled={pruning}
                        className="inline-flex items-center gap-1.5 rounded-md border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900 dark:bg-zinc-900 dark:text-rose-300 dark:hover:bg-rose-950"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Prune all unused
                    </button>
                </div>
            </div>

            {error && (
                <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
                    {error}
                </div>
            )}

            {loading && items.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-zinc-500">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading images…
                </div>
            ) : items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-300 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
                    No images
                </div>
            ) : (
                <ul className="space-y-1.5">
                    {items.map((image) => {
                        const dangling = !image.repository || image.repository === '<none>';
                        return (
                            <li
                                key={`${image.id}-${image.repository}-${image.tag}`}
                                className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-2.5 transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                                    <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`truncate text-sm font-medium ${
                                                dangling ? 'italic text-zinc-400' : 'text-zinc-950 dark:text-zinc-50'
                                            }`}
                                            title={`${image.repository}:${image.tag}`}
                                        >
                                            {dangling ? '<dangling>' : `${image.repository}:${image.tag}`}
                                        </span>
                                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-mono text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                                            {image.size}
                                        </span>
                                    </div>
                                    <div className="mt-0.5 truncate text-[11px] text-zinc-400" title={image.id}>
                                        {image.id.substring(0, 12)} · {image.createdSince}
                                    </div>
                                </div>
                                {!dangling && (
                                    <button
                                        type="button"
                                        onClick={() => setRunFor(image)}
                                        title="Run new container"
                                        className="flex h-8 items-center gap-1.5 rounded-md border border-emerald-200 bg-white px-2.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-900 dark:bg-zinc-900 dark:text-emerald-300 dark:hover:bg-emerald-950"
                                    >
                                        <Play className="h-3 w-3" aria-hidden="true" />
                                        Run
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleRemove(image)}
                                    disabled={busyId === image.id}
                                    title="Remove image"
                                    className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition hover:bg-rose-100 hover:text-rose-600 disabled:opacity-40 dark:text-zinc-400 dark:hover:bg-rose-950 dark:hover:text-rose-300"
                                >
                                    {busyId === image.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}

            {runFor && (
                <RunImageModal
                    image={runFor}
                    onClose={() => setRunFor(null)}
                    onLaunched={() => refresh()}
                />
            )}
        </div>
    );
}
