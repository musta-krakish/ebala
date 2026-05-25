import { useCallback, useEffect, useRef, useState } from 'react';
import { useVisibility } from '../../lib/useVisibility';

const POLL_INTERVAL_MS = 2500;
// Exponential moving-average factor for CPU/RAM used as the sort key. Low
// alpha = more weight to history = stable order. We still display the raw
// latest value so the user sees real-time spikes; smoothing is sort-only.
const EWMA_ALPHA = 0.25;

export interface RankedProcess extends ListedProcess {
    smoothedCpu: number;
    smoothedMemory: number;
}

export function useProcessList(enabled: boolean) {
    const [processes, setProcesses] = useState<RankedProcess[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const smoothedRef = useRef<Map<number, { cpu: number; memory: number }>>(new Map());
    const visible = useVisibility();

    const available = typeof window !== 'undefined' && Boolean(window.systemAPI?.listProcesses);

    const load = useCallback(async () => {
        if (!available) return;
        setLoading(true);
        try {
            const raw = await window.systemAPI.listProcesses();
            const nextSmoothed = new Map<number, { cpu: number; memory: number }>();
            const ranked = raw.map((proc) => {
                const prev = smoothedRef.current.get(proc.pid);
                const smoothedCpu = prev
                    ? prev.cpu * (1 - EWMA_ALPHA) + proc.cpuPercent * EWMA_ALPHA
                    : proc.cpuPercent;
                const smoothedMemory = prev
                    ? prev.memory * (1 - EWMA_ALPHA) + proc.memoryBytes * EWMA_ALPHA
                    : proc.memoryBytes;
                nextSmoothed.set(proc.pid, { cpu: smoothedCpu, memory: smoothedMemory });
                return { ...proc, smoothedCpu, smoothedMemory };
            });
            smoothedRef.current = nextSmoothed;
            setProcesses(ranked);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to list processes');
        } finally {
            setLoading(false);
        }
    }, [available]);

    useEffect(() => {
        if (!available || !enabled || !visible) return;

        load();
        const interval = window.setInterval(load, POLL_INTERVAL_MS);
        return () => window.clearInterval(interval);
    }, [available, enabled, visible, load]);

    const kill = useCallback(
        async (pid: number, signal: KillSignal = 'SIGTERM') => {
            if (!available) return { success: false, error: 'systemAPI unavailable' };
            const result = await window.systemAPI.killProcess(pid, signal);
            if (result.success) {
                setProcesses((prev) => prev.filter((item) => item.pid !== pid));
                smoothedRef.current.delete(pid);
            }
            return result;
        },
        [available]
    );

    return { processes, loading, error, refresh: load, kill };
}
