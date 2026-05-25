import { app, BrowserWindow, globalShortcut, ipcMain, Menu, Tray, nativeImage, screen } from 'electron';
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

// libuv defaults to 4 threads for fs ops — way too few for the disk-usage
// scanner on a modern SSD. Bump before the runtime initialises the pool
// (must be set before any fs call). 32 saturates most NVMe drives without
// piling up too many fds.
if (!process.env.UV_THREADPOOL_SIZE) {
    process.env.UV_THREADPOOL_SIZE = '32';
}
import { BluetoothManager } from './src/electron/bluetooth-manager.ts';
import { MediaManager } from './src/electron/media-manager.ts';
import { SystemMonitor } from './src/electron/system-monitor.ts';
import { listAllSshHosts } from './src/electron/ssh-hosts.ts';
import { SshManager } from './src/electron/ssh-manager.ts';
import { clearTables, getDbStats, initDb, closeDb } from './src/electron/db.ts';
import { loadSettings, updateSettings } from './src/electron/settings-store.ts';
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
import { listLocal, localHome } from './src/electron/local-fs.ts';
import { SftpManager } from './src/electron/sftp-manager.ts';
import { RsyncManager } from './src/electron/rsync-manager.ts';
import {
    createRdpHost,
    deleteRdpHost,
    listRdpHosts,
    updateRdpHost
} from './src/electron/rdp-hosts.ts';
import { RdpManager } from './src/electron/rdp-manager.ts';
import { DiskScanner } from './src/electron/disk-scanner.ts';

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
let registeredHotkey = null;
let hotkeyError = null;

const POPUP_WIDTH = 380;
const POPUP_HEIGHT = 560;
const mediaManager = new MediaManager();
const systemMonitor = new SystemMonitor();
const mediaTracker = new MediaTracker(mediaManager);
const sshManager = new SshManager();
const dockerManager = new DockerManager();
const sftpManager = new SftpManager();
const rsyncManager = new RsyncManager();
const rdpManager = new RdpManager();
const diskScanner = new DiskScanner();
diskScanner.on('progress', (payload) => broadcast('disk:scan-progress', payload));

rsyncManager.on('progress', (payload) => broadcast('transfer:progress', payload));
rsyncManager.on('done', (payload) => broadcast('transfer:done', payload));
rdpManager.on('active-changed', (payload) => broadcast('rdp:active-changed', payload));
rdpManager.on('exit', (payload) => broadcast('rdp:session-exit', payload));
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

