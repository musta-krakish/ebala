import { useCallback, useMemo, useRef, useState } from 'react';
import { Battery, Bluetooth, CheckCircle2, Loader2, RefreshCw, Search } from 'lucide-react';
import { normalizeAddress } from '../../lib/bluetooth-utils';
import { DeviceRow } from './DeviceRow';
import { SummaryTile } from './SummaryTile';
import { useBluetooth, type DeviceFilter } from './useBluetooth';

const ERROR_VISIBLE_MS = 5000;

export default function BluetoothPanel() {
    const [error, setError] = useState<string | null>(null);
    const errorTimer = useRef<number | undefined>(undefined);
    const showError = useCallback((message: string) => {
        setError(message);
        window.clearTimeout(errorTimer.current);
        errorTimer.current = window.setTimeout(() => setError(null), ERROR_VISIBLE_MS);
    }, []);

    const {
        available,
        connectedDevices,
        availableDevices,
        isScanning,
        busyAddress,
        lastUpdated,
        connect,
        disconnect,
        forget,
        scan
    } = useBluetooth(showError);

    const [filter, setFilter] = useState<DeviceFilter>('all');
    const [query, setQuery] = useState('');

    const allDevices = useMemo(
        () => [...connectedDevices, ...availableDevices],
        [availableDevices, connectedDevices]
    );

    const visibleDevices = useMemo(() => {
        const source =
            filter === 'connected'
                ? connectedDevices
                : filter === 'available'
                  ? availableDevices
                  : allDevices;
        const normalizedQuery = query.trim().toLowerCase();

        if (!normalizedQuery) return source;

        return source.filter((device) =>
            [device.name, device.address, device.type, device.vendorId, device.productId]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(normalizedQuery))
        );
    }, [allDevices, availableDevices, connectedDevices, filter, query]);

    const knownBatteryCount = allDevices.filter(
        (device) => device.batteryLevel !== undefined && device.batteryLevel !== null
    ).length;

    return (
        <>
            {error && (
                <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
                    {error}
                </div>
            )}

            <section className="flex items-center justify-between gap-3">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Bluetooth devices'}
                </p>
                <button
                    type="button"
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                    onClick={scan}
                    disabled={isScanning || !available}
                >
                    {isScanning ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                        <RefreshCw className="h-4 w-4" aria-hidden="true" />
                    )}
                    {isScanning ? 'Scanning' : 'Scan'}
                </button>
            </section>

            <section className="grid gap-3 py-5 sm:grid-cols-3">
                <SummaryTile label="Connected" value={connectedDevices.length} icon={CheckCircle2} tone="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" />
                <SummaryTile label="Available" value={availableDevices.length} icon={Bluetooth} tone="bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300" />
                <SummaryTile label="Battery Known" value={`${knownBatteryCount}/${allDevices.length}`} icon={Battery} tone="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" />
            </section>

            <section className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-1 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    {(['all', 'connected', 'available'] as const).map((item) => (
                        <button
                            key={item}
                            type="button"
                            className={`h-8 rounded-md px-3 text-sm font-medium capitalize transition ${
                                filter === item
                                    ? 'bg-zinc-950 text-white dark:bg-indigo-500'
                                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                            }`}
                            onClick={() => setFilter(item)}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                <label className="relative block w-full md:max-w-xs">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
                    <input
                        className="h-10 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-cyan-950"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search devices"
                    />
                </label>
            </section>

            <section className="flex flex-1 flex-col gap-3 pb-6">
                {visibleDevices.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
                        <div>
                            <Bluetooth className="mx-auto h-8 w-8 text-zinc-400" aria-hidden="true" />
                            <div className="mt-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">No devices found</div>
                            <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Try another filter or run scan.</div>
                        </div>
                    </div>
                ) : (
                    visibleDevices.map((device) => (
                        <DeviceRow
                            key={`${device.address}-${device.name}`}
                            device={device}
                            busy={normalizeAddress(busyAddress ?? '') === normalizeAddress(device.address)}
                            onConnect={connect}
                            onDisconnect={disconnect}
                            onForget={(address) => {
                                if (confirm(`Forget ${device.name}?`)) {
                                    forget(address);
                                }
                            }}
                        />
                    ))
                )}
            </section>
        </>
    );
}
