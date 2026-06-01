import { useEffect, useRef } from 'react';
import { TerminalView } from './TerminalView';

interface DetachedTerminalProps {
    sessionId: string;
    title?: string;
}

/**
 * Standalone window for a detached local terminal session. Reuses TerminalView
 * (block sidebar included) bound to the same session id; output mirrors via the
 * terminal:* broadcast. Auto-closes shortly after the shell exits.
 */
export function DetachedTerminal({ sessionId, title }: DetachedTerminalProps) {
    const closeTimer = useRef<number | undefined>(undefined);

    useEffect(() => {
        return () => {
            if (closeTimer.current) window.clearTimeout(closeTimer.current);
        };
    }, []);

    return (
        <div className="flex h-screen flex-col bg-zinc-950 text-zinc-100">
            <div className="drag-region flex h-9 shrink-0 items-center justify-center border-b border-zinc-800 bg-zinc-900 text-xs font-medium text-zinc-400">
                {title ? `Terminal · ${title}` : 'Terminal'}
            </div>
            <div className="min-h-0 flex-1">
                <TerminalView
                    sessionId={sessionId}
                    isActive
                    onExit={() => {
                        closeTimer.current = window.setTimeout(() => window.appAPI.closeSelf(), 1200);
                    }}
                />
            </div>
        </div>
    );
}
