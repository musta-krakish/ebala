import { Cpu, HardDrive, MemoryStick, Network as NetworkIcon, RefreshCw } from 'lucide-react';
import { formatBytes, formatPercent, formatRate } from '../../lib/format';
import { AppUsagePanel } from './AppUsagePanel';
import { MetricCard } from './MetricCard';

interface SystemMonitorPanelProps {
    metrics: SystemMetrics | null;
    loading: boolean;
    onRefresh: () => void;
}

export function SystemMonitorPanel({ metrics, loading, onRefresh }: SystemMonitorPanelProps) {
    return (
        <section className="pb-5">
            <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">System Monitor</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {metrics ? `Updated ${new Date(metrics.timestamp).toLocaleTimeString()}` : 'Waiting for metrics'}
                    </p>
                </div>
                <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    onClick={onRefresh}
                    disabled={loading}
                    title="Refresh system metrics"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
                </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                    label="CPU"
                    value={metrics ? formatPercent(metrics.cpu.percent) : '--'}
                    detail={metrics ? `${metrics.cpu.cores} cores / load ${metrics.cpu.loadAverage[0].toFixed(2)}` : 'No data'}
                    percent={metrics?.cpu.percent}
                    icon={Cpu}
                    tone="bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
                />
                <MetricCard
                    label="RAM"
                    value={metrics ? formatBytes(metrics.memory.usedBytes) : '--'}
                    detail={metrics ? `${formatBytes(metrics.memory.freeBytes)} free of ${formatBytes(metrics.memory.totalBytes)}` : 'No data'}
                    percent={metrics?.memory.percent}
                    icon={MemoryStick}
                    tone="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                />
                <MetricCard
                    label="Disk"
                    value={metrics ? formatBytes(metrics.disk.usedBytes) : '--'}
                    detail={metrics ? `${formatBytes(metrics.disk.freeBytes)} free on ${metrics.disk.mount}` : 'No data'}
                    percent={metrics?.disk.percent}
                    icon={HardDrive}
                    tone="bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                />
                <MetricCard
                    label="Network"
                    value={metrics ? `↓ ${formatRate(metrics.network.rxBytesPerSecond)}` : '--'}
                    detail={metrics ? `↑ ${formatRate(metrics.network.txBytesPerSecond)} / ${formatBytes(metrics.network.rxBytes)} total` : 'No data'}
                    icon={NetworkIcon}
                    tone="bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300"
                />
            </div>

            <div className="mt-3">
                <AppUsagePanel metrics={metrics} />
            </div>
        </section>
    );
}
