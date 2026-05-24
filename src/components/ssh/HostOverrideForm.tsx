import { useEffect, useState } from 'react';
import { Eye, EyeOff, Lock, RotateCcw, Save, Trash2, X } from 'lucide-react';
import { PortForwardsEditor } from './PortForwardsEditor';

interface HostOverrideFormProps {
    host: SshHost;
    onSubmit: (patch: HostOverridePatch) => Promise<void>;
    onReset: () => Promise<void>;
    onRemoveFromFile: () => Promise<{ success: boolean; error?: string }>;
    onClose: () => void;
}

const COLOR_PRESETS = [
    { value: 'indigo', className: 'bg-indigo-500' },
    { value: 'emerald', className: 'bg-emerald-500' },
    { value: 'rose', className: 'bg-rose-500' },
    { value: 'amber', className: 'bg-amber-500' },
    { value: 'sky', className: 'bg-sky-500' },
    { value: 'violet', className: 'bg-violet-500' }
];

export function HostOverrideForm({ host, onSubmit, onReset, onRemoveFromFile, onClose }: HostOverrideFormProps) {
    const originalAlias = host.originalAlias ?? host.alias;
    const originalUser = host.originalUser ?? '';

    const [alias, setAlias] = useState(host.customAlias ?? '');
    const [username, setUsername] = useState(host.user && host.user !== host.originalUser ? host.user : '');
    const [authMethod, setAuthMethod] = useState<SshAuthMethod>(host.authMethod ?? 'password');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [color, setColor] = useState(host.color ?? '');
    const [notes, setNotes] = useState(host.notes ?? '');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const buildPatch = (extra?: Partial<HostOverridePatch>): HostOverridePatch => {
        const patch: HostOverridePatch = {
            customAlias: alias.trim() ? alias.trim() : null,
            color: color || null,
            notes: notes.trim() ? notes.trim() : null,
            username: username.trim() ? username.trim() : null,
            authMethod: username.trim() ? authMethod : null,
            ...extra
        };
        // password: leave undefined to keep stored value; non-empty sets a new one
        if (password) patch.password = password;
        return patch;
    };

    const submit = async (extra?: Partial<HostOverridePatch>) => {
        setSubmitting(true);
        setError(null);
        try {
            await onSubmit(buildPatch(extra));
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save');
            setSubmitting(false);
        }
    };

    const handleClearPassword = async () => {
        if (!confirm('Remove stored password for this host?')) return;
        await submit({ password: null });
    };

    const handleReset = async () => {
        if (!confirm('Reset all overrides for this host (including stored password)?')) return;
        setSubmitting(true);
        try {
            await onReset();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to reset');
            setSubmitting(false);
        }
    };

    const handleRemoveFromFile = async () => {
        if (
            !confirm(
                `Permanently remove "${host.hostname}" from ~/.ssh/known_hosts?\nThis runs "ssh-keygen -R" and cannot be undone.`
            )
        ) {
            return;
        }
        setSubmitting(true);
        const result = await onRemoveFromFile();
        if (result.success) {
            onClose();
        } else {
            setError(result.error ?? 'ssh-keygen failed');
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 p-4 backdrop-blur-sm">
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    submit();
                }}
                className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
            >
                <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
                    <div className="min-w-0">
                        <h2 className="truncate text-base font-semibold text-zinc-950 dark:text-zinc-50">
                            Customize {originalAlias}
                        </h2>
                        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                            {host.source === 'config' ? '~/.ssh/config' : '~/.ssh/known_hosts'} · {host.hostname}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                    >
                        <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                </div>

                <div className="space-y-3 px-5 py-4">
                    <div>
                        <label className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                            Custom alias <span className="normal-case text-zinc-400">(empty = use original)</span>
                        </label>
                        <input
                            className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:ring-indigo-950"
                            value={alias}
                            onChange={(event) => setAlias(event.target.value)}
                            placeholder={originalAlias}
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                            Username <span className="normal-case text-zinc-400">(empty = use ssh-config default)</span>
                        </label>
                        <input
                            className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:ring-indigo-950"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            placeholder={originalUser || 'root'}
                        />
                    </div>

                    {username.trim() && (
                        <>
                            <div>
                                <label className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Auth method</label>
                                <div className="mt-1 inline-flex rounded-md border border-zinc-300 bg-white p-1 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
                                    {(['password', 'key', 'agent'] as const).map((method) => (
                                        <button
                                            key={method}
                                            type="button"
                                            className={`h-8 rounded-md px-3 text-xs font-medium capitalize transition ${
                                                authMethod === method
                                                    ? 'bg-zinc-950 text-white dark:bg-indigo-500'
                                                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700'
                                            }`}
                                            onClick={() => setAuthMethod(method)}
                                        >
                                            {method}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {authMethod === 'password' && (
                                <div>
                                    <label className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                        <span>
                                            Password{' '}
                                            {host.hasOverridePassword && (
                                                <span className="normal-case text-zinc-400">(stored; empty = keep)</span>
                                            )}
                                        </span>
                                        {host.hasOverridePassword && (
                                            <button
                                                type="button"
                                                onClick={handleClearPassword}
                                                className="text-[10px] font-normal normal-case text-rose-600 hover:underline dark:text-rose-400"
                                            >
                                                Remove stored
                                            </button>
                                        )}
                                    </label>
                                    <div className="relative mt-1">
                                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="h-10 w-full rounded-md border border-zinc-300 bg-white pl-9 pr-9 text-sm text-zinc-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:ring-indigo-950"
                                            value={password}
                                            onChange={(event) => setPassword(event.target.value)}
                                            placeholder={host.hasOverridePassword ? '••••••••' : 'Password'}
                                            autoComplete="off"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <PortForwardsEditor hostId={host.id} />

                    <div>
                        <label className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Color tag</label>
                        <div className="mt-1 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setColor('')}
                                className={`flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-zinc-400 text-[10px] text-zinc-500 transition ${
                                    color === '' ? 'ring-2 ring-zinc-950 dark:ring-zinc-50' : ''
                                }`}
                                title="Default"
                            >
                                ×
                            </button>
                            {COLOR_PRESETS.map((preset) => (
                                <button
                                    key={preset.value}
                                    type="button"
                                    onClick={() => setColor(preset.value)}
                                    className={`h-7 w-7 rounded-full ${preset.className} ring-offset-2 transition dark:ring-offset-zinc-900 ${
                                        color === preset.value ? 'ring-2 ring-zinc-950 dark:ring-zinc-50' : ''
                                    }`}
                                    title={preset.value}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Notes</label>
                        <textarea
                            rows={2}
                            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:ring-indigo-950"
                            value={notes}
                            onChange={(event) => setNotes(event.target.value)}
                            placeholder="Any context, role, owner…"
                        />
                    </div>

                    {error && (
                        <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
                            {error}
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200 px-5 py-3 dark:border-zinc-800">
                    <div className="flex flex-wrap gap-2">
                        {host.hidden ? (
                            <button
                                type="button"
                                onClick={() => submit({ hidden: false })}
                                disabled={submitting}
                                className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50 dark:border-emerald-900 dark:bg-zinc-900 dark:text-emerald-300 dark:hover:bg-emerald-950"
                            >
                                Unhide
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => submit({ hidden: true })}
                                disabled={submitting}
                                className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-white px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-50 disabled:opacity-50 dark:border-amber-900 dark:bg-zinc-900 dark:text-amber-300 dark:hover:bg-amber-950"
                            >
                                <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                                Hide
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={submitting}
                            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                            Reset
                        </button>
                        {host.source === 'known_hosts' && (
                            <button
                                type="button"
                                onClick={handleRemoveFromFile}
                                disabled={submitting}
                                className="inline-flex items-center gap-1.5 rounded-md border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900 dark:bg-zinc-900 dark:text-rose-300 dark:hover:bg-rose-950"
                                title="ssh-keygen -R: permanently remove from known_hosts"
                            >
                                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                                Delete from file
                            </button>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
                        >
                            <Save className="h-3.5 w-3.5" aria-hidden="true" />
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
