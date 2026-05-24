import { Box, Server, X } from 'lucide-react';
import { getSessionLabel, type SshSession } from './useSshSessions';

interface SessionTabsProps {
    sessions: SshSession[];
    activeId: string | null;
    onSelect: (id: string) => void;
    onClose: (id: string) => void;
}

export function SessionTabs({ sessions, activeId, onSelect, onClose }: SessionTabsProps) {
    if (sessions.length === 0) return null;

    return (
        <div className="flex items-stretch gap-1 overflow-x-auto border-b border-zinc-800 bg-zinc-900 px-2 pt-2">
            {sessions.map((session) => {
                const active = session.id === activeId;
                const closed = session.status === 'closed';
                const label = getSessionLabel(session);

                return (
                    <div
                        key={session.id}
                        className={`group flex items-center gap-2 rounded-t-md border border-b-0 px-3 py-1.5 text-xs transition ${
                            active
                                ? 'border-zinc-700 bg-zinc-950 text-zinc-100'
                                : 'border-transparent bg-transparent text-zinc-400 hover:text-zinc-200'
                        }`}
                    >
                        <button
                            type="button"
                            onClick={() => onSelect(session.id)}
                            className="flex items-center gap-2"
                        >
                            <span
                                className={`h-2 w-2 rounded-full ${
                                    closed ? 'bg-zinc-500' : 'bg-emerald-400'
                                }`}
                                aria-hidden="true"
                            />
                            {session.kind === 'docker-exec' ? (
                                <Box className="h-3 w-3 text-sky-400" aria-hidden="true" />
                            ) : (
                                <Server className="h-3 w-3 text-indigo-400" aria-hidden="true" />
                            )}
                            <span className="max-w-45 truncate" title={label}>
                                {label}
                            </span>
                            {closed && session.exitCode !== undefined && (
                                <span className="text-[10px] text-zinc-500">exit {session.exitCode}</span>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => onClose(session.id)}
                            className="flex h-4 w-4 items-center justify-center rounded text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-200"
                            title="Close session"
                        >
                            <X className="h-3 w-3" aria-hidden="true" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
