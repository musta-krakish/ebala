import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Activity, ChevronUp, Cpu, HardDrive, Settings as SettingsIcon, Terminal, X } from 'lucide-react';
import { SshPanel } from './ssh/SshPanel';
import { SshTerminalDrawer } from './ssh/SshTerminalDrawer';
import { useSshSessions } from './ssh/useSshSessions';
import { DiskUsagePanel } from './disk/DiskUsagePanel';
import { SettingsPanel } from './settings/SettingsPanel';
import { ProcessDrawer } from './system/ProcessDrawer';
import { SystemMonitorPanel } from './system/SystemMonitorPanel';
import { useSystemMetrics } from './system/useSystemMetrics';
import { TabNav, type TabItem } from './tabs/TabNav';
import { ThemeToggle } from './theme/ThemeToggle';
import { rendererPlugins } from '../features/renderer-plugins';
import { useExternalPlugins, useExternalPluginLoader } from '../plugin/runtime';
import { ExecProvider } from '../lib/exec-context';
import { useAppSettings } from './useAppSettings';

const ERROR_VISIBLE_MS = 5000;

export function ControlCenter() {
    const [selectedTab, setActiveTab] = useState<string>('ssh');
    const [error, setError] = useState<string | null>(null);

    const showError = useCallback((message: string) => {
        setError(message);
        window.setTimeout(() => setError(null), ERROR_VISIBLE_MS);
    }, []);

    const { settings } = useAppSettings();
    const disabledPlugins = settings.plugins.disabled;

    useExternalPluginLoader();
    const externalPlugins = useExternalPlugins();

    const system = useSystemMetrics();

    const sshSessions = useSshSessions();
    const [terminalDrawerOpen, setTerminalDrawerOpen] = useState(false);
    const [processDrawerOpen, setProcessDrawerOpen] = useState(false);
    const prevSessionCountRef = useRef(0);

    useEffect(() => {
        const prev = prevSessionCountRef.current;
        if (sshSessions.sessions.length > prev) setTerminalDrawerOpen(true);
        if (sshSessions.sessions.length === 0) setTerminalDrawerOpen(false);
        prevSessionCountRef.current = sshSessions.sessions.length;
    }, [sshSessions.sessions.length]);

    const handleDockerExec = useCallback(
        async (target: { id: string; name: string; image: string }) => {
            try {
                await sshSessions.openExec(target);
                setTerminalDrawerOpen(true);
            } catch (err) {
                showError(err instanceof Error ? err.message : 'Failed to start exec');
            }
        },
        [sshSessions, showError]
    );

    // Exposed to feature panels (Docker) so their "Exec" opens a session in the
    // shared SSH terminal drawer.
    const execValue = useMemo(() => ({ openExec: handleDockerExec }), [handleDockerExec]);

    // Built-in + installed external plugins; only enabled ones get a tab/panel.
    // The badge is passed as a hook (TabNav calls it per-tab) so the dynamic
    // plugin set stays hooks-safe.
    const allPlugins = [...rendererPlugins, ...externalPlugins];
    const enabledPlugins = allPlugins.filter((plugin) => !disabledPlugins.includes(plugin.id));
    const pluginTabs: Record<string, TabItem> = {};
    for (const plugin of enabledPlugins) {
        pluginTabs[plugin.id] = { id: plugin.id, label: plugin.label, icon: plugin.icon, useBadge: plugin.useBadge };
    }

    const legacyTabs: Record<string, TabItem> = {
        ssh: { id: 'ssh', label: 'SSH', icon: Terminal },
        system: { id: 'system', label: 'System', icon: Activity },
        disk: { id: 'disk', label: 'Disk Utils', icon: HardDrive },
        settings: { id: 'settings', label: 'Settings', icon: SettingsIcon }
    };

    // Built-in order, external plugin tabs appended before Settings.
    const externalTabIds = enabledPlugins
        .filter((plugin) => !rendererPlugins.includes(plugin))
        .map((plugin) => plugin.id);
    const tabOrder = ['terminal', 'ssh', 'docker', 'bluetooth', 'system', 'disk', 'media', ...externalTabIds, 'settings'];
    const tabs: TabItem[] = tabOrder.map((id) => pluginTabs[id] ?? legacyTabs[id]).filter(
        (tab): tab is TabItem => Boolean(tab)
    );

    // Derive the active tab so a disabled/uninstalled plugin's tab (now absent)
    // falls back to SSH without a state-syncing effect.
    const activeTab = tabs.some((tab) => tab.id === selectedTab) ? selectedTab : 'ssh';

    const activePlugin = enabledPlugins.find((plugin) => plugin.id === activeTab);

    return (
        <ExecProvider value={execValue}>
        <main className="flex h-screen flex-col overflow-hidden bg-zinc-100 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
            <header className="drag-region z-50 shrink-0 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 pl-16">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-indigo-500">
                            <Terminal className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <div>
                            <h1 className="text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">Control Center</h1>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                {activeTab === 'system' && system.metrics
                                    ? `System updated ${new Date(system.metrics.timestamp).toLocaleTimeString()}`
                                    : 'SSH · Bluetooth · System · Media'}
                            </p>
                        </div>
                    </div>

                    <div className="no-drag flex items-center gap-2">
                        <button
                            type="button"
                            className={`inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition ${
                                processDrawerOpen
                                    ? 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
                                    : 'border-amber-200 bg-white text-amber-700 hover:bg-amber-50 dark:border-amber-900 dark:bg-zinc-900 dark:text-amber-300 dark:hover:bg-amber-950'
                            }`}
                            onClick={() => setProcessDrawerOpen((v) => !v)}
                            title={processDrawerOpen ? 'Hide processes' : 'Show processes'}
                        >
                            {processDrawerOpen ? (
                                <X className="h-4 w-4" aria-hidden="true" />
                            ) : (
                                <Cpu className="h-4 w-4" aria-hidden="true" />
                            )}
                            {processDrawerOpen ? 'Hide' : 'Processes'}
                        </button>
                        {sshSessions.sessions.length > 0 && (
                            <button
                                type="button"
                                className={`inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition ${
                                    terminalDrawerOpen
                                        ? 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
                                        : 'border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:bg-zinc-900 dark:text-emerald-300 dark:hover:bg-emerald-950'
                                }`}
                                onClick={() => setTerminalDrawerOpen((v) => !v)}
                                title={terminalDrawerOpen ? 'Hide terminal' : 'Show terminal'}
                            >
                                {terminalDrawerOpen ? (
                                    <X className="h-4 w-4" aria-hidden="true" />
                                ) : (
                                    <Terminal className="h-4 w-4" aria-hidden="true" />
                                )}
                                {terminalDrawerOpen ? 'Hide' : 'Terminal'}
                                <span
                                    className={`rounded-full px-1.5 py-0.5 text-[10px] text-white ${
                                        terminalDrawerOpen ? 'bg-zinc-500' : 'bg-emerald-600'
                                    }`}
                                >
                                    {sshSessions.sessions.length}
                                </span>
                            </button>
                        )}
                        <ThemeToggle />
                    </div>
                </div>

                <div className="no-drag mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <TabNav items={tabs} activeId={activeTab} onChange={setActiveTab} />
                </div>
            </header>

            <div className="min-h-0 flex-1 overflow-hidden">
                {activeTab === 'terminal' && activePlugin ? (
                    // Full-bleed: the terminal owns the whole viewport below the header.
                    <Suspense
                        fallback={
                            <div className="py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">Loading…</div>
                        }
                    >
                        <activePlugin.Panel />
                    </Suspense>
                ) : (
                    <div className="h-full overflow-y-auto">
                        <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                            {error && (
                                <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
                                    {error}
                                </div>
                            )}

                            {activeTab === 'ssh' && <SshPanel sshSessions={sshSessions} />}

                            {activePlugin && activeTab !== 'terminal' && (
                                <Suspense
                                    fallback={
                                        <div className="py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
                                            Loading…
                                        </div>
                                    }
                                >
                                    <activePlugin.Panel />
                                </Suspense>
                            )}

                            {activeTab === 'system' && (
                                <SystemMonitorPanel
                                    metrics={system.metrics}
                                    loading={system.loading}
                                    onRefresh={system.refresh}
                                />
                            )}

                            {activeTab === 'disk' && <DiskUsagePanel />}

                            {activeTab === 'settings' && <SettingsPanel />}
                        </div>
                    </div>
                )}
            </div>

            <SshTerminalDrawer
                open={terminalDrawerOpen && sshSessions.sessions.length > 0}
                sessions={sshSessions.sessions}
                activeId={sshSessions.activeId}
                onSelect={sshSessions.setActiveId}
                onClose={sshSessions.close}
                onDetach={sshSessions.detach}
                onMinimize={() => setTerminalDrawerOpen(false)}
            />

            <ProcessDrawer open={processDrawerOpen} onMinimize={() => setProcessDrawerOpen(false)} />

            {sshSessions.sessions.length > 0 && !terminalDrawerOpen && (
                <button
                    type="button"
                    onClick={() => setTerminalDrawerOpen(true)}
                    className="fixed bottom-0 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-t-xl border border-b-0 border-emerald-200 bg-white px-4 py-2 shadow-lg transition hover:bg-emerald-50 dark:border-emerald-900 dark:bg-zinc-900 dark:hover:bg-emerald-950"
                    title="Open terminal"
                    aria-label={`Open terminal (${sshSessions.sessions.length} active)`}
                >
                    <ChevronUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    <Terminal className="h-4 w-4 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Terminal</span>
                    <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        {sshSessions.sessions.length}
                    </span>
                </button>
            )}
        </main>
        </ExecProvider>
    );
}
