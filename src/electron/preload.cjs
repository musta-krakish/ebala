const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('bluetoothAPI', {
    getDevices: () => ipcRenderer.invoke('bluetooth:get-devices'),
    connectDevice: (address) => ipcRenderer.invoke('bluetooth:connect-device', address),
    disconnectDevice: (address) => ipcRenderer.invoke('bluetooth:disconnect-device', address),
    forgetDevice: (address) => ipcRenderer.invoke('bluetooth:forget-device', address),
    scanDevices: (duration) => ipcRenderer.invoke('bluetooth:scan-devices', duration),
    getBatteryLevel: (address) => ipcRenderer.invoke('bluetooth:get-battery', address),

    onDevicesUpdated: (callback) => {
        ipcRenderer.on('bluetooth:devices-updated', (_, devices) => callback(devices));
    },
    onConnectionChanged: (callback) => {
        ipcRenderer.on('bluetooth:connection-changed', (_, data) => callback(data));
    },
    onBatteryUpdated: (callback) => {
        ipcRenderer.on('bluetooth:battery-updated', (_, data) => callback(data));
    },
    onError: (callback) => {
        ipcRenderer.on('bluetooth:error', (_, error) => callback(error));
    },
    onScanStarted: (callback) => {
        ipcRenderer.on('bluetooth:scan-started', () => callback());
    },
    onScanCompleted: (callback) => {
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
});

contextBridge.exposeInMainWorld('mediaAPI', {
    getNowPlaying: () => ipcRenderer.invoke('media:get-now-playing'),
    control: (action, bundleId) => ipcRenderer.invoke('media:control', action, bundleId ?? null),
    listHistory: (limit) => ipcRenderer.invoke('media:list-history', limit ?? 50),
    listArtists: (limit) => ipcRenderer.invoke('media:list-artists', limit ?? 30),
    getStats: () => ipcRenderer.invoke('media:stats'),
    clearHistory: () => ipcRenderer.invoke('media:clear-history'),
    clearAllStats: () => ipcRenderer.invoke('media:clear-all-stats')
});

contextBridge.exposeInMainWorld('systemAPI', {
    getMetrics: () => ipcRenderer.invoke('system:get-metrics'),
    listProcesses: () => ipcRenderer.invoke('system:list-processes'),
    killProcess: (pid, signal) => ipcRenderer.invoke('system:kill-process', pid, signal),
    getAppIcon: (appPath) => ipcRenderer.invoke('system:get-app-icon', appPath)
});

contextBridge.exposeInMainWorld('diskAPI', {
    scan: (rootPath, depth) => ipcRenderer.invoke('disk:scan', rootPath, depth),
    cancel: () => ipcRenderer.invoke('disk:cancel-scan'),
    onProgress: (callback) => {
        const listener = (_, payload) => callback(payload);
        ipcRenderer.on('disk:scan-progress', listener);
        return () => ipcRenderer.removeListener('disk:scan-progress', listener);
    }
});

contextBridge.exposeInMainWorld('appAPI', {
    showMain: () => ipcRenderer.invoke('app:show-main'),
    hidePopup: () => ipcRenderer.invoke('app:hide-popup')
});

contextBridge.exposeInMainWorld('settingsAPI', {
    get: () => ipcRenderer.invoke('settings:get'),
    update: (patch) => ipcRenderer.invoke('settings:update', patch),
    onChanged: (callback) => {
        const listener = (_, settings) => callback(settings);
        ipcRenderer.on('settings:changed', listener);
        return () => ipcRenderer.removeListener('settings:changed', listener);
    }
});

contextBridge.exposeInMainWorld('hotkeyAPI', {
    status: () => ipcRenderer.invoke('hotkey:status')
});

contextBridge.exposeInMainWorld('dbAPI', {
    getStats: () => ipcRenderer.invoke('db:get-stats'),
    clearTables: (groups) => ipcRenderer.invoke('db:clear-tables', groups)
});

contextBridge.exposeInMainWorld('filesAPI', {
    localHome: () => ipcRenderer.invoke('files:local-home'),
    listLocal: (dirPath) => ipcRenderer.invoke('files:local-list', dirPath),
    remoteConnect: (host) => ipcRenderer.invoke('files:remote-connect', host),
    listRemote: (sessionId, dirPath) => ipcRenderer.invoke('files:remote-list', sessionId, dirPath),
    remoteDisconnect: (sessionId) => ipcRenderer.invoke('files:remote-disconnect', sessionId)
});

contextBridge.exposeInMainWorld('rdpAPI', {
    list: () => ipcRenderer.invoke('rdp:list'),
    create: (input) => ipcRenderer.invoke('rdp:create', input),
    update: (id, input) => ipcRenderer.invoke('rdp:update', id, input),
    remove: (id) => ipcRenderer.invoke('rdp:delete', id),
    connect: (hostId) => ipcRenderer.invoke('rdp:connect', hostId),
    disconnect: (sessionId) => ipcRenderer.invoke('rdp:disconnect', sessionId),
    listActive: () => ipcRenderer.invoke('rdp:list-active'),
    available: () => ipcRenderer.invoke('rdp:available'),
    onActiveChanged: (callback) => {
        const listener = (_, payload) => callback(payload);
        ipcRenderer.on('rdp:active-changed', listener);
        return () => ipcRenderer.removeListener('rdp:active-changed', listener);
    },
    onSessionExit: (callback) => {
        const listener = (_, payload) => callback(payload);
        ipcRenderer.on('rdp:session-exit', listener);
        return () => ipcRenderer.removeListener('rdp:session-exit', listener);
    }
});

contextBridge.exposeInMainWorld('transferAPI', {
    start: (hostId, options) => ipcRenderer.invoke('transfer:start', hostId, options),
    cancel: (transferId) => ipcRenderer.invoke('transfer:cancel', transferId),
    list: () => ipcRenderer.invoke('transfer:list'),
    sshpassAvailable: () => ipcRenderer.invoke('transfer:sshpass-available'),
    onProgress: (callback) => {
        const listener = (_, payload) => callback(payload);
        ipcRenderer.on('transfer:progress', listener);
        return () => ipcRenderer.removeListener('transfer:progress', listener);
    },
    onDone: (callback) => {
        const listener = (_, payload) => callback(payload);
        ipcRenderer.on('transfer:done', listener);
        return () => ipcRenderer.removeListener('transfer:done', listener);
    }
});

contextBridge.exposeInMainWorld('dockerAPI', {
    status: () => ipcRenderer.invoke('docker:status'),
    listContainers: () => ipcRenderer.invoke('docker:list-containers'),
    listImages: () => ipcRenderer.invoke('docker:list-images'),
    listVolumes: () => ipcRenderer.invoke('docker:list-volumes'),
    listNetworks: () => ipcRenderer.invoke('docker:list-networks'),

    runImage: (options) => ipcRenderer.invoke('docker:run-image', options),
    startContainer: (id) => ipcRenderer.invoke('docker:start-container', id),
    stopContainer: (id) => ipcRenderer.invoke('docker:stop-container', id),
    restartContainer: (id) => ipcRenderer.invoke('docker:restart-container', id),
    removeContainer: (id, force) => ipcRenderer.invoke('docker:remove-container', id, Boolean(force)),

    removeImage: (id, force) => ipcRenderer.invoke('docker:remove-image', id, Boolean(force)),
    removeVolume: (name, force) => ipcRenderer.invoke('docker:remove-volume', name, Boolean(force)),
    removeNetwork: (name) => ipcRenderer.invoke('docker:remove-network', name),

    pruneContainers: () => ipcRenderer.invoke('docker:prune-containers'),
    pruneImages: (all) => ipcRenderer.invoke('docker:prune-images', Boolean(all)),
    pruneVolumes: () => ipcRenderer.invoke('docker:prune-volumes'),
    pruneNetworks: () => ipcRenderer.invoke('docker:prune-networks'),
    pruneSystem: (all) => ipcRenderer.invoke('docker:prune-system', Boolean(all)),

    getLogs: (id, tail) => ipcRenderer.invoke('docker:logs', id, tail ?? 500),
    startExec: (containerId, containerName, cols, rows) =>
        ipcRenderer.invoke('docker:exec-start', containerId, containerName, cols, rows)
});

contextBridge.exposeInMainWorld('sshAPI', {
    listHosts: () => ipcRenderer.invoke('ssh:list-hosts'),
    listActive: () => ipcRenderer.invoke('ssh:list-active'),
    createSession: (host, cols, rows) => ipcRenderer.invoke('ssh:create-session', host, cols, rows),
    write: (sessionId, data) => ipcRenderer.invoke('ssh:write', sessionId, data),
    resize: (sessionId, cols, rows) => ipcRenderer.invoke('ssh:resize', sessionId, cols, rows),
    closeSession: (sessionId) => ipcRenderer.invoke('ssh:close-session', sessionId),
    detachSession: (sessionId, hostMeta) => ipcRenderer.invoke('ssh:detach-session', sessionId, hostMeta),

    listSaved: () => ipcRenderer.invoke('ssh:list-saved'),
    createSaved: (input) => ipcRenderer.invoke('ssh:create-saved', input),
    updateSaved: (id, input) => ipcRenderer.invoke('ssh:update-saved', id, input),
    deleteSaved: (id) => ipcRenderer.invoke('ssh:delete-saved', id),
    encryptionAvailable: () => ipcRenderer.invoke('ssh:encryption-available'),

    setOverride: (hostId, patch) => ipcRenderer.invoke('ssh:set-override', hostId, patch),
    deleteOverride: (hostId) => ipcRenderer.invoke('ssh:delete-override', hostId),
    removeKnownHost: (hostname) => ipcRenderer.invoke('ssh:remove-known-host', hostname),

    listForwards: (hostId) => ipcRenderer.invoke('ssh:list-forwards', hostId),
    createForward: (hostId, input) => ipcRenderer.invoke('ssh:create-forward', hostId, input),
    updateForward: (id, patch) => ipcRenderer.invoke('ssh:update-forward', id, patch),
    deleteForward: (id) => ipcRenderer.invoke('ssh:delete-forward', id),

    onSessionData: (callback) => {
        const listener = (_, payload) => callback(payload);
        ipcRenderer.on('ssh:session-data', listener);
        return () => ipcRenderer.removeListener('ssh:session-data', listener);
    },
    onSessionExit: (callback) => {
        const listener = (_, payload) => callback(payload);
        ipcRenderer.on('ssh:session-exit', listener);
        return () => ipcRenderer.removeListener('ssh:session-exit', listener);
    }
});
