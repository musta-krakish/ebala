import { useEffect, useState } from 'react';
import {
    Activity,
    ArrowRight,
    Battery,
    Bluetooth,
    Box,
    Cpu,
    HardDrive,
    Loader2,
    MemoryStick,
    Music,
    Network,
    Pause,
    Play,
    RotateCw,
    SkipBack,
    SkipForward,
    Square,
    Terminal
} from 'lucide-react';
import { useBluetooth } from './bluetooth/useBluetooth';
import { useMedia } from './media/useMedia';
import { useSystemMetrics } from './system/useSystemMetrics';
import { useAppSettings } from './useAppSettings';
import { formatBytes, formatPercent, formatRate } from '../lib/format';
import { useVisibility } from '../lib/useVisibility';

const noop = () => {};

function useActiveSessions(refreshMs: number, visible: boolean) {
    const [sessions, setSessions] = useState<SshActiveSession[]>([]);

    useEffect(() => {
        if (typeof window === 'undefined' || !window.sshAPI || !visible) return;
        let cancelled = false;

        const load = async () => {
            try {
                const list = await window.sshAPI.listActive();
                if (!cancelled) setSessions(list);
            } catch {
                if (!cancelled) setSessions([]);
            }
        };

        load();
        const interval = window.setInterval(load, refreshMs);
        return () => {
            cancelled = true;
            window.clearInterval(interval);
        };
    }, [refreshMs, visible]);

    return sessions;
}

function useDockerContainers(refreshMs: number, visible: boolean) {
    const [containers, setContainers] = useState<DockerContainer[]>([]);
    const [available, setAvailable] = useState(true);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (typeof window === 'undefined' || !window.dockerAPI) {
            setAvailable(false);
            return;
        }
        if (!visible) return;
        let cancelled = false;

        const load = async () => {
            try {
                const list = await window.dockerAPI.listContainers();
                if (!cancelled) {
                    setContainers(list);
                    setAvailable(true);
                }
            } catch {
                if (!cancelled) {
                    setContainers([]);
                    setAvailable(false);
                }
            }
        };

        load();
        const interval = window.setInterval(load, refreshMs);
        return () => {
            cancelled = true;
            window.clearInterval(interval);
        };
    }, [refreshMs, reloadKey, visible]);

    return { containers, available, refresh: () => setReloadKey((k) => k + 1) };
}

export function PopupView() {
    const { settings } = useAppSettings();
    const sections = settings.popup;
    const visible = useVisibility();
    const { tracks, control } = useMedia(noop);
    const { connectedDevices } = useBluetooth(noop);
    const { metrics } = useSystemMetrics();
    const activeSessions = useActiveSessions(3000, visible);
    const docker = useDockerContainers(5000, visible);

    useEffect(() => {
        document.body.classList.add('popup-body');
        document.documentElement.classList.add('popup-body');
        return () => {
            document.body.classList.remove('popup-body');
            document.documentElement.classList.remove('popup-body');
        };
    }, []);

    const track = tracks[0];
    const bluetoothWithBattery = connectedDevices
        .filter((d) => typeof d.batteryLevel === 'number')
        .sort((a, b) => (a.batteryLevel ?? 100) - (b.batteryLevel ?? 100));

    const openMain = () => window.appAPI?.showMain();

    return (
        <div className="flex h-screen w-screen flex-col gap-3 overflow-y-auto p-3 text-zinc-900 dark:text-zinc-100">
            {sections.showMedia && <NowPlayingCard track={track} onControl={control} />}
            {sections.showBluetooth && <BluetoothCard devices={bluetoothWithBattery} />}
            {sections.showSystem && <SystemCard metrics={metrics} />}
            {sections.showSsh && <SshSessionsCard sessions={activeSessions} />}
            {sections.showDocker && docker.available && (
                <DockerCard containers={docker.containers} onMutated={docker.refresh} />
            )}

            <button
                type="button"
                onClick={openMain}
                className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
            >
                Details
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
        </div>
    );
}

interface NowPlayingProps {
    track?: MediaTrack;
    onControl: (action: MediaAction, bundleId?: string | null) => void;
}

