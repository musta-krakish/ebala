import { useEffect, useState } from 'react';
import {
    AlertTriangle,
    Bluetooth,
    Box,
    CheckCircle2,
    Cpu,
    Database,
    Loader2,
    Monitor,
    Moon,
    Music2,
    RefreshCw,
    Sun,
    Terminal,
    Trash2,
    XCircle
} from 'lucide-react';
import { formatBytes } from '../../lib/format';
import { useAppSettings } from '../useAppSettings';
import { HotkeyCapture } from './HotkeyCapture';

type DbGroupKey = 'sshHosts' | 'rdpHosts' | 'mediaHistory' | 'mediaStats';

interface DbGroupMeta {
    key: DbGroupKey;
    title: string;
    description: string;
}

const DB_GROUPS: DbGroupMeta[] = [
    {
        key: 'sshHosts',
        title: 'SSH hosts & port forwards',
        description: 'Saved hosts, host overrides, port-forward rules.'
    },
    {
        key: 'rdpHosts',
        title: 'RDP hosts',
        description: 'Saved Remote Desktop targets and encrypted passwords.'
    },
    {
        key: 'mediaHistory',
        title: 'Media playback history',
        description: 'Recent-tracks list. Cumulative artist/track stats survive.'
    },
    {
        key: 'mediaStats',
        title: 'Media stats',
        description: 'Per-artist and per-track totals across all time.'
    }
];

const POPUP_SECTIONS: Array<{ key: keyof PopupSectionSettings; label: string; icon: React.ElementType }> = [
    { key: 'showMedia', label: 'Now playing', icon: Music2 },
    { key: 'showBluetooth', label: 'Bluetooth devices', icon: Bluetooth },
    { key: 'showSystem', label: 'System metrics', icon: Cpu },
    { key: 'showSsh', label: 'SSH sessions', icon: Terminal },
    { key: 'showDocker', label: 'Docker containers', icon: Box }
];

