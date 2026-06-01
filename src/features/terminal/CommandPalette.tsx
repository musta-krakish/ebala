import { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';

export interface PaletteCommand {
    id: string;
    label: string;
    section?: string;
    hint?: string;
    active?: boolean;
    run: () => void;
}

interface CommandPaletteProps {
    commands: PaletteCommand[];
    onClose: () => void;
}

// Mounted only while open (parent conditionally renders it), so useState
// initializers reset query/selection on each open without a syncing effect.
export function CommandPalette({ commands, onClose }: CommandPaletteProps) {
    const [query, setQuery] = useState('');
    const [index, setIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // focus after the overlay paints (focus is not a state update)
        requestAnimationFrame(() => inputRef.current?.focus());
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return commands;
        return commands.filter(
            (c) => c.label.toLowerCase().includes(q) || c.section?.toLowerCase().includes(q)
        );
    }, [commands, query]);

    const clampedIndex = Math.min(index, Math.max(0, filtered.length - 1));

    const onKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            onClose();
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            setIndex((i) => Math.min(filtered.length - 1, i + 1));
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setIndex((i) => Math.max(0, i - 1));
        } else if (event.key === 'Enter') {
            event.preventDefault();
            const command = filtered[clampedIndex];
            if (command) {
                onClose();
                command.run();
            }
        }
    };

    let lastSection: string | undefined;

    return (
        <div
            className="absolute inset-0 z-50 flex items-start justify-center bg-black/50 pt-[12vh]"
            onMouseDown={onClose}
        >
            <div
                className="w-[34rem] max-w-[92%] overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="flex items-center gap-2 border-b border-zinc-800 px-3">
                    <Search className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(event) => {
                            setQuery(event.target.value);
                            setIndex(0);
                        }}
                        onKeyDown={onKeyDown}
                        placeholder="Type a command…"
                        spellCheck={false}
                        className="flex-1 bg-transparent py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
                    />
                </div>
                <ul className="max-h-[50vh] overflow-y-auto py-1">
                    {filtered.length === 0 ? (
                        <li className="px-3 py-3 text-sm text-zinc-600">No matching commands.</li>
                    ) : (
                        filtered.map((command, i) => {
                            const showSection = command.section && command.section !== lastSection;
                            lastSection = command.section;
                            return (
                                <li key={command.id}>
                                    {showSection && (
                                        <div className="px-3 pb-0.5 pt-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-600">
                                            {command.section}
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onMouseEnter={() => setIndex(i)}
                                        onClick={() => {
                                            onClose();
                                            command.run();
                                        }}
                                        className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${
                                            i === clampedIndex
                                                ? 'bg-indigo-600 text-white'
                                                : 'text-zinc-200 hover:bg-zinc-800'
                                        }`}
                                    >
                                        <span className="flex-1 truncate">{command.label}</span>
                                        {command.active && (
                                            <span
                                                className={`rounded px-1.5 py-0.5 text-[10px] ${
                                                    i === clampedIndex ? 'bg-indigo-500' : 'bg-zinc-800 text-zinc-400'
                                                }`}
                                            >
                                                current
                                            </span>
                                        )}
                                        {command.hint && (
                                            <span
                                                className={`shrink-0 text-[10px] ${
                                                    i === clampedIndex ? 'text-indigo-200' : 'text-zinc-500'
                                                }`}
                                            >
                                                {command.hint}
                                            </span>
                                        )}
                                    </button>
                                </li>
                            );
                        })
                    )}
                </ul>
            </div>
        </div>
    );
}
