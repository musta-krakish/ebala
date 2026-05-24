import { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage, screen } from 'electron';
import { appendFileSync } from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

// When .app is launched by macOS Launch Services (Dock, Finder, Spotlight)
// PATH is just /usr/bin:/bin:/usr/sbin:/sbin — so `docker`, `blueutil`,
// `swift`, `xcrun` from /opt/homebrew/bin or ~/.docker/bin aren't found.
// Prepend the usual locations once at startup so every spawn() that
// inherits env can resolve them.
const EXTRA_PATHS = [
    '/opt/homebrew/bin',
    '/opt/homebrew/sbin',
    '/usr/local/bin',
    '/usr/local/sbin',
    path.join(os.homedir(), '.docker/bin'),
    '/Applications/Docker.app/Contents/Resources/bin'
];
process.env.PATH = [...EXTRA_PATHS, process.env.PATH ?? ''].filter(Boolean).join(':');
import { BluetoothManager } from './src/electron/bluetooth-manager.ts';
import { MediaManager } from './src/electron/media-manager.ts';
import { SystemMonitor } from './src/electron/system-monitor.ts';
import { listAllSshHosts } from './src/electron/ssh-hosts.ts';
import { SshManager } from './src/electron/ssh-manager.ts';
import { initDb, closeDb } from './src/electron/db.ts';
import {
    createSavedHost,
    deleteSavedHost,
    listSavedHosts,
    updateSavedHost
} from './src/electron/saved-hosts.ts';
import { isCredentialEncryptionAvailable } from './src/electron/credential-store.ts';
import { MediaTracker } from './src/electron/media-tracker.ts';
import {
    clearAllStats,
    clearHistory,
    getStats,
    listArtistGroups,
    listHistory,
    purgeOldHistory
} from './src/electron/media-history.ts';
import { deleteOverride, upsertOverride } from './src/electron/host-overrides.ts';
import { removeFromKnownHosts } from './src/electron/ssh-file-ops.ts';
import {
    createPortForward,
    deletePortForward,
    listPortForwards,
    updatePortForward
} from './src/electron/port-forwards.ts';
import { DockerManager } from './src/electron/docker-manager.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const devServerUrl = process.env.VITE_DEV_SERVER_URL;
const isDev = Boolean(devServerUrl);

// In dev `main.js` runs at the project root, so preload and the renderer
// build live under `src/electron/` and `dist/`. After bundling for
// production this file becomes `dist-electron/main.cjs`, so paths shift up
// one level — keep these constants in one place.
const preloadPath = app.isPackaged
    ? path.join(__dirname, 'preload.cjs')
    : path.join(__dirname, 'src', 'electron', 'preload.cjs');
const rendererIndex = app.isPackaged
    ? path.join(__dirname, '..', 'dist', 'index.html')
    : path.join(__dirname, 'dist', 'index.html');

let mainWindow;
let popupWindow;
let tray;
let isQuitting = false;
let bluetoothManager;

const POPUP_WIDTH = 380;
const POPUP_HEIGHT = 560;
const mediaManager = new MediaManager();
const systemMonitor = new SystemMonitor();
const mediaTracker = new MediaTracker(mediaManager);
const sshManager = new SshManager();
const dockerManager = new DockerManager();
const rendererWindows = new Set();
const detachedSessions = new Map(); // sessionId -> BrowserWindow

function registerRendererWindow(win) {
    rendererWindows.add(win);
    win.on('closed', () => rendererWindows.delete(win));
}

function broadcast(channel, payload) {
    for (const win of rendererWindows) {
        if (!win.isDestroyed()) {
            win.webContents.send(channel, payload);
        }
    }
}

sshManager.on('data', (payload) => broadcast('ssh:session-data', payload));
sshManager.on('exit', (payload) => {
    broadcast('ssh:session-exit', payload);
    const detached = detachedSessions.get(payload.sessionId);
    if (detached && !detached.isDestroyed()) {
        detached.close();
    }
    detachedSessions.delete(payload.sessionId);
});

