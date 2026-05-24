import { useEffect } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
import { SshTerminal } from './SshTerminal';

interface DetachedTerminalViewProps {
    sessionId: string;
    alias?: string;
    user?: string;
    hostname?: string;
    port?: number;
}

export function DetachedTerminalView({ sessionId, alias, user, hostname, port }: DetachedTerminalViewProps) {
    const target =
        [user && `${user}@`, hostname, port && port !== 22 ? `:${port}` : ''].filter(Boolean).join('') || sessionId;

    useEffect(() => {
        if (alias) document.title = `SSH · ${alias}`;
    }, [alias]);

    useEffect(() => {
        if (typeof window === 'undefined' || !window.sshAPI) return;
        const unsub = window.sshAPI.onSessionExit((payload) => {
            if (payload.sessionId === sessionId) {
                // Give xterm a beat to render the closing message before closing the window.
                window.setTimeout(() => window.close(), 800);
            }
        });
        return unsub;
    }, [sessionId]);

    return (
        <main className="flex h-screen flex-col bg-zinc-950 text-zinc-50">
            <header className="drag-region flex shrink-0 items-center gap-3 border-b border-zinc-800 bg-zinc-900 px-4 py-2.5 pl-20">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500 text-white">
                    <TerminalIcon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{alias || 'SSH Session'}</div>
                    <div className="truncate text-[11px] text-zinc-400">{target}</div>
                </div>
            </header>

            <div className="relative flex-1">
                <SshTerminal sessionId={sessionId} isActive />
            </div>
        </main>
    );
}
