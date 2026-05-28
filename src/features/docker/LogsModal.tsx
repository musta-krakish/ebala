import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, RefreshCw, X } from 'lucide-react';

interface LogsModalProps {
    container: DockerContainer;
    onClose: () => void;
}

const TAIL_OPTIONS = [100, 500, 1000, 5000];

export function LogsModal({ container, onClose }: LogsModalProps) {
    const [tail, setTail] = useState(500);
    const [logs, setLogs] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const preRef = useRef<HTMLPreElement>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const output = await window.dockerAPI.getLogs(container.id, tail);
            setLogs(output);
            requestAnimationFrame(() => {
                if (preRef.current) {
                    preRef.current.scrollTop = preRef.current.scrollHeight;
                }
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'failed');
        } finally {
            setLoading(false);
        }
    }, [container.id, tail]);

    useEffect(() => {
        load();
    }, [load]);

    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="flex h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-zinc-950 shadow-2xl ring-1 ring-zinc-800"
                onClick={(event) => event.stopPropagation()}
            >
                <header className="flex items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
                    <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-zinc-50" title={container.name}>
                            {container.name}
                        </div>
                        <div className="truncate text-[11px] text-zinc-400" title={container.image}>
                            logs · {container.image}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={tail}
                            onChange={(event) => setTail(Number(event.target.value))}
                            className="h-7 rounded border border-zinc-700 bg-zinc-800 px-2 text-xs text-zinc-100"
                        >
                            {TAIL_OPTIONS.map((value) => (
                                <option key={value} value={value}>
                                    last {value}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={load}
                            disabled={loading}
                            className="flex h-7 items-center gap-1.5 rounded border border-zinc-700 bg-zinc-800 px-2.5 text-xs font-medium text-zinc-100 transition hover:bg-zinc-700 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <RefreshCw className="h-3.5 w-3.5" />
                            )}
                            Refresh
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-7 w-7 items-center justify-center rounded text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100"
                            title="Close (Esc)"
                        >
                            <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                    </div>
                </header>

                {error ? (
                    <div className="m-4 rounded-md border border-rose-800 bg-rose-950 px-3 py-2 text-xs text-rose-200">
                        {error}
                    </div>
                ) : (
                    <pre
                        ref={preRef}
                        className="m-0 flex-1 overflow-auto bg-zinc-950 p-4 font-mono text-[11px] leading-relaxed text-zinc-300"
                    >
                        {logs || (loading ? 'Loading…' : 'No log output')}
                    </pre>
                )}
            </div>
        </div>
    );
}