// Docker exec sessions piggy-back on the ssh terminal channels so the renderer
// can use the same xterm pipeline regardless of session kind.
dockerManager.on('exec-data', (payload) => broadcast('ssh:session-data', payload));
dockerManager.on('exec-exit', (payload) => broadcast('ssh:session-exit', payload));

async function waitForDevServer(url) {
    for (let attempt = 0; attempt < 50; attempt += 1) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                return;
            }
        } catch {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }
}

async function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        center: true,
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: preloadPath
        },
        titleBarStyle: 'hiddenInset',
        vibrancy: 'under-window',
        visualEffectState: 'active'
    });

    registerRendererWindow(mainWindow);

    // Always join the user's current Space when shown — same behaviour as
    // Docker Desktop / Postman / Telegram main windows. macOS will keep the
    // window visible across Spaces only while it's actually visible, so the
    // close-to-tray path is unaffected.
    if (process.platform === 'darwin') {
        mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    }

    // Close button hides the window instead of quitting so the tray icon
    // keeps the app accessible (Cmd+Q / Quit-from-tray sets isQuitting).
    mainWindow.on('close', (event) => {
        if (!isQuitting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });

    if (isDev) {
        await waitForDevServer(devServerUrl);
        mainWindow.loadURL(devServerUrl);
    } else {
        mainWindow.loadFile(rendererIndex);
    }
}

function showMainWindow() {
    if (!mainWindow || mainWindow.isDestroyed()) {
        createMainWindow().then(() => {
            mainWindow.once('ready-to-show', () => {
                mainWindow.show();
                mainWindow.focus();
                if (process.platform === 'darwin') app.focus({ steal: true });
            });
        });
        return;
    }
    mainWindow.show();
    mainWindow.focus();
    if (process.platform === 'darwin') app.focus({ steal: true });
}

async function createPopupWindow() {
    popupWindow = new BrowserWindow({
        width: POPUP_WIDTH,
        height: POPUP_HEIGHT,
        show: false,
        frame: false,
        // NSPanel-backed window — same architecture as Docker Desktop,
        // Postman, Telegram menubar popups. Doesn't activate the app and
        // floats over all Spaces (including fullscreen).
        type: process.platform === 'darwin' ? 'panel' : undefined,
        resizable: false,
        movable: false,
        skipTaskbar: true,
        alwaysOnTop: true,
        hasShadow: true,
        fullscreenable: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: preloadPath
        },
        vibrancy: 'popover',
        visualEffectState: 'active'
    });

    registerRendererWindow(popupWindow);

    popupWindow.setWindowButtonVisibility?.(false);
    // Follow the user across Spaces and float above fullscreen apps — same
    // behaviour as Docker Desktop / Postman / Telegram menubar popups.
    popupWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    popupWindow.setAlwaysOnTop(true, 'screen-saver');

    // Hide when focus leaves so the popup feels like a native menubar dropdown.
    popupWindow.on('blur', () => {
        if (!popupWindow.isDestroyed() && popupWindow.isVisible()) {
            popupWindow.hide();
        }
    });

    const params = new URLSearchParams({ view: 'popup' });
    if (isDev) {
        await waitForDevServer(devServerUrl);
        popupWindow.loadURL(`${devServerUrl}/?${params.toString()}`);
    } else {
        popupWindow.loadFile(rendererIndex, {
            search: `?${params.toString()}`
        });
    }
}

function positionPopupNearTray() {
    if (!popupWindow || !tray) return;

    const trayBounds = tray.getBounds();
    const display = screen.getDisplayNearestPoint({
        x: trayBounds.x,
        y: trayBounds.y
    });
    const work = display.workArea;

    let x = Math.round(trayBounds.x + trayBounds.width / 2 - POPUP_WIDTH / 2);
    x = Math.max(work.x + 8, Math.min(work.x + work.width - POPUP_WIDTH - 8, x));
    const y = Math.round(trayBounds.y + trayBounds.height + 4);

    popupWindow.setBounds({ x, y, width: POPUP_WIDTH, height: POPUP_HEIGHT });
}

