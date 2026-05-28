// Ambient (no import/export) so these stay global, and the `interface Window`
// block merges with the central one in vite-env.d.ts.

interface Device {
    name: string;
    address: string;
    batteryLevel?: number | null;
    type?: string;
    vendorId?: string;
    productId?: string;
    firmwareVersion?: string;
    connected: boolean;
    rssi?: number;
}

interface DeviceList {
    connected: Device[];
    notConnected: Device[];
}

interface BluetoothActionResult {
    success: boolean;
    error?: string;
}

interface BluetoothBatteryUpdate {
    address: string;
    batteryLevel: number | null;
}

interface BluetoothAPI {
    getDevices: () => Promise<DeviceList>;
    connectDevice: (address: string) => Promise<BluetoothActionResult>;
    disconnectDevice: (address: string) => Promise<BluetoothActionResult>;
    forgetDevice: (address: string) => Promise<BluetoothActionResult>;
    scanDevices: (duration?: number) => Promise<BluetoothActionResult>;
    getBatteryLevel: (address: string) => Promise<number | null>;
    onDevicesUpdated: (callback: (devices: DeviceList) => void) => void;
    onConnectionChanged: (callback: (data: unknown) => void) => void;
    onBatteryUpdated: (callback: (data: BluetoothBatteryUpdate) => void) => void;
    onError: (callback: (error: string) => void) => void;
    onScanStarted: (callback: () => void) => void;
    onScanCompleted: (callback: () => void) => void;
    removeAllListeners: () => void;
}

interface Window {
    bluetoothAPI: BluetoothAPI;
}
