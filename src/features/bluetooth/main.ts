import { BluetoothManager } from './bluetooth-manager.ts';
import type { MainPlugin, MainPluginContext } from '../../plugin/main-types.ts';

export function createBluetoothPlugin(): MainPlugin {
    let manager: BluetoothManager | null = null;
    let ctx: MainPluginContext;

    // The manager is created lazily in start() after app-ready, but the
    // renderer can call these IPCs before that finishes — wait up to 5s, then
    // treat Bluetooth as unavailable.
    async function whenReady(): Promise<BluetoothManager | null> {
        if (manager) return manager;
        for (let i = 0; i < 50; i += 1) {
            if (manager) return manager;
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
        return null;
    }

    return {
        id: 'bluetooth',

        setup(context) {
            ctx = context;
            const { ipcMain } = ctx;

            ipcMain.handle('bluetooth:get-devices', async () => {
                const mgr = await whenReady();
                if (!mgr) return { connected: [], notConnected: [], timestamp: Date.now() };
                return await mgr.getDevices();
            });

            ipcMain.handle('bluetooth:connect-device', async (_event, address) => {
                const mgr = await whenReady();
                if (!mgr) return { success: false, error: 'Bluetooth not ready' };
                return await mgr.connectDevice(address);
            });

            ipcMain.handle('bluetooth:disconnect-device', async (_event, address) => {
                const mgr = await whenReady();
                if (!mgr) return { success: false, error: 'Bluetooth not ready' };
                return await mgr.disconnectDevice(address);
            });

            ipcMain.handle('bluetooth:forget-device', async (_event, address) => {
                const mgr = await whenReady();
                if (!mgr) return { success: false, error: 'Bluetooth not ready' };
                return await mgr.forgetDevice(address);
            });

            ipcMain.handle('bluetooth:scan-devices', async (_event, duration = 5) => {
                const mgr = await whenReady();
                if (!mgr) return { success: false, error: 'Bluetooth not ready' };
                return await mgr.scanForDevices(duration);
            });

            ipcMain.handle('bluetooth:get-battery', async (_event, address) => {
                const mgr = await whenReady();
                if (!mgr) return null;
                return await mgr.getBatteryLevel(address);
            });
        },

        async start() {
            manager = new BluetoothManager();
            manager.on('devices-updated', (devices) => ctx.broadcast('bluetooth:devices-updated', devices));
            manager.on('connection-changed', (data) => ctx.broadcast('bluetooth:connection-changed', data));
            manager.on('battery-updated', (data) => ctx.broadcast('bluetooth:battery-updated', data));
            manager.on('error', (error) => ctx.broadcast('bluetooth:error', error));
            manager.on('scan-started', () => ctx.broadcast('bluetooth:scan-started'));
            manager.on('scan-completed', () => ctx.broadcast('bluetooth:scan-completed'));
            await manager.startMonitoring();
        },

        dispose() {
            manager?.stopMonitoring();
        }
    };
}
