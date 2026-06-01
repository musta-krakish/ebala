import { app, BrowserWindow, globalShortcut, ipcMain, Menu, Tray, nativeImage, screen } from 'electron';
import { appendFileSync } from 'fs';
import { readFile } from 'fs/promises';
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
import { deleteOverride, upsertOverride } from './src/electron/host-overrides.ts';
import { removeFromKnownHosts } from './src/electron/ssh-file-ops.ts';
import {
    createPortForward,
    deletePortForward,
    listPortForwards,
    updatePortForward
} from './src/electron/port-forwards.ts';
import { listLocal, localHome } from './src/electron/local-fs.ts';
import { SftpManager } from './src/electron/sftp-manager.ts';
import { RsyncManager } from './src/electron/rsync-manager.ts';
import { DiskScanner } from './src/electron/disk-scanner.ts';
import { initPluginManager, applyEnabled, disposeAllPlugins, registerPlugin, unregisterPlugin } from './src/plugin/manager.js';
import { mainPlugins } from './src/features/main-plugins.js';
import { discoverPlugins, loadExternalMainPlugin, pluginsDir } from './src/plugin/external-main.js';
import { installPlugin, uninstallPlugin } from './src/plugin/installer.js';
import { isRouted, routeTerminal } from './src/plugin/terminal-router.ts';

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
let registeredHotkey = null;
let hotkeyError = null;

const POPUP_WIDTH = 380;
const POPUP_HEIGHT = 560;
const systemMonitor = new SystemMonitor();
const sshManager = new SshManager();
const sftpManager = new SftpManager();
const rsyncManager = new RsyncManager();
const diskScanner = new DiskScanner();
diskScanner.on('progress', (payload) => broadcast('disk:scan-progress', payload));

rsyncManager.on('progress', (payload) => broadcast('transfer:progress', payload));
rsyncManager.on('done', (payload) => broadcast('transfer:done', payload));
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

const pluginCtx = { ipcMain, broadcast };

// Installed external plugins: [{ dir, manifest }]. Populated on startup and on
// install. Reserved ids can't be shadowed by an installed plugin.
let externalPlugins = [];
const RESERVED_PLUGIN_IDS = ['ssh', 'docker', 'bluetooth', 'system', 'disk', 'media', 'settings'];

function pluginsBaseDir() {
    return pluginsDir(app.getPath('userData'));
}

function externalPluginInfo(settings) {
    const disabled = new Set(settings.plugins.disabled);
    return externalPlugins.map(({ manifest }) => ({
        id: manifest.id,
        name: manifest.name,
        description: manifest.description,
        icon: manifest.icon,
        enabled: !disabled.has(manifest.id),
        external: true,
        source: manifest.source,
        hasRenderer: Boolean(manifest.capabilities.renderer)
    }));
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

async function createDetachedWindow(sessionId, meta, kind = 'ssh') {
    const isTerminal = kind === 'terminal';
    const title = isTerminal
        ? meta?.title
            ? `Terminal · ${meta.title}`
            : 'Terminal'
        : meta?.alias
          ? `SSH · ${meta.alias}`
          : 'SSH Session';

    const win = new BrowserWindow({
        width: 900,
        height: 600,
        title,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: preloadPath
        },
        titleBarStyle: 'hiddenInset'
    });

    registerRendererWindow(win);
    detachedSessions.set(sessionId, win);

    const params = isTerminal
        ? new URLSearchParams({
              terminal: sessionId,
              title: meta?.title ?? '',
              cwd: meta?.cwd ?? ''
          })
        : new URLSearchParams({
              session: sessionId,
              alias: meta?.alias ?? '',
              user: meta?.user ?? '',
              hostname: meta?.hostname ?? '',
              port: meta?.port ? String(meta.port) : ''
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
        if (isTerminal) {
            // Terminal sessions live in the terminal plugin's manager; close via
            // the shared terminal-router (registered by createTerminalPlugin).
            routeTerminal('close', sessionId);
        } else {
            sshManager.close(sessionId);
        }
    });
}

// IPC Handlers

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

// Terminal I/O: a registered backend (e.g. Docker exec) may own the session;
// otherwise it's a regular SSH session.
ipcMain.handle('ssh:write', async (event, sessionId, data) => {
    if (isRouted(sessionId)) return routeTerminal('write', sessionId, data);
    return sshManager.write(sessionId, data);
});