async function ensurePopupWindow() {
    if (popupWindow && !popupWindow.isDestroyed()) return;
    await createPopupWindow();
    // First load needs to finish before positioning so the panel renders
    // with the right size — wait for ready-to-show one time.
    if (popupWindow && !popupWindow.isVisible()) {
        await new Promise((resolve) => popupWindow.once('ready-to-show', resolve));
    }
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

async function togglePopup() {
    if (popupWindow && !popupWindow.isDestroyed() && popupWindow.isVisible()) {
        popupWindow.hide();
        return;
    }
    // Lazy-create: not built on startup any more. First open pays ~300 ms
    // for renderer boot, saving ~120-150 MB resident from the always-on
    // hidden window.
    await ensurePopupWindow();
    if (!popupWindow || popupWindow.isDestroyed()) return;
    positionPopupNearTray();
    popupWindow.show();
    popupWindow.focus();
    if (process.platform === 'darwin') {
        app.focus({ steal: true });
    }
}

function toggleMainWindow() {
    if (!mainWindow || mainWindow.isDestroyed()) {
        showMainWindow();
        return;
    }
    if (mainWindow.isVisible() && mainWindow.isFocused()) {
        mainWindow.hide();
        return;
    }
    showMainWindow();
}

function applyHotkey(settings) {
    if (registeredHotkey) {
        try {
            globalShortcut.unregister(registeredHotkey);
        } catch {
            // ignore
        }
        registeredHotkey = null;
    }
    hotkeyError = null;

    const hk = settings?.hotkey;
    if (!hk?.enabled || !hk?.combo) {
        return { ok: true, registered: false, combo: null, error: null };
    }

    try {
        const ok = globalShortcut.register(hk.combo, () => toggleMainWindow());
        if (!ok) {
            hotkeyError = `Shortcut "${hk.combo}" is already taken by another app`;
            return { ok: false, registered: false, combo: hk.combo, error: hotkeyError };
        }
        registeredHotkey = hk.combo;
        return { ok: true, registered: true, combo: hk.combo, error: null };
    } catch (err) {
        hotkeyError = err?.message ?? String(err);
        return { ok: false, registered: false, combo: hk.combo, error: hotkeyError };
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

    bluetoothManager.on('devices-updated', (devices) => broadcast('bluetooth:devices-updated', devices));
    bluetoothManager.on('connection-changed', (data) => broadcast('bluetooth:connection-changed', data));
    bluetoothManager.on('battery-updated', (data) => broadcast('bluetooth:battery-updated', data));
    bluetoothManager.on('error', (error) => broadcast('bluetooth:error', error));
    bluetoothManager.on('scan-started', () => broadcast('bluetooth:scan-started'));
    bluetoothManager.on('scan-completed', () => broadcast('bluetooth:scan-completed'));

    await bluetoothManager.startMonitoring();
}

// IPC Handlers
// bluetoothManager is initialised async after whenReady; renderer can call
// these IPCs before that completes, so guard every handler with a fallback.
async function whenBluetoothReady() {
    if (bluetoothManager) return bluetoothManager;
    // Wait up to 5s for init — beyond that, treat as unavailable.
    for (let i = 0; i < 50; i += 1) {
        if (bluetoothManager) return bluetoothManager;
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return null;
}

ipcMain.handle('bluetooth:get-devices', async () => {
    const mgr = await whenBluetoothReady();
    if (!mgr) return { connected: [], notConnected: [], timestamp: Date.now() };
    return await mgr.getDevices();
});

ipcMain.handle('bluetooth:connect-device', async (event, address) => {
    const mgr = await whenBluetoothReady();
    if (!mgr) return { success: false, error: 'Bluetooth not ready' };
    return await mgr.connectDevice(address);
});

ipcMain.handle('bluetooth:disconnect-device', async (event, address) => {
    const mgr = await whenBluetoothReady();
    if (!mgr) return { success: false, error: 'Bluetooth not ready' };
    return await mgr.disconnectDevice(address);
});

ipcMain.handle('bluetooth:forget-device', async (event, address) => {
    const mgr = await whenBluetoothReady();
    if (!mgr) return { success: false, error: 'Bluetooth not ready' };
    return await mgr.forgetDevice(address);
});

ipcMain.handle('bluetooth:scan-devices', async (event, duration = 5) => {
    const mgr = await whenBluetoothReady();
    if (!mgr) return { success: false, error: 'Bluetooth not ready' };
    return await mgr.scanForDevices(duration);
});

ipcMain.handle('bluetooth:get-battery', async (event, address) => {
    const mgr = await whenBluetoothReady();
    if (!mgr) return null;
    return await mgr.getBatteryLevel(address);
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

ipcMain.handle('system:list-processes', async () => {
    return await systemMonitor.listAllProcesses();
});

ipcMain.handle('system:kill-process', async (event, pid, signal) => {
    return systemMonitor.killProcess(pid, signal);
});

ipcMain.handle('disk:scan', async (event, rootPath, depth) => {
    return await diskScanner.scan(rootPath || '/', typeof depth === 'number' ? depth : 4);
});

ipcMain.handle('disk:cancel-scan', async () => {
    diskScanner.cancel();
    return true;
});

// Cache app icons by .app bundle path — getFileIcon does an Icon Services
// lookup which is comparatively expensive, and the renderer fetches the
// same paths on every poll.
const appIconCache = new Map();
ipcMain.handle('system:get-app-icon', async (event, appPath) => {
    if (typeof appPath !== 'string' || !appPath.endsWith('.app')) {
        return null;
    }
    if (appIconCache.has(appPath)) {
        return appIconCache.get(appPath);
    }
    try {
        const icon = await app.getFileIcon(appPath, { size: 'small' });
        const dataUrl = icon.toDataURL();
        appIconCache.set(appPath, dataUrl);
        return dataUrl;
    } catch {
        appIconCache.set(appPath, null);
        return null;
    }
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

ipcMain.handle('settings:get', async () => {
    return await loadSettings();
});

ipcMain.handle('settings:update', async (event, patch) => {
    const next = await updateSettings(patch);
    if (patch?.hotkey) applyHotkey(next);
    broadcast('settings:changed', next);
    return next;
});

ipcMain.handle('hotkey:status', () => ({
    registered: Boolean(registeredHotkey),
    combo: registeredHotkey,
    error: hotkeyError
}));

ipcMain.handle('db:get-stats', async () => {
    return await getDbStats();
});

ipcMain.handle('db:clear-tables', async (event, groups) => {
    return await clearTables(Array.isArray(groups) ? groups : []);
});

ipcMain.handle('files:local-home', async () => {
    return localHome();
});

ipcMain.handle('files:local-list', async (event, dirPath) => {
    return await listLocal(dirPath);
});

ipcMain.handle('files:remote-connect', async (event, host) => {
    return await sftpManager.connect(host);
});

ipcMain.handle('files:remote-list', async (event, sessionId, dirPath) => {
    return await sftpManager.list(sessionId, dirPath);
});

ipcMain.handle('files:remote-disconnect', async (event, sessionId) => {
    return sftpManager.disconnect(sessionId);
});

ipcMain.handle('transfer:start', async (event, hostId, options) => {
    const all = await listAllSshHosts();
    const host = [...all.visible, ...all.hidden].find((h) => h.id === hostId);
    if (!host) throw new Error(`Host ${hostId} not found`);
    return await rsyncManager.start(host, options);
});

ipcMain.handle('transfer:cancel', async (event, transferId) => {
    return rsyncManager.cancel(transferId);
});

ipcMain.handle('transfer:list', async () => {
    return rsyncManager.list();
});

ipcMain.handle('transfer:sshpass-available', async () => {
    return rsyncManager.isSshpassAvailable();
});

ipcMain.handle('rdp:list', async () => {
    return listRdpHosts();
});

ipcMain.handle('rdp:create', async (event, input) => {
    return await createRdpHost(input);
});

ipcMain.handle('rdp:update', async (event, id, input) => {
    return await updateRdpHost(id, input);
});

ipcMain.handle('rdp:delete', async (event, id) => {
    return await deleteRdpHost(id);
});

ipcMain.handle('rdp:connect', async (event, hostId) => {
    return await rdpManager.connect(hostId);
});

ipcMain.handle('rdp:disconnect', async (event, sessionId) => {
    return rdpManager.disconnect(sessionId);
});

ipcMain.handle('rdp:list-active', async () => {
    return rdpManager.list();
});

ipcMain.handle('rdp:available', async () => {
    return { available: rdpManager.isAvailable(), binary: rdpManager.getBinary() };
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
        const settings = await loadSettings();
        // Drop track entries older than retention window — stats live in
        // dedicated tables so this only trims the recent-list.
        await purgeOldHistory();
        await createMainWindow();
        createTray();
        applyHotkey(settings);
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
    globalShortcut.unregisterAll();
    if (bluetoothManager) {
        bluetoothManager.stopMonitoring();
    }
    sshManager.dispose();
    dockerManager.dispose();
    sftpManager.dispose();
    rsyncManager.dispose();
    rdpManager.dispose();
    diskScanner.cancel();
    await mediaTracker.stop();
    await closeDb();
});
