import { exec, execFile } from 'child_process';
import { existsSync, mkdirSync, statSync } from 'fs';
import path from 'path';
import { promisify } from 'util';
import { EventEmitter } from 'events';
import * as plist from 'plist';
import { helperCacheDir, helperSourceDir } from './paths.ts';

const execPromise = promisify(exec);
const execFilePromise = promisify(execFile);
const bluetoothDebugEnabled = process.env.BLUETOOTH_DEBUG === '1';

async function getSwiftHelper(scriptName: string): Promise<string> {
    const cacheDir = helperCacheDir();
    const sourcePath = path.join(helperSourceDir(), scriptName);
    const outputPath = path.join(cacheDir, scriptName.replace(/\.swift$/, ''));
    const needsBuild =
        !existsSync(outputPath) ||
        statSync(outputPath).mtimeMs < statSync(sourcePath).mtimeMs;

    if (needsBuild) {
        mkdirSync(cacheDir, { recursive: true });
        await execFilePromise('xcrun', ['swiftc', sourcePath, '-o', outputPath], { timeout: 30000 });
    }

    return outputPath;
}

interface IOBluetoothBatteryEntry {
    address: string;
    connected: boolean;
    isMulti: boolean;
    single?: number;
    combined?: number;
    left?: number;
    right?: number;
    case?: number;
}

interface BleBatteryEntry {
    name: string;
    uuid: string;
    batteryLevel?: number;
}

function batteryFromIOBluetoothEntry(entry: IOBluetoothBatteryEntry): number | null {
    if (typeof entry.single === 'number' && entry.single > 0) return entry.single;
    if (typeof entry.combined === 'number' && entry.combined > 0) return entry.combined;

    const channels = [entry.left, entry.right, entry.case].filter(
        (v): v is number => typeof v === 'number' && v > 0
    );
    if (channels.length === 0) return null;
    // Multi-battery devices: be conservative — surface the weakest channel
    // (matches what the macOS Bluetooth menubar shows for AirPods).
    return Math.min(...channels);
}

function logBluetoothDebug(label: string, payload?: unknown): void {
    if (!bluetoothDebugEnabled) {
        return;
    }

    console.log(`[bluetooth] ${label}`);

    if (payload !== undefined) {
        console.dir(payload, { depth: null, colors: true });
    }
}

export interface BluetoothDevice {
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

export interface BluetoothState {
    connected: BluetoothDevice[];
    notConnected: BluetoothDevice[];
    timestamp: number;
}

function normalizeAddress(address: string): string {
    return address.replace(/[^a-fA-F0-9]/g, '').toLowerCase();
}

function parseBatteryLevel(value: unknown): number | null {
    if (typeof value === 'number') {
        return value;
    }

    if (typeof value !== 'string') {
        return null;
    }

    const match = value.match(/(\d+)/);
    return match ? Number.parseInt(match[1], 10) : null;
}

const BLE_REFRESH_INTERVAL_MS = 30_000;

export class BluetoothManager extends EventEmitter {
    private devices: Map<string, BluetoothDevice> = new Map();
    private monitoringInterval: NodeJS.Timeout | null = null;
    private isMonitoring: boolean = false;
    private bleBatteryByName: Map<string, number> = new Map();
    private lastBleRefreshAt = 0;

    constructor() {
        super();
    }

    private async runBlueutil(args: string[], options?: Parameters<typeof execFilePromise>[2]) {
        const command = `blueutil ${args.join(' ')}`;
        logBluetoothDebug(`command: ${command}`);

        try {
            const result = await execFilePromise('blueutil', args, options);
            const stdout = result.stdout.toString();
            const stderr = result.stderr.toString();

            logBluetoothDebug(`stdout: ${command}`, stdout);

            if (stderr) {
                logBluetoothDebug(`stderr: ${command}`, stderr);
            }

            return { stdout, stderr };
        } catch (error: any) {
            logBluetoothDebug(`error: ${command}`, {
                message: error.message,
                stdout: error.stdout?.toString(),
                stderr: error.stderr?.toString(),
                code: error.code
            });
            throw error;
        }
    }

    private toBluetoothDevice(device: any, connectedOverride?: boolean): BluetoothDevice {
        return {
            name: device.name || 'Unknown',
            address: device.address || '',
            connected: connectedOverride ?? Boolean(device.connected),
            batteryLevel: parseBatteryLevel(
                device.batteryLevel ??
                device.battery ??
                device.batteryPercent ??
                device.device_batteryLevel ??
                device.device_batteryLevelMain
            ),
            type: device.type,
            vendorId: device.vendorId,
            productId: device.productId,
            firmwareVersion: device.firmwareVersion,
            rssi: device.RSSI ?? device.rawRSSI
        };
    }

