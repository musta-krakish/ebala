import { useCallback, useEffect, useRef, useState } from 'react';
import { Activity, Bluetooth, ChevronUp, Container, Loader2, Music2, RefreshCw, Terminal, X } from 'lucide-react';
import { BluetoothPanel } from './bluetooth/BluetoothPanel';
import { useBluetooth } from './bluetooth/useBluetooth';
import { DockerPanel } from './docker/DockerPanel';
import { MediaPanel } from './media/MediaPanel';
import { useMedia } from './media/useMedia';
import { SshPanel } from './ssh/SshPanel';
import { SshTerminalDrawer } from './ssh/SshTerminalDrawer';
import { useSshSessions } from './ssh/useSshSessions';
import { SystemMonitorPanel } from './system/SystemMonitorPanel';
import { useSystemMetrics } from './system/useSystemMetrics';
import { TabNav, type TabItem } from './tabs/TabNav';
import { ThemeToggle } from './theme/ThemeToggle';

type TabId = 'ssh' | 'docker' | 'bluetooth' | 'system' | 'media';

const ERROR_VISIBLE_MS = 5000;

export function ControlCenter() {
    const [activeTab, setActiveTab] = useState<TabId>('ssh');
    const [error, setError] = useState<string | null>(null);

    const showError = useCallback((message: string) => {
        setError(message);
        window.setTimeout(() => setError(null), ERROR_VISIBLE_MS);
    }, []);

    const bluetooth = useBluetooth(showError);
    const media = useMedia(showError);
    const system = useSystemMetrics();

    const sshSessions = useSshSessions();
    const [terminalDrawerOpen, setTerminalDrawerOpen] = useState(false);
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

    const tabs: TabItem[] = [
        { id: 'ssh', label: 'SSH', icon: Terminal },
        { id: 'docker', label: 'Docker', icon: Container },
        { id: 'bluetooth', label: 'Bluetooth', icon: Bluetooth, badge: bluetooth.connectedDevices.length || undefined },
        { id: 'system', label: 'System', icon: Activity },
        { id: 'media', label: 'Media', icon: Music2 }
    ];

    return (
        <main className="min-h-screen bg-zinc-100 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
            <header className="drag-region sticky top-0 z-50 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 pl-16">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-indigo-500">
                            <Terminal className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <div>
                            <h1 className="text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">Control Center</h1>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                {activeTab === 'bluetooth' && bluetooth.lastUpdated
                                    ? `Bluetooth updated ${bluetooth.lastUpdated.toLocaleTimeString()}`
                                    : activeTab === 'system' && system.metrics
                                    ? `System updated ${new Date(system.metrics.timestamp).toLocaleTimeString()}`
                                    : 'SSH · Bluetooth · System · Media'}
                            </p>
                        </div>
                    </div>

                    <div className="no-drag flex items-center gap-2">
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
                        {activeTab === 'bluetooth' && (
                            <button
                                type="button"
                                className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                                onClick={bluetooth.scan}
                                disabled={bluetooth.isScanning || !bluetooth.available}
                            >
                                {bluetooth.isScanning ? (
                                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                                ) : (
                                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                                )}
                                {bluetooth.isScanning ? 'Scanning' : 'Scan'}
                            </button>
                        )}
                        <ThemeToggle />
                    </div>
                </div>

                <div className="no-drag mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <TabNav items={tabs} activeId={activeTab} onChange={(id) => setActiveTab(id as TabId)} />
                </div>
            </header>

            <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                {error && (
                    <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
                        {error}
                    </div>
                )}

                {activeTab === 'ssh' && <SshPanel sshSessions={sshSessions} />}

                {activeTab === 'docker' && <DockerPanel onExec={handleDockerExec} />}

                {activeTab === 'bluetooth' && (
                    <BluetoothPanel
                        connectedDevices={bluetooth.connectedDevices}
                        availableDevices={bluetooth.availableDevices}
                        busyAddress={bluetooth.busyAddress}
                        onConnect={bluetooth.connect}
                        onDisconnect={bluetooth.disconnect}
                        onForget={bluetooth.forget}
                    />
                )}

                {activeTab === 'system' && (
                    <SystemMonitorPanel
                        metrics={system.metrics}
                        loading={system.loading}
                        onRefresh={system.refresh}
                    />
                )}

                {activeTab === 'media' && (
                    <MediaPanel
                        tracks={media.tracks}
                        loading={media.loading}
                        onRefresh={media.refresh}
                        onControl={media.control}
                    />
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
    );
}
