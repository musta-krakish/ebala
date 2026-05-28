import { useState } from 'react';
import { AlertCircle, Box, Database, Image as ImageIcon, Loader2, Network, Trash2 } from 'lucide-react';
import { useDockerStatus } from './useDocker';
import { ContainersTab } from './ContainersTab';
import { ImagesTab } from './ImagesTab';
import { VolumesTab } from './VolumesTab';
import { NetworksTab } from './NetworksTab';
import { summarizePruneOutput } from './prune-summary';

type DockerSubTab = 'containers' | 'images' | 'volumes' | 'networks';

interface DockerPanelProps {
    onExec: (target: { id: string; name: string; image: string }) => void;
}

const SUB_TABS: Array<{ id: DockerSubTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'containers', label: 'Containers', icon: Box },
    { id: 'images', label: 'Images', icon: ImageIcon },
    { id: 'volumes', label: 'Volumes', icon: Database },
    { id: 'networks', label: 'Networks', icon: Network }
];

export function DockerPanel({ onExec }: DockerPanelProps) {
    const { status, loading } = useDockerStatus();
    const [activeTab, setActiveTab] = useState<DockerSubTab>('containers');
    const [pruning, setPruning] = useState(false);

    const handleSystemPrune = async () => {
        if (
            !window.confirm(
                'Run docker system prune -a -f?\n\nThis removes:\n• All stopped containers\n• All networks not used by a container\n• All dangling AND unused images\n• All build cache'
            )
        ) return;
        setPruning(true);
        try {
            const result = await window.dockerAPI.pruneSystem(true);
            window.alert(summarizePruneOutput(result));
        } catch (err) {
            window.alert(`Prune failed: ${err instanceof Error ? err.message : 'unknown'}`);
        } finally {
            setPruning(false);
        }
    };

    if (loading && !status) {
        return (
            <div className="flex items-center justify-center py-12 text-zinc-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking Docker…
            </div>
        );
    }

    if (!status?.available) {
        return (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-900 dark:bg-amber-950">
                <AlertCircle className="mx-auto h-8 w-8 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                <h3 className="mt-3 text-sm font-semibold text-amber-900 dark:text-amber-100">
                    Docker is not available
                </h3>
                <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                    {status?.error ?? 'Could not reach docker CLI'}
                </p>
                <p className="mt-3 text-xs text-amber-700 dark:text-amber-300">
                    Make sure Docker Desktop (or another runtime) is running and `docker` is on PATH.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        Docker {status.version}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={handleSystemPrune}
                    disabled={pruning}
                    className="inline-flex items-center gap-1.5 rounded-md border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900 dark:bg-zinc-900 dark:text-rose-300 dark:hover:bg-rose-950"
                >
                    {pruning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    System prune (-a)
                </button>
            </div>

            <div className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800">
                {SUB_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition ${
                                active
                                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                                    : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                            }`}
                        >
                            <Icon className="h-4 w-4" aria-hidden="true" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {activeTab === 'containers' && <ContainersTab enabled onExec={onExec} />}
            {activeTab === 'images' && <ImagesTab enabled />}
            {activeTab === 'volumes' && <VolumesTab enabled />}
            {activeTab === 'networks' && <NetworksTab enabled />}
        </div>
    );
}
