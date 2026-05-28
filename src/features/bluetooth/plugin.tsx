import { lazy, useEffect, useState } from 'react';
import { Bluetooth } from 'lucide-react';
import type { RendererPlugin } from '../../plugin/renderer-types';
import { useVisibility } from '../../lib/useVisibility';

const BADGE_POLL_MS = 10000;

// Cheap, listener-free tab badge: a slow getDevices() poll for the connected
// count. Deliberately avoids the bluetoothAPI event listeners — the panel's
// useBluetooth calls removeAllListeners() on unmount, which would wipe shared
// listeners, so the always-mounted badge polls instead.
function useBluetoothBadge(): number | undefined {
    const [count, setCount] = useState<number | undefined>(undefined);
    const visible = useVisibility();

    useEffect(() => {
        const api = typeof window !== 'undefined' ? window.bluetoothAPI : undefined;
        if (!api || !visible) return;

        let cancelled = false;
        const refresh = async () => {
            try {
                const devices = await api.getDevices();
                if (!cancelled) setCount(devices.connected.length || undefined);
            } catch {
                // ignore — leave last known count
            }
        };

        refresh();
        const interval = window.setInterval(refresh, BADGE_POLL_MS);
        return () => {
            cancelled = true;
            window.clearInterval(interval);
        };
    }, [visible]);

    return count;
}

export const bluetoothPlugin: RendererPlugin = {
    id: 'bluetooth',
    label: 'Bluetooth',
    description: 'Scan, connect and read battery levels of nearby Bluetooth devices.',
    icon: Bluetooth,
    Panel: lazy(() => import('./Panel')),
    useBadge: useBluetoothBadge
};