    private mergeDevices(devices: BluetoothDevice[]): void {
        logBluetoothDebug('mergeDevices input', devices);

        for (const device of devices) {
            if (!device.address) {
                continue;
            }

            const normalizedAddress = normalizeAddress(device.address);
            const existingEntry = Array.from(this.devices.entries())
                .find(([address]) => normalizeAddress(address) === normalizedAddress);
            const existingAddress = existingEntry?.[0] ?? device.address;
            const existing = existingEntry?.[1];

            this.devices.set(existingAddress, {
                ...existing,
                ...device
            });
        }
    }

    private getCurrentState(): BluetoothState {
        const devices = Array.from(this.devices.values());

        const state = {
            connected: devices.filter((device) => device.connected),
            notConnected: devices.filter((device) => !device.connected),
            timestamp: Date.now()
        };

        logBluetoothDebug('current state', state);
        return state;
    }

    private parsePlistData(plistData: any): BluetoothDevice[] {
        const devices: BluetoothDevice[] = [];

        try {
            if (plistData && plistData['_items']) {
                for (const item of plistData['_items']) {
                    if (item['device_connected'] !== undefined) {
                        devices.push({
                            name: item['device_name'] || 'Unknown',
                            address: item['device_address'] || '',
                            connected: item['device_connected'] || false,
                            batteryLevel: item['device_batteryLevel'],
                            type: item['device_minorType'],
                            vendorId: item['device_vendorID'],
                            productId: item['device_productID'],
                            firmwareVersion: item['device_firmwareVersion']
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error parsing plist data:', error);
        }

        return devices;
    }

    private parseTextOutput(output: string): BluetoothDevice[] {
        const devices: BluetoothDevice[] = [];
        const lines = output.split('\n');
        let currentDevice: Partial<BluetoothDevice> | null = null;
        let inConnected = false;

        for (const line of lines) {
            const trimmed = line.trim();

            if (trimmed === 'Connected:') {
                inConnected = true;
                continue;
            } else if (trimmed === 'Not Connected:') {
                inConnected = false;
                continue;
            }

            if (trimmed && !trimmed.startsWith('Bluetooth:') &&
                !trimmed.startsWith('Address:') && !trimmed.startsWith('Vendor ID:') &&
                !trimmed.startsWith('Product ID:') && !trimmed.startsWith('Firmware Version:') &&
                !trimmed.startsWith('Minor Type:') && !trimmed.startsWith('Battery Level:')) {

                if (currentDevice?.name) {
                    devices.push({
                        name: currentDevice.name,
                        address: currentDevice.address || '',
                        batteryLevel: currentDevice.batteryLevel,
                        type: currentDevice.type,
                        vendorId: currentDevice.vendorId,
                        productId: currentDevice.productId,
                        firmwareVersion: currentDevice.firmwareVersion,
                        connected: currentDevice.connected || false
                    });
                }

                currentDevice = {
                    name: trimmed.replace(':', ''),
                    connected: inConnected,
                    address: undefined,
                    batteryLevel: null,
                    type: undefined
                };
            }

            if (currentDevice) {
                if (trimmed.startsWith('Address:')) {
                    currentDevice.address = trimmed.replace('Address:', '').trim();
                } else if (trimmed.startsWith('Battery Level:')) {
                    const match = trimmed.match(/(\d+)\s*%/);
                    if (match) currentDevice.batteryLevel = parseInt(match[1]);
                } else if (trimmed.startsWith('Minor Type:')) {
                    currentDevice.type = trimmed.replace('Minor Type:', '').trim();
                } else if (trimmed.startsWith('Vendor ID:')) {
                    currentDevice.vendorId = trimmed.replace('Vendor ID:', '').trim();
                } else if (trimmed.startsWith('Product ID:')) {
                    currentDevice.productId = trimmed.replace('Product ID:', '').trim();
                } else if (trimmed.startsWith('Firmware Version:')) {
                    currentDevice.firmwareVersion = trimmed.replace('Firmware Version:', '').trim();
                }
            }
        }

        if (currentDevice?.name) {
            devices.push({
                name: currentDevice.name,
                address: currentDevice.address || '',
                batteryLevel: currentDevice.batteryLevel,
                type: currentDevice.type,
                vendorId: currentDevice.vendorId,
                productId: currentDevice.productId,
                firmwareVersion: currentDevice.firmwareVersion,
                connected: currentDevice.connected || false
            });
        }

        return devices;
    }

    private parseSystemProfilerJson(output: string): BluetoothDevice[] {
        const parsed = JSON.parse(output);
        const controllers = parsed.SPBluetoothDataType;
        const devices: BluetoothDevice[] = [];

        if (!Array.isArray(controllers)) {
            return devices;
        }

        for (const controller of controllers) {
            const groups = [
                { items: controller.device_connected, connected: true },
                { items: controller.device_not_connected, connected: false }
            ];

            for (const group of groups) {
                if (!Array.isArray(group.items)) {
                    continue;
                }

                for (const item of group.items) {
                    for (const [name, details] of Object.entries(item as Record<string, any>)) {
                        devices.push(this.toBluetoothDevice({
                            name,
                            address: details.device_address,
                            connected: group.connected,
                            batteryLevel: details.device_batteryLevelMain ?? details.device_batteryLevel,
                            type: details.device_minorType,
                            vendorId: details.device_vendorID,
                            productId: details.device_productID,
                            firmwareVersion: details.device_firmwareVersion
                        }));
                    }
                }
            }
        }

        logBluetoothDebug('parsed system_profiler json devices', devices);
        return devices;
    }

    private async mergeSystemProfilerDetails(): Promise<void> {
        try {
            logBluetoothDebug('command: system_profiler SPBluetoothDataType -json');
            const { stdout } = await execPromise('system_profiler SPBluetoothDataType -json');
            logBluetoothDebug('stdout: system_profiler SPBluetoothDataType -json', stdout);
            this.mergeDevices(this.parseSystemProfilerJson(stdout));
        } catch (error) {
            logBluetoothDebug('error: system_profiler SPBluetoothDataType -json', error);
        }
    }

    private async refreshBleBatteryCache(): Promise<void> {
        const now = Date.now();
        if (now - this.lastBleRefreshAt < BLE_REFRESH_INTERVAL_MS && this.bleBatteryByName.size > 0) {
            return;
        }
        this.lastBleRefreshAt = now;

        try {
            const helper = await getSwiftHelper('bluetooth-ble-battery.swift');
            const { stdout } = await execFilePromise(helper, [], { timeout: 8000 });
            const entries = JSON.parse(stdout.toString()) as BleBatteryEntry[];
            logBluetoothDebug('BLE battery entries', entries);

            for (const entry of entries) {
                if (
                    typeof entry.batteryLevel === 'number' &&
                    entry.batteryLevel > 0 &&
                    entry.name
                ) {
                    this.bleBatteryByName.set(entry.name.toLowerCase(), entry.batteryLevel);
                }
            }
        } catch (error) {
            logBluetoothDebug('error: bluetooth-ble-battery helper', error);
        }
    }

    private async mergeBleBattery(): Promise<void> {
        await this.refreshBleBatteryCache();
        if (this.bleBatteryByName.size === 0) return;

        for (const [storedAddress, device] of this.devices.entries()) {
            if (device.batteryLevel !== undefined && device.batteryLevel !== null) continue;
            if (!device.name) continue;

            const level = this.bleBatteryByName.get(device.name.toLowerCase());
            if (level === undefined) continue;

            this.devices.set(storedAddress, { ...device, batteryLevel: level });
        }
    }

    private async mergeIOBluetoothBattery(): Promise<void> {
        try {
            const helper = await getSwiftHelper('bluetooth-battery.swift');
            const { stdout } = await execFilePromise(helper, [], { timeout: 5000 });
            const entries = JSON.parse(stdout.toString()) as IOBluetoothBatteryEntry[];
            logBluetoothDebug('IOBluetooth battery entries', entries);

            const byAddress = new Map<string, number>();
            for (const entry of entries) {
                const level = batteryFromIOBluetoothEntry(entry);
                if (level !== null) {
                    byAddress.set(normalizeAddress(entry.address), level);
                }
            }
            if (byAddress.size === 0) return;

            for (const [storedAddress, device] of this.devices.entries()) {
                const level = byAddress.get(normalizeAddress(storedAddress));
                if (level === undefined) continue;
                // Don't overwrite a higher-fidelity reading we already have.
                if (device.batteryLevel === undefined || device.batteryLevel === null) {
                    this.devices.set(storedAddress, { ...device, batteryLevel: level });
                }
            }
        } catch (error) {
            logBluetoothDebug('error: bluetooth-battery helper', error);
        }
    }

    async getDevices(): Promise<BluetoothState> {
        try {
            const { stdout } = await this.runBlueutil(['--paired', '--format', 'json']);
            const parsed = JSON.parse(stdout);
            logBluetoothDebug('parsed blueutil --paired', parsed);

            const devices = Array.isArray(parsed)
                ? parsed.map((device) => this.toBluetoothDevice(device))
                : [];

            this.mergeDevices(devices);
            await this.mergeSystemProfilerDetails();
            await this.mergeIOBluetoothBattery();
            await this.mergeBleBattery();
            return this.getCurrentState();
        } catch (blueutilError) {
            console.error('Error getting devices with blueutil:', blueutilError);

            try {
                let stdout: string;
                try {
                    logBluetoothDebug('command: system_profiler SPBluetoothDataType -xml');
                    const result = await execPromise('system_profiler SPBluetoothDataType -xml');
                    stdout = result.stdout;
                    logBluetoothDebug('stdout: system_profiler SPBluetoothDataType -xml', stdout);
                } catch {
                    logBluetoothDebug('command: system_profiler SPBluetoothDataType');
                    const result = await execPromise('system_profiler SPBluetoothDataType');
                    stdout = result.stdout;
                    logBluetoothDebug('stdout: system_profiler SPBluetoothDataType', stdout);
                }

                let devices: BluetoothDevice[];

                if (stdout.trim().startsWith('<?xml')) {
                    const parsed = plist.parse(stdout) as any;
                    logBluetoothDebug('parsed system_profiler plist', parsed);
                    devices = this.parsePlistData(parsed);
                } else {
                    devices = this.parseTextOutput(stdout);
                }

                this.mergeDevices(devices);
                return this.getCurrentState();
            } catch (error) {
                console.error('Error getting devices:', error);
                this.emit('error', `Failed to get devices: ${error}`);
                return { connected: [], notConnected: [], timestamp: Date.now() };
            }
        }
    }

    async connectDevice(address: string): Promise<{ success: boolean; error?: string }> {
        try {
            await this.runBlueutil(['--connect', address]);
            this.emit('connection-changed', { address, connected: true });
            return { success: true };
        } catch (error: any) {
            console.error('Error connecting device:', error);
            this.emit('error', `Failed to connect device: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    async disconnectDevice(address: string): Promise<{ success: boolean; error?: string }> {
        try {
            await this.runBlueutil(['--disconnect', address]);
            this.emit('connection-changed', { address, connected: false });
            return { success: true };
        } catch (error: any) {
            console.error('Error disconnecting device:', error);
            this.emit('error', `Failed to disconnect device: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    async forgetDevice(address: string): Promise<{ success: boolean; error?: string }> {
        try {
            await this.runBlueutil(['--unpair', address]);
            this.devices.delete(address);
            await this.getDevices();
            return { success: true };
        } catch (error: any) {
            console.error('Error forgetting device:', error);
            this.emit('error', `Failed to forget device: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    async scanForDevices(duration: number = 5): Promise<{ success: boolean; error?: string }> {
        try {
            this.emit('scan-started');
            const { stdout } = await this.runBlueutil([
                '--inquiry',
                String(duration),
                '--format',
                'json'
            ], {
                timeout: (duration + 5) * 1000
            });
            const parsed = JSON.parse(stdout);
            logBluetoothDebug('parsed blueutil --inquiry', parsed);

            const devices = Array.isArray(parsed)
                ? parsed.map((device) => this.toBluetoothDevice(device, false))
                : [];

            this.mergeDevices(devices);
            await this.getDevices();
            this.emit('devices-updated', this.getCurrentState());
            return { success: true };
        } catch (error: any) {
            console.error('Error scanning devices:', error);
            this.emit('error', `Failed to scan: ${error.message}`);
            return { success: false, error: error.message };
        } finally {
            this.emit('scan-completed');
        }
    }

    async getBatteryLevel(address: string): Promise<number | null> {
        try {
            const { stdout } = await this.runBlueutil(['--info', address, '--format', 'json']);
            const device = JSON.parse(stdout);
            logBluetoothDebug('parsed blueutil --info', device);

            const rawBatteryLevel = device.batteryLevel ?? device.battery ?? device.batteryPercent;
            if (typeof rawBatteryLevel === 'number') {
                this.emit('battery-updated', { address, batteryLevel: rawBatteryLevel });
                return rawBatteryLevel;
            }

            const match = stdout.match(/(\d+)%/);
            if (match) {
                const batteryLevel = parseInt(match[1]);
                this.emit('battery-updated', { address, batteryLevel });
                return batteryLevel;
            }
            return null;
        } catch (error) {
            console.error('Error getting battery level:', error);
            return null;
        }
    }

    async startMonitoring(intervalMs: number = 5000): Promise<void> {
        if (this.isMonitoring) return;

        this.isMonitoring = true;

        // Первичное получение данных
        await this.getDevices();

        this.monitoringInterval = setInterval(async () => {
            const devices = await this.getDevices();
            this.emit('devices-updated', devices);
        }, intervalMs);
    }

    stopMonitoring(): void {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
        this.isMonitoring = false;
    }
}
