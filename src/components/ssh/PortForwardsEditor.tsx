import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, Plus, Trash2 } from 'lucide-react';

interface PortForwardsEditorProps {
    hostId: string;
}

const emptyDraft = (): PortForwardInput => ({
    type: 'local',
    bindAddress: '',
    bindPort: 0,
    targetHost: '',
    targetPort: 0,
    label: '',
    enabled: true
});

export function PortForwardsEditor({ hostId }: PortForwardsEditorProps) {
    const [forwards, setForwards] = useState<PortForward[]>([]);
    const [draft, setDraft] = useState<PortForwardInput>(emptyDraft());
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        if (!window.sshAPI) return;
        const list = await window.sshAPI.listForwards(hostId);
        setForwards(list);
    }, [hostId]);

    useEffect(() => {
        load();
    }, [load]);

    const handleAdd = async () => {
        setError(null);
        if (!draft.bindPort || !draft.targetPort) {
            setError('bind port and target port are required');
            return;
        }
        setBusy(true);
        try {
            await window.sshAPI.createForward(hostId, {
                ...draft,
                targetHost: draft.targetHost.trim() || 'localhost',
                bindAddress: draft.bindAddress?.trim() || null,
                label: draft.label?.trim() || null
            });
            setDraft(emptyDraft());
            await load();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create forward');
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async (id: number) => {
        await window.sshAPI.deleteForward(id);
        await load();
    };

    const handleToggle = async (forward: PortForward) => {
        await window.sshAPI.updateForward(forward.id, { enabled: !forward.enabled });
        await load();
    };

    return (
        <div>
            <label className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Port forwards <span className="normal-case text-zinc-400">(applied on connect)</span>
            </label>

            {forwards.length > 0 && (
                <ul className="mt-2 space-y-1.5">
                    {forwards.map((forward) => {
                        const bind = forward.bindAddress || (forward.type === 'local' ? '127.0.0.1' : '*');
                        return (
                            <li
                                key={forward.id}
                                className={`flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs transition ${
                                    forward.enabled
                                        ? 'border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800'
                                        : 'border-zinc-200 bg-zinc-100 opacity-60 dark:border-zinc-800 dark:bg-zinc-900'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={forward.enabled}
                                    onChange={() => handleToggle(forward)}
                                    className="h-3.5 w-3.5 cursor-pointer accent-indigo-600"
                                    title={forward.enabled ? 'Disable' : 'Enable'}
                                />
                                <span
                                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                                        forward.type === 'local'
                                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                    }`}
                                >
                                    {forward.type === 'local' ? '-L' : '-R'}
                                </span>
                                <span className="font-mono text-zinc-700 dark:text-zinc-300">
                                    {bind}:{forward.bindPort}
                                </span>
                                <ArrowRight className="h-3 w-3 shrink-0 text-zinc-400" aria-hidden="true" />
                                <span className="font-mono text-zinc-700 dark:text-zinc-300">
                                    {forward.targetHost}:{forward.targetPort}
                                </span>
                                {forward.label && (
                                    <span className="truncate text-zinc-500 dark:text-zinc-400">· {forward.label}</span>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleDelete(forward.id)}
                                    className="ml-auto flex h-6 w-6 items-center justify-center rounded text-zinc-400 transition hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950 dark:hover:text-rose-300"
                                    title="Delete forward"
                                >
                                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}

            <div className="mt-2 grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-1.5 rounded-md border border-dashed border-zinc-300 p-2 text-xs dark:border-zinc-700">
                <select
                    className="h-8 rounded border border-zinc-300 bg-white px-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                    value={draft.type}
                    onChange={(event) => setDraft((d) => ({ ...d, type: event.target.value as PortForwardType }))}
                >
                    <option value="local">-L (local)</option>
                    <option value="remote">-R (remote)</option>
                </select>
                <input
                    type="number"
                    placeholder="bind port"
                    className="h-8 w-full rounded border border-zinc-300 bg-white px-2 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                    value={draft.bindPort || ''}
                    onChange={(event) => setDraft((d) => ({ ...d, bindPort: Number(event.target.value) }))}
                />
                <ArrowRight className="h-3 w-3 shrink-0 text-zinc-400" aria-hidden="true" />
                <input
                    placeholder="localhost:port"
                    className="h-8 w-full rounded border border-zinc-300 bg-white px-2 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                    value={
                        draft.targetHost
                            ? `${draft.targetHost}${draft.targetPort ? `:${draft.targetPort}` : ''}`
                            : draft.targetPort
                                ? String(draft.targetPort)
                                : ''
                    }
                    onChange={(event) => {
                        const raw = event.target.value;
                        if (raw === '') {
                            setDraft((d) => ({ ...d, targetHost: '', targetPort: 0 }));
                            return;
                        }
                        if (/^\d+$/.test(raw)) {
                            setDraft((d) => ({ ...d, targetHost: '', targetPort: Number(raw) }));
                            return;
                        }
                        const [host, port] = raw.split(':');
                        setDraft((d) => ({ ...d, targetHost: host ?? '', targetPort: Number(port) || 0 }));
                    }}
                />
                <button
                    type="button"
                    onClick={handleAdd}
                    disabled={busy}
                    className="flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:opacity-50"
                    title="Add forward"
                >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
            </div>

            {error && (
                <div className="mt-1.5 text-[11px] text-rose-700 dark:text-rose-300">{error}</div>
            )}
        </div>
    );
}