function togglePopup() {
    if (!popupWindow || popupWindow.isDestroyed()) return;
    if (popupWindow.isVisible()) {
        popupWindow.hide();
        return;
    }
    positionPopupNearTray();
    popupWindow.show();
    popupWindow.focus();
    if (process.platform === 'darwin') {
        // Force the popup to surface on whatever Space the user is on right
        // now (not the one where the window was created).
        app.focus({ steal: true });
    }
}

function createTray() {
    // Empty image + title text — works without shipping a PNG asset.
    // Drop a `tray-iconTemplate.png` into assets/ later to replace.
    tray = new Tray(nativeImage.createEmpty());
    tray.setTitle('◉');
    tray.setToolTip('Control Center');

    const buildMenu = () =>
        Menu.buildFromTemplate([
            { label: 'Open popup', click: togglePopup },
            { label: 'Open main window', click: showMainWindow },
            { type: 'separator' },
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                click: () => {
                    isQuitting = true;
                    app.quit();
                }
            }
        ]);

    tray.on('click', togglePopup);
    tray.on('right-click', () => tray.popUpContextMenu(buildMenu()));
}

async function createDetachedWindow(sessionId, hostMeta) {
    const win = new BrowserWindow({
        width: 900,
        height: 600,
        title: hostMeta?.alias ? `SSH · ${hostMeta.alias}` : 'SSH Session',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: preloadPath
        },
        titleBarStyle: 'hiddenInset'
    });

    registerRendererWindow(win);
    detachedSessions.set(sessionId, win);

    const params = new URLSearchParams({
        session: sessionId,
        alias: hostMeta?.alias ?? '',
        user: hostMeta?.user ?? '',
        hostname: hostMeta?.hostname ?? '',
        port: hostMeta?.port ? String(hostMeta.port) : ''
    });

    if (isDev) {
        await waitForDevServer(devServerUrl);
        win.loadURL(`${devServerUrl}/?${params.toString()}`);
    } else {
        win.loadFile(rendererIndex, {
            search: `?${params.toString()}`
        });
    }

    win.on('closed', () => {
        detachedSessions.delete(sessionId);
        sshManager.close(sessionId);
    });
}

async function initBluetoothManager() {
    bluetoothManager = new BluetoothManager();

    bluetoothManager.on('devices-updated', (devices) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('bluetooth:devices-updated', devices);
        }
    });

    bluetoothManager.on('connection-changed', (data) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('bluetooth:connection-changed', data);
        }
    });

    bluetoothManager.on('battery-updated', (data) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('bluetooth:battery-updated', data);
        }
    });

    bluetoothManager.on('error', (error) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('bluetooth:error', error);
        }
    });

    bluetoothManager.on('scan-started', () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('bluetooth:scan-started');
        }
    });

    bluetoothManager.on('scan-completed', () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('bluetooth:scan-completed');
        }
    });

    await bluetoothManager.startMonitoring();
}

// IPC Handlers
ipcMain.handle('bluetooth:get-devices', async () => {
    return await bluetoothManager.getDevices();
});

ipcMain.handle('bluetooth:connect-device', async (event, address) => {
    return await bluetoothManager.connectDevice(address);
});

ipcMain.handle('bluetooth:disconnect-device', async (event, address) => {
    return await bluetoothManager.disconnectDevice(address);
});

ipcMain.handle('bluetooth:forget-device', async (event, address) => {
    return await bluetoothManager.forgetDevice(address);
});

ipcMain.handle('bluetooth:scan-devices', async (event, duration = 5) => {
    return await bluetoothManager.scanForDevices(duration);
});

ipcMain.handle('bluetooth:get-battery', async (event, address) => {
    return await bluetoothManager.getBatteryLevel(address);
});

ipcMain.handle('media:get-now-playing', async () => {
    return await mediaManager.getAllNowPlaying();
});