export function SettingsPanel() {
    const { settings, update, ready } = useAppSettings();
    const [dbStats, setDbStats] = useState<DbStats | null>(null);
    const [dbLoading, setDbLoading] = useState(false);
    const [confirmKey, setConfirmKey] = useState<DbGroupKey | 'all' | null>(null);
    const [busyKey, setBusyKey] = useState<DbGroupKey | 'all' | null>(null);
    const [dbError, setDbError] = useState<string | null>(null);
    const [hotkeyStatus, setHotkeyStatus] = useState<HotkeyStatus | null>(null);

    const refreshHotkeyStatus = async () => {
        if (typeof window === 'undefined' || !window.hotkeyAPI) return;
        try {
            setHotkeyStatus(await window.hotkeyAPI.status());
        } catch {
            setHotkeyStatus(null);
        }
    };

    const loadStats = async () => {
        if (typeof window === 'undefined' || !window.dbAPI) return;
        setDbLoading(true);
        try {
            setDbStats(await window.dbAPI.getStats());
            setDbError(null);
        } catch (err) {
            setDbError(err instanceof Error ? err.message : 'Failed to read DB stats');
        } finally {
            setDbLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
        refreshHotkeyStatus();
    }, []);

    // The main process re-registers the hotkey synchronously on settings
    // change, but we need to re-fetch status to surface conflicts ("already
    // taken by another app") that only the OS can tell us about.
    useEffect(() => {
        if (!ready) return;
        refreshHotkeyStatus();
    }, [ready, settings.hotkey.combo, settings.hotkey.enabled]);

    const handleClear = async (key: DbGroupKey | 'all') => {
        setBusyKey(key);
        setDbError(null);
        try {
            const groups: DbTableGroup[] = key === 'all'
                ? ['sshHosts', 'rdpHosts', 'mediaHistory', 'mediaStats']
                : [key];
            const next = await window.dbAPI.clearTables(groups);
            setDbStats(next);
        } catch (err) {
            setDbError(err instanceof Error ? err.message : 'Clear failed');
        } finally {
            setBusyKey(null);
            setConfirmKey(null);
        }
    };

    return (
        <section className="space-y-5 pb-5">
            <header>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Settings</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Appearance, storage, and tray popup contents.</p>
            </header>

            <SettingCard title="Appearance" description="Choose the colour scheme. ‘System’ follows macOS appearance.">
                <div className="grid grid-cols-3 gap-2">
                    <ThemeOption
                        active={settings.theme === 'light'}
                        onClick={() => update({ theme: 'light' })}
                        icon={Sun}
                        label="Light"
                    />
                    <ThemeOption
                        active={settings.theme === 'dark'}
                        onClick={() => update({ theme: 'dark' })}
                        icon={Moon}
                        label="Dark"
                    />
                    <ThemeOption
                        active={settings.theme === 'system'}
                        onClick={() => update({ theme: 'system' })}
                        icon={Monitor}
                        label="System"
                    />
                </div>
            </SettingCard>

            <SettingCard
                title="Global hotkey"
                description="Show or hide the main window from anywhere. Default: ⌘⇧M (Cmd+Shift+M)."
            >
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <HotkeyCapture
                            value={settings.hotkey.combo}
                            disabled={!settings.hotkey.enabled || !ready}
                            onChange={(combo) => update({ hotkey: { ...settings.hotkey, combo } })}
                        />
                        <button
                            type="button"
                            disabled={!ready}
                            onClick={() =>
                                update({
                                    hotkey: { ...settings.hotkey, enabled: !settings.hotkey.enabled }
                                })
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                                settings.hotkey.enabled ? 'bg-indigo-600' : 'bg-zinc-300 dark:bg-zinc-700'
                            }`}
                            aria-label="Toggle hotkey"
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                                    settings.hotkey.enabled ? 'translate-x-5' : 'translate-x-0.5'
                                }`}
                            />
                        </button>
                    </div>
                    <HotkeyStatusBadge status={hotkeyStatus} enabled={settings.hotkey.enabled} />
                </div>
                {hotkeyStatus?.error && (
                    <div className="mt-2 flex items-center gap-2 rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {hotkeyStatus.error}. Pick a different combo or quit the conflicting app.
                    </div>
                )}
            </SettingCard>

            <SettingCard
                title="Database"
                description="Stored at app userData; clearing a group also vacuums the file."
                action={
                    <button
                        type="button"
                        onClick={loadStats}
                        disabled={dbLoading}
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        title="Refresh stats"
                    >
                        {dbLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                    </button>
                }
            >
                <div className="mb-3 flex items-center gap-3 rounded-md bg-zinc-100 px-3 py-2 dark:bg-zinc-800/60">
                    <Database className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                    <div className="flex-1">
                        <div className="text-xs font-medium text-zinc-700 dark:text-zinc-200">
                            Total size
                        </div>
                        <div className="truncate text-[11px] text-zinc-500 dark:text-zinc-400" title={dbStats?.path ?? ''}>
                            {dbStats?.path || 'Loading path…'}
                        </div>
                    </div>
                    <div className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                        {dbStats ? formatBytes(dbStats.sizeBytes) : '—'}
                    </div>
                </div>

                {dbError && (
                    <div className="mb-3 flex items-center gap-2 rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {dbError}
                    </div>
                )}

                <ul className="space-y-2">
                    {DB_GROUPS.map((group) => {
                        const stats = dbStats?.groups[group.key];
                        const confirming = confirmKey === group.key;
                        const busy = busyKey === group.key;
                        return (
                            <li
                                key={group.key}
                                className="flex items-center gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/60"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{group.title}</div>
                                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400">{group.description}</div>
                                </div>
                                <div className="text-right text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                                    {stats ? `${stats.rowCount} rows` : '—'}
                                </div>
                                {confirming ? (
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setConfirmKey(null)}
                                            className="rounded px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleClear(group.key)}
                                            disabled={busy}
                                            className="flex h-7 items-center gap-1 rounded bg-rose-600 px-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                                        >
                                            {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Confirm clear'}
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setConfirmKey(group.key)}
                                        disabled={!stats || stats.rowCount === 0}
                                        className="flex h-7 items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 text-xs font-medium text-zinc-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-rose-700 dark:hover:bg-rose-950 dark:hover:text-rose-300"
                                    >
                                        <Trash2 className="h-3 w-3" aria-hidden="true" />
                                        Clear
                                    </button>
                                )}
                            </li>
                        );
                    })}
                </ul>

                <div className="mt-3 flex items-center justify-end">
                    {confirmKey === 'all' ? (
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => setConfirmKey(null)}
                                className="rounded px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => handleClear('all')}
                                disabled={busyKey === 'all'}
                                className="flex h-7 items-center gap-1 rounded bg-rose-600 px-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                            >
                                {busyKey === 'all' ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Yes, clear all'}
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setConfirmKey('all')}
                            disabled={!dbStats || Object.values(dbStats.groups).every((g) => g.rowCount === 0)}
                            className="text-xs font-medium text-rose-600 transition hover:text-rose-700 disabled:opacity-40 dark:text-rose-400 dark:hover:text-rose-300"
                        >
                            Clear everything
                        </button>
                    )}
                </div>
            </SettingCard>

            <SettingCard title="Tray popup" description="Hide sections you never look at in the menu-bar popup.">
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {POPUP_SECTIONS.map(({ key, label, icon: Icon }) => {
                        const enabled = settings.popup[key];
                        return (
                            <li key={key}>
                                <button
                                    type="button"
                                    disabled={!ready}
                                    onClick={() =>
                                        update({ popup: { ...settings.popup, [key]: !enabled } })
                                    }
                                    className={`flex w-full items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm transition ${
                                        enabled
                                            ? 'border-indigo-200 bg-indigo-50 text-indigo-900 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-100 dark:hover:bg-indigo-900/40'
                                            : 'border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:bg-zinc-800'
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <Icon className="h-4 w-4" aria-hidden="true" />
                                        {label}
                                    </span>
                                    <span
                                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                                            enabled ? 'bg-indigo-600' : 'bg-zinc-300 dark:bg-zinc-700'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                                                enabled ? 'translate-x-4' : 'translate-x-0.5'
                                            }`}
                                        />
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </SettingCard>
        </section>
    );
}

interface SettingCardProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}

function SettingCard({ title, description, action, children }: SettingCardProps) {
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

interface ThemeOptionProps {
    active: boolean;
    onClick: () => void;
    icon: React.ElementType;
    label: string;
}

function HotkeyStatusBadge({ status, enabled }: { status: HotkeyStatus | null; enabled: boolean }) {
    if (!enabled) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2 py-1 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                Off
            </span>
        );
    }
    if (!status) {
        return <span className="text-[11px] text-zinc-400">Checking…</span>;
    }
    if (status.registered) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle2 className="h-3 w-3" /> Active
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2 py-1 text-[11px] font-medium text-rose-700 dark:bg-rose-950 dark:text-rose-300">
            <XCircle className="h-3 w-3" /> Conflict
        </span>
    );
}

function ThemeOption({ active, onClick, icon: Icon, label }: ThemeOptionProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex flex-col items-center gap-1.5 rounded-md border px-3 py-3 text-xs font-medium transition ${
                active
                    ? 'border-indigo-300 bg-indigo-50 text-indigo-900 dark:border-indigo-600 dark:bg-indigo-950 dark:text-indigo-100'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:bg-zinc-800'
            }`}
        >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
        </button>
    );
}