function NowPlayingCard({ track, onControl }: NowPlayingProps) {
    if (!track || (!track.title && !track.artist)) {
        return (
            <Card icon={<Music className="h-3.5 w-3.5" />} title="Now playing">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Nothing is playing</div>
            </Card>
        );
    }

    const artwork = track.artworkDataUrl || track.artworkUrl;
    return (
        <Card icon={<Music className="h-3.5 w-3.5" />} title={track.app ?? 'Now playing'}>
            <div className="flex items-center gap-2.5">
                {artwork ? (
                    <img
                        src={artwork}
                        alt=""
                        className="h-12 w-12 shrink-0 rounded-md object-cover"
                    />
                ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-zinc-200 text-zinc-400 dark:bg-zinc-800">
                        <Music className="h-5 w-5" aria-hidden="true" />
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-semibold" title={track.title ?? ''}>
                        {track.title ?? 'Unknown'}
                    </div>
                    <div className="truncate text-[11px] text-zinc-500 dark:text-zinc-400" title={track.artist ?? ''}>
                        {track.artist ?? '—'}
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                    <ControlBtn onClick={() => onControl('previous', track.bundleId)}>
                        <SkipBack className="h-3.5 w-3.5" aria-hidden="true" />
                    </ControlBtn>
                    <ControlBtn onClick={() => onControl('play-pause', track.bundleId)}>
                        {track.isPlaying ? (
                            <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                            <Play className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                    </ControlBtn>
                    <ControlBtn onClick={() => onControl('next', track.bundleId)}>
                        <SkipForward className="h-3.5 w-3.5" aria-hidden="true" />
                    </ControlBtn>
                </div>
            </div>
        </Card>
    );
}

function ControlBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-600 transition hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-50"
        >
            {children}
        </button>
    );
}

function BluetoothCard({ devices }: { devices: Device[] }) {
    return (
        <Card icon={<Bluetooth className="h-3.5 w-3.5" />} title={`Bluetooth · ${devices.length}`}>
            {devices.length === 0 ? (
                <div className="text-xs text-zinc-500 dark:text-zinc-400">No devices with battery</div>
            ) : (
                <ul className="space-y-1.5">
                    {devices.slice(0, 4).map((device) => (
                        <li key={device.address} className="flex items-center gap-2 text-xs">
                            <span className="truncate flex-1 font-medium" title={device.name}>
                                {device.name || device.address}
                            </span>
                            <BatteryBadge level={device.batteryLevel ?? null} />
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
}

function BatteryBadge({ level }: { level: number | null }) {
    if (level === null) return <span className="text-[11px] text-zinc-400">—</span>;
    const color =
        level <= 20
            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
            : level <= 50
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${color}`}>
            <Battery className="h-2.5 w-2.5" aria-hidden="true" />
            {level}%
        </span>
    );
}

function SystemCard({ metrics }: { metrics: SystemMetrics | null }) {
    if (!metrics) {
        return (
            <Card icon={<Activity className="h-3.5 w-3.5" />} title="System">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Loading…</div>
            </Card>
        );
    }

    const net = metrics.network.rxBytesPerSecond + metrics.network.txBytesPerSecond;

    return (
        <Card icon={<Activity className="h-3.5 w-3.5" />} title="System">
            <div className="grid grid-cols-2 gap-2">
                <Metric
                    icon={<Cpu className="h-3 w-3" />}
                    label="CPU"
                    value={formatPercent(metrics.cpu.percent)}
                    percent={metrics.cpu.percent}
                />
                <Metric
                    icon={<MemoryStick className="h-3 w-3" />}
                    label="RAM"
                    value={formatPercent(metrics.memory.percent)}
                    percent={metrics.memory.percent}
                    sub={`${formatBytes(metrics.memory.usedBytes)} / ${formatBytes(metrics.memory.totalBytes)}`}
                />
                <Metric
                    icon={<HardDrive className="h-3 w-3" />}
                    label="Disk"
                    value={formatPercent(metrics.disk.percent)}
                    percent={metrics.disk.percent}
                    sub={`${formatBytes(metrics.disk.usedBytes)} used`}
                />
                <Metric
                    icon={<Network className="h-3 w-3" />}
                    label="Network"
                    value={formatRate(net)}
                    sub={`↓${formatRate(metrics.network.rxBytesPerSecond)}`}
                />
            </div>
        </Card>
    );
}

interface MetricProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    percent?: number;
    sub?: string;
}

function Metric({ icon, label, value, percent, sub }: MetricProps) {
    return (
        <div className="rounded-md bg-white/60 px-2 py-1.5 dark:bg-zinc-900/60">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                    {icon}
                    {label}
                </span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">{value}</span>
            </div>
            {typeof percent === 'number' && (
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div
                        className="h-full rounded-full bg-indigo-500 transition-all"
                        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
                    />
                </div>
            )}
            {sub && (
                <div className="mt-0.5 truncate text-[10px] text-zinc-500 dark:text-zinc-400">{sub}</div>
            )}
        </div>
    );
}

function SshSessionsCard({ sessions }: { sessions: SshActiveSession[] }) {
    return (
        <Card icon={<Terminal className="h-3.5 w-3.5" />} title={`SSH · ${sessions.length}`}>
            {sessions.length === 0 ? (
                <div className="text-xs text-zinc-500 dark:text-zinc-400">No active sessions</div>
            ) : (
                <ul className="space-y-1">
                    {sessions.slice(0, 4).map((session) => {
                        const target = session.host.user
                            ? `${session.host.user}@${session.host.hostname}`
                            : session.host.hostname;
                        return (
                            <li key={session.sessionId} className="flex items-center gap-2 text-xs">
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                                <span className="truncate font-medium" title={session.host.alias}>
                                    {session.host.alias}
                                </span>
                                <span className="ml-auto truncate text-[10px] text-zinc-500 dark:text-zinc-400" title={target}>
                                    {target}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </Card>
    );
}

interface DockerCardProps {
    containers: DockerContainer[];
    onMutated: () => void;
}

function DockerCard({ containers, onMutated }: DockerCardProps) {
    const [busyId, setBusyId] = useState<string | null>(null);

    const running = containers.filter((c) => c.state === 'running');
    const others = containers.filter((c) => c.state !== 'running');
    // Show running first, then a few stopped — keeps the popup short.
    const visible = [...running, ...others].slice(0, 5);

    const handleStart = async (id: string) => {
        setBusyId(id);
        try {
            await window.dockerAPI.startContainer(id);
            onMutated();
        } catch {
            // surfaced via main window if needed
        } finally {
            setBusyId(null);
        }
    };

    const handleStop = async (id: string) => {
        setBusyId(id);
        try {
            await window.dockerAPI.stopContainer(id);
            onMutated();
        } catch {
            // ignore
        } finally {
            setBusyId(null);
        }
    };

    const handleRestart = async (id: string) => {
        setBusyId(id);
        try {
            await window.dockerAPI.restartContainer(id);
            onMutated();
        } catch {
            // ignore
        } finally {
            setBusyId(null);
        }
    };

    return (
        <Card
            icon={<Box className="h-3.5 w-3.5" />}
            title={`Docker · ${running.length}/${containers.length}`}
        >
            {visible.length === 0 ? (
                <div className="text-xs text-zinc-500 dark:text-zinc-400">No containers</div>
            ) : (
                <ul className="space-y-1">
                    {visible.map((container) => {
                        const isRunning = container.state === 'running';
                        const busy = busyId === container.id;
                        return (
                            <li key={container.id} className="flex items-center gap-2 text-xs">
                                <span
                                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                                        isRunning ? 'bg-emerald-500' : 'bg-zinc-500'
                                    }`}
                                />
                                <span className="truncate font-medium" title={container.name}>
                                    {container.name}
                                </span>
                                <span
                                    className="ml-auto truncate text-[10px] text-zinc-500 dark:text-zinc-400"
                                    title={container.image}
                                >
                                    {container.image}
                                </span>
                                <div className="flex shrink-0 items-center gap-0.5">
                                    {isRunning ? (
                                        <PopupBtn
                                            title="Stop"
                                            onClick={() => handleStop(container.id)}
                                            busy={busy}
                                        >
                                            <Square className="h-3 w-3" aria-hidden="true" />
                                        </PopupBtn>
                                    ) : (
                                        <PopupBtn
                                            title="Start"
                                            onClick={() => handleStart(container.id)}
                                            busy={busy}
                                        >
                                            <Play className="h-3 w-3" aria-hidden="true" />
                                        </PopupBtn>
                                    )}
                                    {isRunning && (
                                        <PopupBtn
                                            title="Restart"
                                            onClick={() => handleRestart(container.id)}
                                            busy={busy}
                                        >
                                            <RotateCw className="h-3 w-3" aria-hidden="true" />
                                        </PopupBtn>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
            {containers.length > visible.length && (
                <div className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">
                    +{containers.length - visible.length} more in Details
                </div>
            )}
        </Card>
    );
}

function PopupBtn({
    title,
    onClick,
    busy,
    children
}: {
    title: string;
    onClick: () => void;
    busy?: boolean;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            disabled={busy}
            className="flex h-6 w-6 items-center justify-center rounded text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-900 disabled:opacity-40 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-50"
        >
            {busy ? <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" /> : children}
        </button>
    );
}

interface CardProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}

function Card({ icon, title, children }: CardProps) {
    return (
        <div className="rounded-lg border border-zinc-200/60 bg-white/70 p-2.5 shadow-sm backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-900/60">
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {icon}
                <span className="truncate">{title}</span>
            </div>
            {children}
        </div>
    );
}
