import { useEffect, useState } from 'react';
import { Loader2, Plus, Trash2, X } from 'lucide-react';

interface RunImageModalProps {
    image: DockerImage;
    onClose: () => void;
    onLaunched: () => void;
}

interface KeyValueRow {
    key: string;
    value: string;
}

interface PortRow {
    host: string;
    container: string;
}

interface VolumeRow {
    host: string;
    container: string;
}

export function RunImageModal({ image, onClose, onLaunched }: RunImageModalProps) {
    const [name, setName] = useState('');
    const [autoRemove, setAutoRemove] = useState(false);
    const [command, setCommand] = useState('');
    const [ports, setPorts] = useState<PortRow[]>([{ host: '', container: '' }]);
    const [envVars, setEnvVars] = useState<KeyValueRow[]>([]);
    const [volumes, setVolumes] = useState<VolumeRow[]>([]);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !busy) onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [busy, onClose]);

    const imageRef = image.repository && image.repository !== '<none>'
        ? `${image.repository}:${image.tag}`
        : image.id;

    const submit = async () => {
        setBusy(true);
        setError(null);
        try {
            await window.dockerAPI.runImage({
                image: imageRef,
                name: name.trim() || null,
                detached: true,
                autoRemove,
                ports: ports.filter((p) => p.host.trim() && p.container.trim()),
                env: envVars.filter((e) => e.key.trim()),
                volumes: volumes.filter((v) => v.host.trim() && v.container.trim()),
                command: command.trim() || null
            });
            onLaunched();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to run');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => !busy && onClose()}
        >
            <div
                className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-900"
                onClick={(event) => event.stopPropagation()}
            >
                <header className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
                    <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                            Run container
                        </div>
                        <div className="truncate text-[11px] text-zinc-500 dark:text-zinc-400" title={imageRef}>
                            from {imageRef}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={busy}
                        className="flex h-7 w-7 items-center justify-center rounded text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                    >
                        <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                </header>

                <div className="flex-1 space-y-4 overflow-y-auto p-4">
                    <Field label="Container name (optional)">
                        <input
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="auto-generated if blank"
                            className="h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                        />
                    </Field>

                    <Field label="Port mappings (host : container)">
                        <RowList
                            rows={ports}
                            onChange={setPorts}
                            renderRow={(row, set, remove) => (
                                <>
                                    <input
                                        type="text"
                                        placeholder="8080"
                                        value={row.host}
                                        onChange={(event) => set({ ...row, host: event.target.value })}
                                        className="h-8 w-24 rounded border border-zinc-300 bg-white px-2 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                                    />
                                    <span className="text-zinc-400">:</span>
                                    <input
                                        type="text"
                                        placeholder="80"
                                        value={row.container}
                                        onChange={(event) => set({ ...row, container: event.target.value })}
                                        className="h-8 w-24 rounded border border-zinc-300 bg-white px-2 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                                    />
                                    <RemoveBtn onClick={remove} />
                                </>
                            )}
                            empty={{ host: '', container: '' }}
                            addLabel="Add port"
                        />
                    </Field>

                    <Field label="Environment variables">
                        <RowList
                            rows={envVars}
                            onChange={setEnvVars}
                            renderRow={(row, set, remove) => (
                                <>
                                    <input
                                        type="text"
                                        placeholder="KEY"
                                        value={row.key}
                                        onChange={(event) => set({ ...row, key: event.target.value })}
                                        className="h-8 w-28 rounded border border-zinc-300 bg-white px-2 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                                    />
                                    <span className="text-zinc-400">=</span>
                                    <input
                                        type="text"
                                        placeholder="value"
                                        value={row.value}
                                        onChange={(event) => set({ ...row, value: event.target.value })}
                                        className="h-8 flex-1 rounded border border-zinc-300 bg-white px-2 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                                    />
                                    <RemoveBtn onClick={remove} />
                                </>
                            )}
                            empty={{ key: '', value: '' }}
                            addLabel="Add env var"
                        />
                    </Field>

                    <Field label="Volume mounts (host : container)">
                        <RowList
                            rows={volumes}
                            onChange={setVolumes}
                            renderRow={(row, set, remove) => (
                                <>
                                    <input
                                        type="text"
                                        placeholder="/host/path or volume-name"
                                        value={row.host}
                                        onChange={(event) => set({ ...row, host: event.target.value })}
                                        className="h-8 flex-1 rounded border border-zinc-300 bg-white px-2 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                                    />
                                    <span className="text-zinc-400">:</span>
                                    <input
                                        type="text"
                                        placeholder="/data"
                                        value={row.container}
                                        onChange={(event) => set({ ...row, container: event.target.value })}
                                        className="h-8 w-32 rounded border border-zinc-300 bg-white px-2 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                                    />
                                    <RemoveBtn onClick={remove} />
                                </>
                            )}
                            empty={{ host: '', container: '' }}
                            addLabel="Add volume"
                        />
                    </Field>

                    <Field label="Command override (optional)">
                        <input
                            type="text"
                            value={command}
                            onChange={(event) => setCommand(event.target.value)}
                            placeholder="leave blank to use image CMD"
                            className="h-9 w-full rounded-md border border-zinc-300 bg-white px-3 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                        />
                    </Field>

                    <label className="flex items-center gap-2 text-xs">
                        <input
                            type="checkbox"
                            checked={autoRemove}
                            onChange={(event) => setAutoRemove(event.target.checked)}
                            className="h-4 w-4 cursor-pointer accent-indigo-600"
                        />
                        <span className="text-zinc-700 dark:text-zinc-300">
                            Auto-remove when stopped (<code className="font-mono">--rm</code>)
                        </span>
                    </label>

                    {error && (
                        <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
                            {error}
                        </div>
                    )}
                </div>

                <footer className="flex justify-end gap-2 border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={busy}
                        className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={submit}
                        disabled={busy}
                        className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                        Run
                    </button>
                </footer>
            </div>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {label}
            </label>
            {children}
        </div>
    );
}

interface RowListProps<T> {
    rows: T[];
    onChange: (next: T[]) => void;
    renderRow: (row: T, set: (next: T) => void, remove: () => void) => React.ReactNode;
    empty: T;
    addLabel: string;
}

function RowList<T>({ rows, onChange, renderRow, empty, addLabel }: RowListProps<T>) {
    const add = () => onChange([...rows, empty]);
    const set = (index: number, next: T) => {
        const copy = [...rows];
        copy[index] = next;
        onChange(copy);
    };
    const remove = (index: number) => {
        const copy = [...rows];
        copy.splice(index, 1);
        onChange(copy);
    };

    return (
        <div className="space-y-1.5">
            {rows.map((row, index) => (
                <div key={index} className="flex items-center gap-1.5">
                    {renderRow(row, (next) => set(index, next), () => remove(index))}
                </div>
            ))}
            <button
                type="button"
                onClick={add}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
                <Plus className="h-3 w-3" aria-hidden="true" />
                {addLabel}
            </button>
        </div>
    );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-zinc-400 transition hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950 dark:hover:text-rose-300"
            title="Remove"
        >
            <Trash2 className="h-3 w-3" aria-hidden="true" />
        </button>
    );
}