ipcMain.handle('media:control', async (event, action, bundleId) => {
    return await mediaManager.control(action, bundleId);
});

ipcMain.handle('media:list-history', async (event, limit) => {
    return listHistory(typeof limit === 'number' ? limit : 50);
});

ipcMain.handle('media:stats', async () => {
    return getStats();
});

ipcMain.handle('media:clear-history', async () => {
    await clearHistory();
    return true;
});

ipcMain.handle('media:clear-all-stats', async () => {
    await clearAllStats();
    return true;
});

ipcMain.handle('media:list-artists', async (event, limit) => {
    return listArtistGroups(typeof limit === 'number' ? limit : 30);
});

ipcMain.handle('system:get-metrics', async () => {
    return await systemMonitor.getMetrics();
});

ipcMain.handle('ssh:list-hosts', async () => {
    return await listAllSshHosts();
});

ipcMain.handle('ssh:create-session', async (event, host, cols, rows) => {
    return await sshManager.create(host, cols, rows);
});

ipcMain.handle('ssh:list-saved', async () => {
    return listSavedHosts();
});

ipcMain.handle('ssh:create-saved', async (event, input) => {
    return await createSavedHost(input);
});

ipcMain.handle('ssh:update-saved', async (event, id, input) => {
    return await updateSavedHost(id, input);
});

ipcMain.handle('ssh:delete-saved', async (event, id) => {
    return await deleteSavedHost(id);
});

ipcMain.handle('ssh:encryption-available', async () => {
    return isCredentialEncryptionAvailable();
});

ipcMain.handle('ssh:set-override', async (event, hostId, patch) => {
    return await upsertOverride(hostId, patch);
});

ipcMain.handle('ssh:delete-override', async (event, hostId) => {
    await deleteOverride(hostId);
    return true;
});

ipcMain.handle('ssh:remove-known-host', async (event, hostname) => {
    return await removeFromKnownHosts(hostname);
});

ipcMain.handle('ssh:list-forwards', async (event, hostId) => {
    return listPortForwards(hostId);
});

ipcMain.handle('ssh:create-forward', async (event, hostId, input) => {
    return await createPortForward(hostId, input);
});

ipcMain.handle('ssh:update-forward', async (event, id, patch) => {
    await updatePortForward(id, patch);
    return true;
});

ipcMain.handle('ssh:delete-forward', async (event, id) => {
    await deletePortForward(id);
    return true;
});

ipcMain.handle('ssh:write', async (event, sessionId, data) => {
    if (dockerManager.ownsExec(sessionId)) {
        return dockerManager.writeExec(sessionId, data);
    }
    return sshManager.write(sessionId, data);
});

ipcMain.handle('ssh:resize', async (event, sessionId, cols, rows) => {
    if (dockerManager.ownsExec(sessionId)) {
        return dockerManager.resizeExec(sessionId, cols, rows);
    }
    return sshManager.resize(sessionId, cols, rows);
});

ipcMain.handle('ssh:close-session', async (event, sessionId) => {
    if (dockerManager.ownsExec(sessionId)) {
        return dockerManager.closeExec(sessionId);
    }
    return sshManager.close(sessionId);
});

ipcMain.handle('ssh:list-active', async () => {
    return sshManager.list();
});

ipcMain.handle('app:show-main', async () => {
    showMainWindow();
    if (popupWindow && !popupWindow.isDestroyed()) {
        popupWindow.hide();
    }
    return true;
});

ipcMain.handle('app:hide-popup', async () => {
    if (popupWindow && !popupWindow.isDestroyed()) {
        popupWindow.hide();
    }
    return true;
});

ipcMain.handle('docker:status', async () => {
    return dockerManager.isAvailable();
});

ipcMain.handle('docker:list-containers', async () => {
    return dockerManager.listContainers();
});

ipcMain.handle('docker:list-images', async () => {
    return dockerManager.listImages();
});

