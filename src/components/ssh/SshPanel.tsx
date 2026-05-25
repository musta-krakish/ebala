import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, EyeOff, Plus, RefreshCw, Search, Terminal as TerminalIcon } from 'lucide-react';
import { FileBrowser } from './files/FileBrowser';
import { HostOverrideForm } from './HostOverrideForm';
import { HostRow } from './HostRow';
import { SavedHostForm } from './SavedHostForm';
import { useSavedHosts } from './useSavedHosts';
import { useSshHosts } from './useSshHosts';
import type { useSshSessions } from './useSshSessions';

type FormState =
    | { kind: 'closed' }
    | { kind: 'add-saved' }
    | { kind: 'edit-saved'; host: SavedHost }
    | { kind: 'override'; host: SshHost };

interface SshPanelProps {
    sshSessions: ReturnType<typeof useSshSessions>;
}

export function SshPanel({ sshSessions }: SshPanelProps) {
    const { hosts, hiddenHosts, loading, error, refresh, available, setOverride, resetOverride, removeKnownHost } = useSshHosts();
    const savedHosts = useSavedHosts();
    const { open } = sshSessions;
    const [query, setQuery] = useState('');
    const [showHidden, setShowHidden] = useState(false);
    const [formState, setFormState] = useState<FormState>({ kind: 'closed' });
    const [browsingHost, setBrowsingHost] = useState<SshHost | null>(null);

    const matches = (host: SshHost, q: string) =>
        [host.alias, host.originalAlias, host.hostname, host.user]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(q));

    const normalizedQuery = query.trim().toLowerCase();
    const filteredHosts = useMemo(
        () => (normalizedQuery ? hosts.filter((host) => matches(host, normalizedQuery)) : hosts),
        [hosts, normalizedQuery]
    );
    const filteredHidden = useMemo(
        () => (normalizedQuery ? hiddenHosts.filter((host) => matches(host, normalizedQuery)) : hiddenHosts),
        [hiddenHosts, normalizedQuery]
    );

    const handleConnect = async (host: SshHost) => {
        try {
            await open(host);
        } catch (err) {
            console.error('Failed to open SSH session:', err);
        }
    };

    const handleEdit = (host: SshHost) => {
        if (host.source === 'saved' && host.savedId !== undefined) {
            const saved = savedHosts.savedHosts.find((item) => item.id === host.savedId);
            if (saved) setFormState({ kind: 'edit-saved', host: saved });
        } else {
            setFormState({ kind: 'override', host });
        }
    };

    const handleSavedSubmit = async (input: SavedHostInput) => {
        if (formState.kind === 'edit-saved') {
            await savedHosts.update(formState.host.id, input);
        } else {
            await savedHosts.create(input);
        }
        await refresh();
    };

    const handleSavedDelete = async () => {
        if (formState.kind !== 'edit-saved') return;
        await savedHosts.remove(formState.host.id);
        await refresh();
    };

    const handleOverrideSubmit = async (patch: HostOverridePatch) => {
        if (formState.kind !== 'override') return;
        await setOverride(formState.host.id, patch);
    };

    const handleOverrideReset = async () => {
        if (formState.kind !== 'override') return;
        await resetOverride(formState.host.id);
    };

    const handleRemoveKnownHost = async () => {
        if (formState.kind !== 'override') return { success: false, error: 'unexpected state' };
        const result = await removeKnownHost(formState.host.hostname);
        // Also drop the override row to keep things tidy
        if (result.success) {
            await resetOverride(formState.host.id);
        }
        return result;
    };

    if (!available) {
        return (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
                SSH API is not available in this build.
            </div>
        );
    }

    if (browsingHost) {
        return <FileBrowser host={browsingHost} onBack={() => setBrowsingHost(null)} />;
    }

    return (
        <>
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">SSH Hosts</h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {loading
                            ? 'Loading…'
                            : `${hosts.length} visible${hiddenHosts.length > 0 ? ` · ${hiddenHosts.length} hidden` : ''}`}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        onClick={refresh}
                        disabled={loading}
                        title="Reload"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        className="inline-flex h-9 items-center gap-2 rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700"
                        onClick={() => setFormState({ kind: 'add-saved' })}
                    >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Add host
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
                    {error}
                </div>
            )}

            <label className="relative mb-4 block w-full md:max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
                <input
                    className="h-10 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-indigo-950"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search hosts"
                />
            </label>

            {filteredHosts.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
                    <TerminalIcon className="mx-auto h-8 w-8 text-zinc-400" aria-hidden="true" />
                    <div className="mt-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        {hosts.length === 0 ? 'No SSH hosts yet' : 'No matches'}
                    </div>
                    <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {hosts.length === 0
                            ? 'Click "Add host" to save your first connection.'
                            : 'Try another query.'}
                    </div>
                </div>
            ) : (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {filteredHosts.map((host) => (
                        <HostRow
                            key={host.id}
                            host={host}
                            onConnect={handleConnect}
                            onEdit={handleEdit}
                            onBrowseFiles={setBrowsingHost}
                            showOriginal
                        />
                    ))}
                </div>
            )}

            {hiddenHosts.length > 0 && (
                <div className="mt-5">
                    <button
                        type="button"
                        onClick={() => setShowHidden((v) => !v)}
                        className="inline-flex items-center gap-2 text-xs font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                        {showHidden ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                        <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                        Hidden hosts ({hiddenHosts.length})
                    </button>

                    {showHidden && (
                        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3 opacity-70">
                            {filteredHidden.map((host) => (
                                <HostRow
                                    key={host.id}
                                    host={host}
                                    onConnect={handleConnect}
                                    onEdit={handleEdit}
                                    showOriginal
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {formState.kind === 'add-saved' && (
                <SavedHostForm
                    encryptionAvailable={savedHosts.encryptionAvailable}
                    onSubmit={handleSavedSubmit}
                    onClose={() => setFormState({ kind: 'closed' })}
                />
            )}
            {formState.kind === 'edit-saved' && (
                <SavedHostForm
                    initialHost={formState.host}
                    encryptionAvailable={savedHosts.encryptionAvailable}
                    onSubmit={handleSavedSubmit}
                    onDelete={handleSavedDelete}
                    onClose={() => setFormState({ kind: 'closed' })}
                />
            )}
            {formState.kind === 'override' && (
                <HostOverrideForm
                    host={formState.host}
                    onSubmit={handleOverrideSubmit}
                    onReset={handleOverrideReset}
                    onRemoveFromFile={handleRemoveKnownHost}
                    onClose={() => setFormState({ kind: 'closed' })}
                />
            )}
        </>
    );
}