ipcMain.handle('ssh:resize', async (event, sessionId, cols, rows) => {
    if (isRouted(sessionId)) return routeTerminal('resize', sessionId, cols, rows);
    return sshManager.resize(sessionId, cols, rows);
});

ipcMain.handle('ssh:close-session', async (event, sessionId) => {
    if (isRouted(sessionId)) return routeTerminal('close', sessionId);
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

ipcMain.handle('plugins:set-enabled', async (event, id, enabled) => {
    const current = await loadSettings();
    const disabled = new Set(current.plugins.disabled);
    if (enabled) disabled.delete(id);
    else disabled.add(id);
    const next = await updateSettings({ plugins: { disabled: [...disabled] } });
    applyEnabled(next.plugins.disabled);
    broadcast('settings:changed', next);
    return next;
});

ipcMain.handle('plugins:list', async () => {
    const settings = await loadSettings();
    return externalPluginInfo(settings);
});

ipcMain.handle('plugins:read-renderer', async (event, id) => {
    const entry = externalPlugins.find((p) => p.manifest.id === id);
    if (!entry || !entry.manifest.capabilities.renderer) return null;
    return await readFile(path.join(entry.dir, entry.manifest.capabilities.renderer), 'utf8');
});

ipcMain.handle('plugins:install', async (event, gitUrl) => {
    if (typeof gitUrl !== 'string' || !gitUrl.trim()) {
        return { ok: false, errors: ['Provide a git URL or local path'] };
    }
    const existingIds = [...RESERVED_PLUGIN_IDS, ...externalPlugins.map((p) => p.manifest.id)];
    const result = await installPlugin(gitUrl.trim(), pluginsBaseDir(), existingIds);
    if (!result.ok) return result;

    externalPlugins.push({ dir: result.dir, manifest: result.manifest });
    try {
        const plugin = await loadExternalMainPlugin(result.dir, result.manifest);
        if (plugin) registerPlugin(plugin);
    } catch (err) {
        logFatal(`load installed plugin ${result.manifest.id}`, err);
    }
    const settings = await loadSettings();
    applyEnabled(settings.plugins.disabled);
    broadcast('plugins:changed');
    return { ok: true, manifest: result.manifest };
});

ipcMain.handle('plugins:uninstall', async (event, id) => {
    await unregisterPlugin(id);
    externalPlugins = externalPlugins.filter((p) => p.manifest.id !== id);
    await uninstallPlugin(id, pluginsBaseDir());

    const current = await loadSettings();
    if (current.plugins.disabled.includes(id)) {
        const next = await updateSettings({
            plugins: { disabled: current.plugins.disabled.filter((x) => x !== id) }
        });
        broadcast('settings:changed', next);
    }
    broadcast('plugins:changed');
    return true;
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

ipcMain.handle('ssh:detach-session', async (event, sessionId, hostMeta) => {
    if (detachedSessions.has(sessionId)) {
        const existing = detachedSessions.get(sessionId);
        if (!existing.isDestroyed()) existing.focus();
        return { success: true };
    }
    await createDetachedWindow(sessionId, hostMeta);
    return { success: true };
});

ipcMain.handle('terminal:detach', async (event, sessionId, meta) => {
    if (detachedSessions.has(sessionId)) {
        const existing = detachedSessions.get(sessionId);
        if (!existing.isDestroyed()) existing.focus();
        return { success: true };
    }
    await createDetachedWindow(sessionId, meta, 'terminal');
    return { success: true };
});

ipcMain.handle('app:close-self', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win && !win.isDestroyed()) win.close();
    return true;
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
        initPluginManager(mainPlugins, pluginCtx);
        externalPlugins = await discoverPlugins(pluginsBaseDir());
        for (const { dir, manifest } of externalPlugins) {
            try {
                const plugin = await loadExternalMainPlugin(dir, manifest);
                if (plugin) registerPlugin(plugin);
            } catch (err) {
                logFatal(`load external plugin ${manifest.id}`, err);
            }
        }
        await createMainWindow();
        createTray();
        applyHotkey(settings);
        applyEnabled(settings.plugins.disabled);
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
    await disposeAllPlugins();
    sshManager.dispose();
    sftpManager.dispose();
    rsyncManager.dispose();
    diskScanner.cancel();
    await closeDb();
});