ipcMain.handle('docker:list-volumes', async () => {
    return dockerManager.listVolumes();
});

ipcMain.handle('docker:list-networks', async () => {
    return dockerManager.listNetworks();
});

ipcMain.handle('docker:run-image', async (event, options) => {
    return dockerManager.runImage(options);
});

ipcMain.handle('docker:start-container', async (event, id) => {
    await dockerManager.startContainer(id);
    return true;
});

ipcMain.handle('docker:stop-container', async (event, id) => {
    await dockerManager.stopContainer(id);
    return true;
});

ipcMain.handle('docker:restart-container', async (event, id) => {
    await dockerManager.restartContainer(id);
    return true;
});

ipcMain.handle('docker:remove-container', async (event, id, force) => {
    await dockerManager.removeContainer(id, Boolean(force));
    return true;
});

ipcMain.handle('docker:remove-image', async (event, id, force) => {
    await dockerManager.removeImage(id, Boolean(force));
    return true;
});

ipcMain.handle('docker:remove-volume', async (event, name, force) => {
    await dockerManager.removeVolume(name, Boolean(force));
    return true;
});

ipcMain.handle('docker:remove-network', async (event, name) => {
    await dockerManager.removeNetwork(name);
    return true;
});

ipcMain.handle('docker:prune-containers', async () => {
    return dockerManager.pruneContainers();
});

ipcMain.handle('docker:prune-images', async (event, all) => {
    return dockerManager.pruneImages(Boolean(all));
});

ipcMain.handle('docker:prune-volumes', async () => {
    return dockerManager.pruneVolumes();
});

ipcMain.handle('docker:prune-networks', async () => {
    return dockerManager.pruneNetworks();
});

ipcMain.handle('docker:prune-system', async (event, all) => {
    return dockerManager.pruneSystem(Boolean(all));
});

ipcMain.handle('docker:logs', async (event, id, tail) => {
    return dockerManager.getLogs(id, typeof tail === 'number' ? tail : 500);
});

ipcMain.handle('docker:exec-start', async (event, containerId, containerName, cols, rows) => {
    return dockerManager.startExec(containerId, containerName, cols, rows);
});

ipcMain.handle('ssh:detach-session', async (event, sessionId, hostMeta) => {
    if (detachedSessions.has(sessionId)) {
        const existing = detachedSessions.get(sessionId);
        if (!existing.isDestroyed()) existing.focus();
        return { success: true };
    }
    await createDetachedWindow(sessionId, hostMeta);
    return { success: true };
});

// Write any unhandled startup error to a known location so packaged-build
// failures aren't silent — `Contents/MacOS/<exe>` ordinarily eats stderr.
function logFatal(stage, err) {
    try {
        const logPath = path.join(app.getPath('userData'), 'fatal.log');
        const line = `[${new Date().toISOString()}] ${stage}: ${err?.stack ?? err}\n`;
        appendFileSync(logPath, line);
    } catch {
        // last resort
        console.error(stage, err);
    }
}

process.on('uncaughtException', (err) => logFatal('uncaughtException', err));
process.on('unhandledRejection', (err) => logFatal('unhandledRejection', err));

app.whenReady().then(async () => {
    try {
        await initDb();
        // Drop track entries older than retention window — stats live in
        // dedicated tables so this only trims the recent-list.
        await purgeOldHistory();
        await createMainWindow();
        await createPopupWindow();
        createTray();
        initBluetoothManager();
        mediaTracker.start();
    } catch (err) {
        logFatal('whenReady', err);
        throw err;
    }
});

app.on('activate', () => {
    showMainWindow();
});

app.on('before-quit', () => {
    isQuitting = true;
});

// On macOS the tray keeps the app alive after all windows are closed.
// Cleanup runs from `before-quit` via the explicit Quit path.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('will-quit', async () => {
    if (bluetoothManager) {
        bluetoothManager.stopMonitoring();
    }
    sshManager.dispose();
    dockerManager.dispose();
    await mediaTracker.stop();
    await closeDb();
});
