import { useState } from 'react';
import { AlertTriangle, ArrowDown, ArrowUp, CheckCircle2, ChevronDown, ChevronRight, X, XCircle } from 'lucide-react';
import { formatBytes, formatPercent, formatRate } from '../../../lib/format';

interface TransferQueueProps {
    active: ActiveTransfer[];
    recent: ActiveTransfer[];
    onCancel: (id: string) => void;
}

export function TransferQueue({ active, recent, onCancel }: TransferQueueProps) {
    if (active.length === 0 && recent.length === 0) {
        return (
            <div className="rounded-lg border border-dashed border-zinc-300 bg-white px-3 py-4 text-center text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                No transfers yet — drag files between panes or use the Upload / Download buttons.
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="border-b border-zinc-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                Transfers
            </div>
            <ul className="max-h-48 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {active.map((transfer) => (
                    <ActiveRow key={transfer.id} transfer={transfer} onCancel={() => onCancel(transfer.id)} />
                ))}
                {recent.map((transfer) => (
                    <FinishedRow key={transfer.id} transfer={transfer} />
                ))}
            </ul>
        </div>
    );
}

function ActiveRow({ transfer, onCancel }: { transfer: ActiveTransfer; onCancel: () => void }) {
    const [expanded, setExpanded] = useState(false);
    const Direction = transfer.direction === 'upload' ? ArrowUp : ArrowDown;
    const directionColor = transfer.direction === 'upload' ? 'text-indigo-500' : 'text-emerald-500';
    const hasDiagnostic = Boolean(transfer.stderr.trim() || transfer.log.length > 0);

    return (
        <li className="px-3 py-2 text-xs">
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    className="flex h-5 w-5 items-center justify-center rounded text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                    title={expanded ? 'Hide details' : 'Show details'}
                >
                    {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                </button>
                <Direction className={`h-3.5 w-3.5 shrink-0 ${directionColor}`} aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-zinc-700 dark:text-zinc-200" title={`${transfer.localPath} ${transfer.direction === 'upload' ? '→' : '←'} ${transfer.hostAlias}:${transfer.remotePath}`}>
                    {transfer.localPath}
                    <span className="text-zinc-400"> {transfer.direction === 'upload' ? '→' : '←'} </span>
                    <span className="text-zinc-500">{transfer.hostAlias}:</span>
                    {transfer.remotePath}
                </span>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-rose-600 dark:hover:bg-zinc-800 dark:hover:text-rose-300"
                    title="Cancel"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div
                    className="h-full rounded-full bg-indigo-500 transition-all"
                    style={{ width: `${Math.min(100, Math.max(0, transfer.percent))}%` }}
                />
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400">
                <span>{formatPercent(transfer.percent)} · {formatBytes(transfer.bytesTransferred)}</span>
                <span>{formatRate(transfer.bytesPerSecond)} · ETA {transfer.eta || '—'}</span>
            </div>
            {expanded && (
                <TransferDetails transfer={transfer} hasDiagnostic={hasDiagnostic} />
            )}
        </li>
    );
}

function TransferDetails({ transfer, hasDiagnostic }: { transfer: ActiveTransfer; hasDiagnostic: boolean }) {
    return (
        <div className="mt-2 space-y-1.5 rounded-md bg-zinc-50 px-2 py-1.5 font-mono text-[10px] dark:bg-zinc-950">
            <div>
                <div className="font-sans text-[9px] uppercase tracking-wide text-zinc-500">Command</div>
                <div className="break-all text-zinc-600 dark:text-zinc-300">{transfer.command}</div>
            </div>
            {transfer.stderr.trim() && (
                <div>
                    <div className="font-sans text-[9px] uppercase tracking-wide text-rose-500">stderr</div>
                    <pre className="whitespace-pre-wrap break-all text-rose-600 dark:text-rose-300">{transfer.stderr.trim()}</pre>
                </div>
            )}
            {transfer.log.length > 0 && (
                <div>
                    <div className="font-sans text-[9px] uppercase tracking-wide text-zinc-500">stdout (last lines)</div>
                    <pre className="whitespace-pre-wrap break-all text-zinc-600 dark:text-zinc-300">{transfer.log.slice(-6).join('\n')}</pre>
                </div>
            )}
            {!hasDiagnostic && (
                <div className="text-zinc-400">No output yet — usually means ssh is still negotiating.</div>
            )}
        </div>
    );
}

function FinishedRow({ transfer }: { transfer: ActiveTransfer }) {
    const Icon = transfer.state === 'done' ? CheckCircle2 : transfer.state === 'error' ? XCircle : AlertTriangle;
    const color =
        transfer.state === 'done'
            ? 'text-emerald-500'
            : transfer.state === 'error'
                ? 'text-rose-500'
                : 'text-amber-500';
    return (
        <li className="px-3 py-2 text-xs">
            <div className="flex items-center gap-2">
                <Icon className={`h-3.5 w-3.5 shrink-0 ${color}`} aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-zinc-600 dark:text-zinc-300">
                    {transfer.localPath}
                    <span className="text-zinc-400"> {transfer.direction === 'upload' ? '→' : '←'} </span>
                    <span className="text-zinc-500">{transfer.hostAlias}:</span>
                    {transfer.remotePath}
                </span>
                <span className="shrink-0 text-[10px] uppercase tracking-wide text-zinc-400">{transfer.state}</span>
            </div>
            {transfer.error && (
                <div className="mt-1 truncate text-[10px] text-rose-500" title={transfer.error}>
                    {transfer.error}
                </div>
            )}
        </li>
    );
}
