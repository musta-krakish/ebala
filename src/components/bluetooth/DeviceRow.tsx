import { Battery, CheckCircle2, CircleSlash, Loader2, Plug, Signal, Trash2, Unplug } from 'lucide-react';
import { formatDeviceMeta, getBatteryTone, getDeviceIcon } from '../../lib/bluetooth-utils';

interface DeviceRowProps {
    device: Device;
    busy: boolean;
    onConnect: (address: string) => void;
    onDisconnect: (address: string) => void;
    onForget: (address: string) => void;
}

export function DeviceRow({ device, busy, onConnect, onDisconnect, onForget }: DeviceRowProps) {
    const Icon = getDeviceIcon(device);
    const batteryKnown = device.batteryLevel !== undefined && device.batteryLevel !== null;

    return (
        <div className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-300 hover:shadow-md md:grid-cols-[1fr_auto] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
            <div className="min-w-0">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                            <h3 className="truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50" title={device.name}>
                                {device.name}
                            </h3>
                            <span
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                                    device.connected
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                        : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
                                }`}
                            >
                                {device.connected ? (
                                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                                ) : (
                                    <CircleSlash className="h-3.5 w-3.5" aria-hidden="true" />
                                )}
                                {device.connected ? 'Connected' : 'Available'}
                            </span>
                        </div>

                        <div className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400" title={device.address}>
                            {device.address}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                            <span className="rounded-md bg-zinc-100 px-2 py-1 dark:bg-zinc-800 dark:text-zinc-300">{formatDeviceMeta(device)}</span>
                            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 ${getBatteryTone(device.batteryLevel)}`}>
                                <Battery className="h-3.5 w-3.5" aria-hidden="true" />
                                {batteryKnown ? `${device.batteryLevel}%` : 'No battery'}
                            </span>
                            {device.rssi !== undefined && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                    <Signal className="h-3.5 w-3.5" aria-hidden="true" />
                                    RSSI {device.rssi}
                                </span>
                            )}
                        </div>

                        {batteryKnown && (
                            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                <div
                                    className="h-full rounded-full bg-emerald-500"
                                    style={{ width: `${Math.min(Math.max(device.batteryLevel ?? 0, 0), 100)}%` }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:justify-end">
                {device.connected ? (
                    <button
                        type="button"
                        className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                        onClick={() => onDisconnect(device.address)}
                        disabled={busy}
                    >
                        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Unplug className="h-4 w-4" aria-hidden="true" />}
                        Disconnect
                    </button>
                ) : (
                    <button
                        type="button"
                        className="inline-flex h-9 items-center gap-2 rounded-md bg-cyan-600 px-3 text-sm font-medium text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => onConnect(device.address)}
                        disabled={busy}
                    >
                        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plug className="h-4 w-4" aria-hidden="true" />}
                        Connect
                    </button>
                )}
                <button
                    type="button"
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-rose-200 bg-white px-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-900 dark:bg-zinc-900 dark:text-rose-300 dark:hover:bg-rose-950"
                    onClick={() => onForget(device.address)}
                    disabled={busy}
                >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Forget
                </button>
            </div>
        </div>
    );
}
