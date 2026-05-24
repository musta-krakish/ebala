import { useEffect, useState } from 'react';
import { Eye, EyeOff, Lock, Save, Trash2, X } from 'lucide-react';
import { PortForwardsEditor } from './PortForwardsEditor';

interface SavedHostFormProps {
    initialHost?: SavedHost;
    encryptionAvailable: boolean;
    onSubmit: (input: SavedHostInput) => Promise<void>;
    onDelete?: () => Promise<void>;
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

export function SavedHostForm({
    initialHost,
    encryptionAvailable,
    onSubmit,
    onDelete,
    onClose
}: SavedHostFormProps) {
    const editing = Boolean(initialHost);

    const [label, setLabel] = useState(initialHost?.label ?? '');
    const [hostname, setHostname] = useState(initialHost?.hostname ?? '');
    const [port, setPort] = useState(initialHost?.port ?? 22);
    const [username, setUsername] = useState(initialHost?.username ?? '');
    const [authMethod, setAuthMethod] = useState<SshAuthMethod>(initialHost?.authMethod ?? 'password');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [identityFile, setIdentityFile] = useState(initialHost?.identityFile ?? '');
    const [color, setColor] = useState(initialHost?.color ?? 'indigo');
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
        if (authMethod === 'password' && !editing && !password) {
            setError('Password is required for password authentication');
            return;
        }

        setSubmitting(true);
        setError(null);
        try {
            const input: SavedHostInput = {
                label: label.trim(),
                hostname: hostname.trim(),
                port: Number(port) || 22,
                username: username.trim(),
                authMethod,
                password: editing && password === '' ? null : password,
                identityFile: identityFile.trim() || null,
                color
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
        if (!confirm(`Delete saved host "${initialHost?.label}"?`)) return;
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 p-4 backdrop-blur-sm">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
            >
                <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
                    <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                        {editing ? 'Edit host' : 'Add SSH host'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                    >
                        <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                </div>

                <div className="space-y-3 px-5 py-4">
                    {!encryptionAvailable && authMethod === 'password' && (
                        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
                            Credential encryption unavailable on this system. Passwords cannot be stored.
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Label</label>
                        <input
                            className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:ring-indigo-950"
                            value={label}
                            onChange={(event) => setLabel(event.target.value)}
                            placeholder="My production server"
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-[1fr_100px] gap-3">
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Hostname / IP</label>
                            <input
                                className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:ring-indigo-950"
                                value={hostname}
                                onChange={(event) => setHostname(event.target.value)}
                                placeholder="example.com"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Port</label>
                            <input
                                type="number"
                                className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:ring-indigo-950"
                                value={port}
                                onChange={(event) => setPort(Number(event.target.value))}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Username</label>
                        <input
                            className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:ring-indigo-950"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            placeholder="root"
                        />
                    </div>

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
                            <label className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                Password {editing && <span className="normal-case text-zinc-400">(leave blank to keep existing)</span>}
                            </label>
                            <div className="relative mt-1">
                                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="h-10 w-full rounded-md border border-zinc-300 bg-white pl-9 pr-9 text-sm text-zinc-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:ring-indigo-950"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder={editing && initialHost?.hasPassword ? '••••••••' : 'Password'}
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

                    {authMethod === 'key' && (
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Identity file</label>
                            <input
                                className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:ring-indigo-950"
                                value={identityFile}
                                onChange={(event) => setIdentityFile(event.target.value)}
                                placeholder="~/.ssh/id_ed25519"
                            />
                        </div>
                    )}

                    {editing && initialHost && (
                        <PortForwardsEditor hostId={`saved:${initialHost.id}`} />
                    )}

                    <div>
                        <label className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Color tag</label>
                        <div className="mt-1 flex gap-2">
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

                    {error && (
                        <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
                            {error}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between border-t border-zinc-200 px-5 py-3 dark:border-zinc-800">
                    {editing && onDelete ? (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={submitting}
                            className="inline-flex items-center gap-1.5 rounded-md border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900 dark:bg-zinc-900 dark:text-rose-300 dark:hover:bg-rose-950"
                        >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            Delete
                        </button>
                    ) : (
                        <div />
                    )}

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
                            {editing ? 'Save changes' : 'Add host'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
