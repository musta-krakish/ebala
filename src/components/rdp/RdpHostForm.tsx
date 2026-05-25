import { useEffect, useState } from 'react';
import { Eye, EyeOff, Save, Trash2, X } from 'lucide-react';

interface RdpHostFormProps {
    initialHost?: RdpHost;
    onSubmit: (input: RdpHostInput) => Promise<void>;
    onDelete?: () => Promise<void>;
    onClose: () => void;
}

const COLOR_PRESETS = [
    { value: 'sky', className: 'bg-sky-500' },
    { value: 'indigo', className: 'bg-indigo-500' },
    { value: 'emerald', className: 'bg-emerald-500' },
    { value: 'rose', className: 'bg-rose-500' },
    { value: 'amber', className: 'bg-amber-500' },
    { value: 'violet', className: 'bg-violet-500' }
];

export function RdpHostForm({ initialHost, onSubmit, onDelete, onClose }: RdpHostFormProps) {
    const editing = Boolean(initialHost);

    const [label, setLabel] = useState(initialHost?.label ?? '');
    const [hostname, setHostname] = useState(initialHost?.hostname ?? '');
    const [port, setPort] = useState(initialHost?.port ?? 3389);
    const [username, setUsername] = useState(initialHost?.username ?? '');
    const [domain, setDomain] = useState(initialHost?.domain ?? '');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [color, setColor] = useState(initialHost?.color ?? 'sky');
    const [notes, setNotes] = useState(initialHost?.notes ?? '');
    const [extraArgs, setExtraArgs] = useState(initialHost?.extraArgs ?? '');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!label.trim() || !hostname.trim() || !username.trim()) {
            setError('Label, hostname and username are required');
            return;
        }

        setSubmitting(true);
        setError(null);
        try {
            const input: RdpHostInput = {
                label: label.trim(),
                hostname: hostname.trim(),
                port: Number(port) || 3389,
                username: username.trim(),
                // Same convention as SSH form: empty string when editing means
                // "clear", undefined means "keep existing".
                password: editing && password === '' ? undefined : password,
                domain: domain.trim() || null,
                color,
                notes: notes.trim() || null,
                extraArgs: extraArgs.trim() || null
            };
            await onSubmit(input);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save host');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!onDelete) return;
        if (!confirm(`Delete RDP host "${initialHost?.label}"?`)) return;
        setSubmitting(true);
        try {
            await onDelete();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete host');
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg space-y-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                        {editing ? `Edit RDP host` : 'Add RDP host'}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                    >
                        <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Field label="Label" className="col-span-2">
                        <input
                            type="text"
                            value={label}
                            onChange={(event) => setLabel(event.target.value)}
                            placeholder="Production VM"
                            className={inputClass}
                            autoFocus
                        />
                    </Field>
                    <Field label="Hostname / IP" className="col-span-2">
                        <input
                            type="text"
                            value={hostname}
                            onChange={(event) => setHostname(event.target.value)}
                            placeholder="192.168.1.10"
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Port">
                        <input
                            type="number"
                            value={port}
                            onChange={(event) => setPort(Number(event.target.value))}
                            min={1}
                            max={65535}
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Domain (optional)">
                        <input
                            type="text"
                            value={domain}
                            onChange={(event) => setDomain(event.target.value)}
                            placeholder="WORKGROUP"
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Username" className="col-span-2">
                        <input
                            type="text"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            placeholder="Administrator"
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Password" className="col-span-2">
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder={editing ? 'Leave empty to keep current' : 'Required'}
                                className={`${inputClass} pr-10`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </Field>

                    <Field label="Notes" className="col-span-2">
                        <textarea
                            value={notes}
                            onChange={(event) => setNotes(event.target.value)}
                            rows={2}
                            className={inputClass}
                        />
                    </Field>

                    <Field
                        label="Extra xfreerdp args (advanced)"
                        className="col-span-2"
                    >
                        <textarea
                            value={extraArgs}
                            onChange={(event) => setExtraArgs(event.target.value)}
                            rows={2}
                            placeholder="/sec:rdp /network:lan +gfx-h264"
                            className={`${inputClass} font-mono text-xs`}
                        />
                        <span className="mt-1 block text-[10px] text-zinc-500 dark:text-zinc-400">
                            Whitespace-separated. Useful for Tailscale/quirky hosts (e.g. <code>/sec:rdp</code>, <code>/cert:tofu</code>).
                        </span>
                    </Field>

                    <Field label="Color" className="col-span-2">
                        <div className="flex items-center gap-2">
                            {COLOR_PRESETS.map((preset) => (
                                <button
                                    key={preset.value}
                                    type="button"
                                    onClick={() => setColor(preset.value)}
                                    className={`h-6 w-6 rounded-full transition ${preset.className} ${
                                        color === preset.value ? 'ring-2 ring-offset-2 ring-zinc-700 dark:ring-zinc-300 dark:ring-offset-zinc-900' : 'opacity-70 hover:opacity-100'
                                    }`}
                                    aria-label={preset.value}
                                />
                            ))}
                        </div>
                    </Field>
                </div>

                {error && (
                    <div className="rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        {error}
                    </div>
                )}

                <div className="flex items-center justify-between gap-3">
                    {editing && onDelete ? (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={submitting}
                            className="inline-flex h-9 items-center gap-2 rounded-md border border-rose-200 px-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950"
                        >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                            Delete
                        </button>
                    ) : (
                        <span />
                    )}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex h-9 items-center gap-2 rounded-md bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" aria-hidden="true" />
                            {editing ? 'Save' : 'Add'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

const inputClass =
    'h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:ring-indigo-950';

function Field({
    label,
    children,
    className
}: {
    label: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <label className={`block ${className ?? ''}`}>
            <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {label}
            </span>
            {children}
        </label>
    );
}
