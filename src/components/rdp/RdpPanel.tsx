import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Monitor, Plus, RefreshCw, Search, X } from 'lucide-react';
import { RdpHostForm } from './RdpHostForm';
import { RdpHostRow } from './RdpHostRow';
import { useRdpHosts, type RdpFailure } from './useRdpHosts';

type FormState = { kind: 'closed' } | { kind: 'add' } | { kind: 'edit'; host: RdpHost };

export function RdpPanel() {
    const rdp = useRdpHosts();
    const [query, setQuery] = useState('');
    const [formState, setFormState] = useState<FormState>({ kind: 'closed' });
    const [connectingId, setConnectingId] = useState<number | null>(null);

    const sessionByHost = useMemo(() => {
        const map = new Map<number, string>();
        for (const session of rdp.activeSessions) {
            // Latest session wins if more than one — disconnect will still
            // target the visible one.
            map.set(session.hostId, session.id);
        }
        return map;
    }, [rdp.activeSessions]);

    const normalizedQuery = query.trim().toLowerCase();
    const filtered = useMemo(
        () =>
            normalizedQuery
                ? rdp.hosts.filter((host) =>
                      [host.label, host.hostname, host.username, host.domain]
                          .filter(Boolean)
                          .some((value) => String(value).toLowerCase().includes(normalizedQuery))
                  )
                : rdp.hosts,
        [rdp.hosts, normalizedQuery]
    );

    if (!rdp.available) {
        return (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
                RDP API is not available in this build.
            </div>
        );
    }

    const xfreerdpReady = rdp.availability?.available;

    return (
        <>
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">RDP Hosts</h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {rdp.loading
                            ? 'Loading…'
                            : `${rdp.hosts.length} saved${rdp.activeSessions.length > 0 ? ` · ${rdp.activeSessions.length} active` : ''}`}
                        {rdp.availability?.binary && ` · ${rdp.availability.binary}`}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        onClick={rdp.refresh}
                        disabled={rdp.loading}
                        title="Reload"
                    >
                        <RefreshCw className={`h-4 w-4 ${rdp.loading ? 'animate-spin' : ''}`} aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        className="inline-flex h-9 items-center gap-2 rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700"
                        onClick={() => setFormState({ kind: 'add' })}
                    >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Add host
                    </button>
                </div>
            </div>

            {!xfreerdpReady && (
                <div className="mb-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <div>
                        xfreerdp is not installed. Install it with <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/50">brew install freerdp</code> and restart the app — Connect won't work until then.
                    </div>
                </div>
            )}

            {rdp.error && (
                <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
                    <span>{rdp.error}</span>
                    <button
                        type="button"
                        onClick={rdp.clearError}
                        className="rounded p-1 hover:bg-rose-100 dark:hover:bg-rose-900"
                        aria-label="Dismiss"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
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

            {filtered.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
                    <Monitor className="mx-auto h-8 w-8 text-zinc-400" aria-hidden="true" />
                    <div className="mt-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        {rdp.hosts.length === 0 ? 'No RDP hosts yet' : 'No matches'}
                    </div>
                    <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {rdp.hosts.length === 0
                            ? 'Click "Add host" to save your first connection.'
                            : 'Try another query.'}
                    </div>
                </div>
            ) : (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((host) => (
                        <RdpHostRow
                            key={host.id}
                            host={host}
                            isConnecting={connectingId === host.id}
                            activeSessionId={sessionByHost.get(host.id)}
                            onConnect={async (h) => {
                                setConnectingId(h.id);
                                await rdp.connect(h.id);
                                setConnectingId(null);
                            }}
                            onEdit={(h) => setFormState({ kind: 'edit', host: h })}
                            onDisconnect={(sessionId) => rdp.disconnect(sessionId)}
                        />
                    ))}
                </div>
            )}

            {formState.kind === 'add' && (
                <RdpHostForm
                    onSubmit={(input) => rdp.create(input)}
                    onClose={() => setFormState({ kind: 'closed' })}
                />
            )}
            {formState.kind === 'edit' && (
                <RdpHostForm
                    initialHost={formState.host}
                    onSubmit={(input) => rdp.update(formState.host.id, input)}
                    onDelete={() => rdp.remove(formState.host.id)}
                    onClose={() => setFormState({ kind: 'closed' })}
                />
            )}

            {rdp.failure && (
                <RdpFailureDialog failure={rdp.failure} onClose={rdp.clearFailure} />
            )}
        </>
    );
}

function RdpFailureDialog({ failure, onClose }: { failure: RdpFailure; onClose: () => void }) {
    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 px-4">
            <div className="w-full max-w-2xl space-y-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                            RDP session failed · {failure.label}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{failure.summary}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                    >
                        <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                </div>

                <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        xfreerdp stderr
                    </div>
                    <pre className="mt-1 max-h-80 overflow-auto rounded-md bg-zinc-50 px-3 py-2 font-mono text-[11px] text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
                        {failure.stderr || '(no stderr captured)'}
                    </pre>
                </div>

                <div className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                    <strong>Hints:</strong>
                    <ul className="mt-1 list-disc space-y-0.5 pl-4">
                        <li>For Tailscale: use the full hostname like <code>host.tail-xxx.ts.net</code> or the 100.x.x.x IP.</li>
                        <li>NLA issues: try extra args <code>/sec:rdp</code> or <code>/sec:tls</code>.</li>
                        <li>Cert errors: add <code>/cert:tofu</code> (trust on first use).</li>
                        <li>Slow links: <code>/network:lan</code> or <code>+gfx-h264</code>.</li>
                    </ul>
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-9 rounded-md bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
