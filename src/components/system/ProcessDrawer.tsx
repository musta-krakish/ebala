import { useEffect } from 'react';
import { Activity, ChevronDown } from 'lucide-react';
import { ProcessListPanel } from './ProcessListPanel';

interface ProcessDrawerProps {
    open: boolean;
    onMinimize: () => void;
}

export function ProcessDrawer({ open, onMinimize }: ProcessDrawerProps) {
    useEffect(() => {
        if (!open) return;
        const handler = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onMinimize();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, onMinimize]);

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
                    <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-amber-300" aria-hidden="true" />
                        <div>
                            <div className="text-sm font-semibold text-zinc-50">Processes</div>
                            <div className="text-[11px] text-zinc-500">Activity monitor & kill</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <ProcessListPanel enabled={open} />
            </div>
        </aside>
    );
}
