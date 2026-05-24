import { useEffect } from 'react';
import { ChevronDown, ExternalLink, X } from 'lucide-react';
import { SessionTabs } from './SessionTabs';
import { SshTerminal } from './SshTerminal';
import { getSessionLabel, getSessionSubtitle, type SshSession } from './useSshSessions';

interface SshTerminalDrawerProps {
    open: boolean;
    sessions: SshSession[];
    activeId: string | null;
    onSelect: (id: string) => void;
    onClose: (id: string) => void;
    onMinimize: () => void;
    onDetach: (id: string) => void;
}

export function SshTerminalDrawer({
    open,
    sessions,
    activeId,
    onSelect,
    onClose,
    onMinimize,
    onDetach
}: SshTerminalDrawerProps) {
    useEffect(() => {
        if (!open) return;
        const handler = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onMinimize();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, onMinimize]);

    const activeSession = sessions.find((s) => s.id === activeId);
    const activeLabel = activeSession ? getSessionLabel(activeSession) : 'Terminal';
    const activeSubtitle = activeSession ? getSessionSubtitle(activeSession) : 'No active session';
    const canDetach = activeSession?.kind === 'ssh';

    return (
        <aside
            className={`fixed inset-x-0 bottom-0 z-40 flex h-[65vh] flex-col bg-zinc-950 shadow-2xl ring-1 ring-zinc-800 transition-transform duration-200 ease-out ${
                open ? 'translate-y-0' : 'translate-y-full pointer-events-none'
            }`}
            aria-hidden={!open}
        >
            <div className="flex items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        onClick={onMinimize}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100"
                        title="Minimize (Esc)"
                    >
                        <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-zinc-50" title={activeLabel}>
                            {activeLabel}
                        </div>
                        <div className="truncate text-[11px] text-zinc-500">{activeSubtitle}</div>
                    </div>
                </div>
                {activeSession && (
                    <div className="flex items-center gap-2">
                        {canDetach && (
                            <button
                                type="button"
                                onClick={() => onDetach(activeSession.id)}
                                className="flex h-7 items-center gap-1.5 rounded-md border border-zinc-700 bg-transparent px-2.5 text-xs font-medium text-zinc-200 transition hover:bg-zinc-800"
                                title="Open in a separate window"
                            >
                                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                                Detach
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => onClose(activeSession.id)}
                            className="flex h-7 items-center gap-1.5 rounded-md border border-rose-800 bg-transparent px-2.5 text-xs font-medium text-rose-300 transition hover:bg-rose-950"
                            title="Close session"
                        >
                            <X className="h-3.5 w-3.5" aria-hidden="true" />
                            Close
                        </button>
                    </div>
                )}
            </div>

            <SessionTabs sessions={sessions} activeId={activeId} onSelect={onSelect} onClose={onClose} />

            <div className="relative flex-1">
                {sessions.map((session) => (
                    <div key={session.id} className="absolute inset-0">
                        <SshTerminal sessionId={session.id} isActive={open && session.id === activeId} />
                    </div>
                ))}
            </div>
        </aside>
    );
}
