import { contextBridge, ipcRenderer } from 'electron';

export interface BluetoothAPI {
    getDevices: () => Promise<any>;
    connectDevice: (address: string) => Promise<any>;
    disconnectDevice: (address: string) => Promise<any>;
    forgetDevice: (address: string) => Promise<any>;
    scanDevices: (duration?: number) => Promise<any>;
    getBatteryLevel: (address: string) => Promise<number | null>;
    onDevicesUpdated: (callback: (devices: any) => void) => void;
    onConnectionChanged: (callback: (data: any) => void) => void;
    onBatteryUpdated: (callback: (data: any) => void) => void;
    onError: (callback: (error: string) => void) => void;
    onScanStarted: (callback: () => void) => void;
    onScanCompleted: (callback: () => void) => void;
    removeAllListeners: () => void;
}

export interface MediaTrack {
    title: string | null;
    artist: string | null;
    album: string | null;
    app: string | null;
    artworkUrl?: string | null;
    artworkDataUrl?: string | null;
    duration?: number | null;
    elapsed?: number | null;
    fetchedAt?: number;
    isPlaying: boolean;
    source: 'media-remote' | 'applescript' | 'none';
}

export interface MediaAPI {
    getNowPlaying: () => Promise<MediaTrack>;
    control: (action: 'play-pause' | 'next' | 'previous') => Promise<{ success: boolean; error?: string }>;
}

export interface SystemMetrics {
    timestamp: number;
    cpu: {
        percent: number;
        cores: number;
        loadAverage: number[];
    };
    memory: {
        totalBytes: number;
        usedBytes: number;
        freeBytes: number;
        percent: number;
    };
    disk: {
        mount: string;
        totalBytes: number;
        usedBytes: number;
        freeBytes: number;
        percent: number;
    };
    network: {
        rxBytes: number;
        txBytes: number;
        rxBytesPerSecond: number;
        txBytesPerSecond: number;
    };
    project: {
        pid: number;
        processCount: number;
        cpuPercent: number;
        memoryPercent: number;
        memoryBytes: number;
        processes: Array<{
            pid: number;
            cpuPercent: number;
            memoryBytes: number;
            name: string;
            role: string;
        }>;
    };
}

export interface SystemAPI {
    getMetrics: () => Promise<SystemMetrics>;
}

contextBridge.exposeInMainWorld('bluetoothAPI', {
    getDevices: () => ipcRenderer.invoke('bluetooth:get-devices'),
    connectDevice: (address: string) => ipcRenderer.invoke('bluetooth:connect-device', address),
    disconnectDevice: (address: string) => ipcRenderer.invoke('bluetooth:disconnect-device', address),
    forgetDevice: (address: string) => ipcRenderer.invoke('bluetooth:forget-device', address),
    scanDevices: (duration?: number) => ipcRenderer.invoke('bluetooth:scan-devices', duration),
    getBatteryLevel: (address: string) => ipcRenderer.invoke('bluetooth:get-battery', address),

    onDevicesUpdated: (callback: (devices: any) => void) => {
        ipcRenderer.on('bluetooth:devices-updated', (_, devices) => callback(devices));
    },
    onConnectionChanged: (callback: (data: any) => void) => {
        ipcRenderer.on('bluetooth:connection-changed', (_, data) => callback(data));
    },
    onBatteryUpdated: (callback: (data: any) => void) => {
        ipcRenderer.on('bluetooth:battery-updated', (_, data) => callback(data));
    },
    onError: (callback: (error: string) => void) => {
        ipcRenderer.on('bluetooth:error', (_, error) => callback(error));
    },
    onScanStarted: (callback: () => void) => {
        ipcRenderer.on('bluetooth:scan-started', () => callback());
    },
    onScanCompleted: (callback: () => void) => {
        ipcRenderer.on('bluetooth:scan-completed', () => callback());
    },
    removeAllListeners: () => {
        ipcRenderer.removeAllListeners('bluetooth:devices-updated');
        ipcRenderer.removeAllListeners('bluetooth:connection-changed');
        ipcRenderer.removeAllListeners('bluetooth:battery-updated');
        ipcRenderer.removeAllListeners('bluetooth:error');
        ipcRenderer.removeAllListeners('bluetooth:scan-started');
        ipcRenderer.removeAllListeners('bluetooth:scan-completed');
    }
} as BluetoothAPI);

contextBridge.exposeInMainWorld('mediaAPI', {
    getNowPlaying: () => ipcRenderer.invoke('media:get-now-playing'),
    control: (action: 'play-pause' | 'next' | 'previous') => ipcRenderer.invoke('media:control', action)
} as MediaAPI);

contextBridge.exposeInMainWorld('systemAPI', {
    getMetrics: () => ipcRenderer.invoke('system:get-metrics')
} as SystemAPI);
