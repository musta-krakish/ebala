import React from 'react';

interface MetricCardProps {
    label: string;
    value: string;
    detail: string;
    percent?: number;
    icon: React.ElementType;
    tone: string;
}

export function MetricCard({ label, value, detail, percent, icon: Icon, tone }: MetricCardProps) {
    const normalizedPercent = percent === undefined ? null : Math.min(Math.max(percent, 0), 100);

    return (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{label}</div>
                    <div className="mt-1 truncate text-xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-50">{value}</div>
                    <div className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">{detail}</div>
                </div>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tone}`}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
            </div>

            {normalizedPercent !== null && (
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div className="h-full rounded-full bg-zinc-950 dark:bg-indigo-500" style={{ width: `${normalizedPercent}%` }} />
                </div>
            )}
        </div>
    );
}
