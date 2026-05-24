import { Activity } from 'lucide-react';
import { formatBytes, formatPercent } from '../../lib/format';

interface AppUsagePanelProps {
    metrics: SystemMetrics | null;
}

export function AppUsagePanel({ metrics }: AppUsagePanelProps) {
    const app = metrics?.project;

    return (
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-white shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-amber-300">
                            <Activity className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <div>
                            <div className="text-xs font-medium uppercase tracking-wide text-zinc-400">This App</div>
                            <div className="text-sm text-zinc-400">PID {app?.pid ?? '--'}</div>
                        </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <div>
                            <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">RAM</div>
                            <div className="mt-1 text-3xl font-semibold tracking-normal">{app ? formatBytes(app.memoryBytes) : '--'}</div>
                            <div className="mt-1 text-xs text-zinc-400">{app ? `${app.memoryPercent.toFixed(2)}% of system` : 'No data'}</div>
                        </div>
                        <div>
                            <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">CPU</div>
                            <div className="mt-1 text-3xl font-semibold tracking-normal">{app ? formatPercent(app.cpuPercent) : '--'}</div>
                            <div className="mt-1 text-xs text-zinc-400">{app ? `${metrics.cpu.cores} cores available` : 'No data'}</div>
                        </div>
                        <div>
                            <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">Processes</div>
                            <div className="mt-1 text-3xl font-semibold tracking-normal">{app?.processCount ?? '--'}</div>
                            <div className="mt-1 text-xs text-zinc-400">main, renderer, helpers</div>
                        </div>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                            <div
                                className="h-full rounded-full bg-amber-300"
                                style={{ width: `${Math.min(app?.memoryPercent ?? 0, 100)}%` }}
                            />
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                            <div
                                className="h-full rounded-full bg-cyan-300"
                                style={{ width: `${Math.min(app?.cpuPercent ?? 0, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-lg border border-white/10 bg-white/4 lg:max-w-md">
                    <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-white/10 px-3 py-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
                        <span>Process</span>
                        <span>CPU</span>
                        <span>RAM</span>
                    </div>
                    {app && app.processes.length > 0 ? (
                        app.processes.map((item) => (
                            <div
                                key={item.pid}
                                className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-white/10 px-3 py-2 text-sm last:border-b-0"
                            >
                                <span className="min-w-0">
                                    <span className="block truncate text-zinc-100" title={`${item.name} ${item.pid}`}>
                                        {item.role}
                                    </span>
                                    <span className="block truncate text-xs text-zinc-500">
                                        {item.name} #{item.pid}
                                    </span>
                                </span>
                                <span className="font-medium text-zinc-200">{formatPercent(item.cpuPercent)}</span>
                                <span className="font-medium text-zinc-200">{formatBytes(item.memoryBytes)}</span>
                            </div>
                        ))
                    ) : (
                        <div className="px-3 py-6 text-sm text-zinc-400">No process data yet</div>
                    )}
                </div>
            </div>
        </div>
    );
}
