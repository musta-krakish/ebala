import React from 'react';

interface SettingCardProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}

export function SettingCard({ title, description, action, children }: SettingCardProps) {
    return (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
                    {description && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
                    )}
                </div>
                {action}
            </div>
            {children}
        </div>
    );
}
