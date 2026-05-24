import { useEffect, useState } from 'react';
import { normalizeAddress } from '../../lib/bluetooth-utils';

export type DeviceFilter = 'all' | 'connected' | 'available';

type BluetoothAction = (address: string) => Promise<BluetoothActionResult>;

export function useBluetooth(onError: (message: string) => void) {
    const [connectedDevices, setConnectedDevices] = useState<Device[]>([]);
    const [availableDevices, setAvailableDevices] = useState<Device[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [busyAddress, setBusyAddress] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const available = typeof window !== 'undefined' && Boolean(window.bluetoothAPI);

    const applyDevices = (devices: DeviceList) => {
        setConnectedDevices(devices.connected);
        setAvailableDevices(devices.notConnected);
        setLastUpdated(new Date());
    };

    const loadDevices = async () => {
        if (!available) {
            onError('Bluetooth API is not available');
            return;
        }

        try {
            applyDevices(await window.bluetoothAPI.getDevices());
        } catch {
            onError('Failed to load devices');
        }
    };

    useEffect(() => {
        if (!available) return;

        window.bluetoothAPI.onDevicesUpdated(applyDevices);
        window.bluetoothAPI.onConnectionChanged(() => loadDevices());
        window.bluetoothAPI.onBatteryUpdated((data) => {
            const address = normalizeAddress(data.address);
            setConnectedDevices((prev) =>
                prev.map((device) =>
                    normalizeAddress(device.address) === address
                        ? { ...device, batteryLevel: data.batteryLevel }
                        : device
                )
            );
        });
        window.bluetoothAPI.onError(onError);
        window.bluetoothAPI.onScanStarted(() => setIsScanning(true));
        window.bluetoothAPI.onScanCompleted(() => setIsScanning(false));

        loadDevices();

        return () => {
            window.bluetoothAPI.removeAllListeners();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [available]);

    const runAction = async (address: string, action: BluetoothAction, fallback: string) => {
        setBusyAddress(address);
        try {
            const result = await action(address);
            if (result.success) {
                await loadDevices();
            } else {
                onError(result.error ? `${fallback}: ${result.error}` : fallback);
            }
        } catch {
            onError(fallback);
        } finally {
            setBusyAddress(null);
        }
    };

    const connect = (address: string) =>
        runAction(address, window.bluetoothAPI.connectDevice, 'Failed to connect');
    const disconnect = (address: string) =>
        runAction(address, window.bluetoothAPI.disconnectDevice, 'Failed to disconnect');
    const forget = (address: string) =>
        runAction(address, window.bluetoothAPI.forgetDevice, 'Failed to forget device');

    const scan = async () => {
        if (!available) {
            onError('Bluetooth API is not available');
            return;
        }

        try {
            await window.bluetoothAPI.scanDevices(5);
            await loadDevices();
        } catch {
            onError('Scan failed');
        }
    };

    return {
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
    };
}
