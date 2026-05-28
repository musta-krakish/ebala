import React from 'react';

export interface TabItem {
    id: string;
    label: string;
    icon: React.ElementType;
    // A badge hook, not a precomputed value: the tab set is dynamic (plugins
    // toggle on/off), so each badge hook must live in its own component that
    // mounts/unmounts with the tab — calling hooks in a loop over a changing
    // list would violate the rules of hooks.
    useBadge?: () => number | undefined;
}

interface TabNavProps {
    items: TabItem[];
    activeId: string;
    onChange: (id: string) => void;
}

function TabBadge({ useBadge }: { useBadge: () => number | undefined }) {
    const value = useBadge();
    if (value === undefined) return null;
    return (
        <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-zinc-200 px-1.5 text-[10px] font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {value}
        </span>
    );
}

export function TabNav({ items, activeId, onChange }: TabNavProps) {
    return (
        <nav className="flex gap-1 border-b border-zinc-200 bg-white px-2 dark:border-zinc-800 dark:bg-zinc-900">
            {items.map((item) => {
                const Icon = item.icon;
                const active = item.id === activeId;
                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => onChange(item.id)}
                        className={`group relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition ${
                            active
                                ? 'text-zinc-950 dark:text-zinc-50'
                                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                        }`}
                    >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {item.label}
                        {item.useBadge && <TabBadge useBadge={item.useBadge} />}
                        {active && (
                            <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-t bg-indigo-600 dark:bg-indigo-400" />
                        )}
                    </button>
                );
            })}
        </nav>
    );
}
