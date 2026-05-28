import React from 'react';

interface SummaryTileProps {
    label: string;
    value: string | number;
    icon: React.ElementType;
    tone: string;
}

export function SummaryTile({ label, value, icon: Icon, tone }: SummaryTileProps) {
    return (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{label}</div>
                    <div className="mt-1 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">{value}</div>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tone}`}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
            </div>
        </div>
    );
}
