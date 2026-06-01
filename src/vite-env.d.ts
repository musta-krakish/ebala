/// <reference types="vite/client" />

// Bluetooth domain types + window.bluetoothAPI live in
// src/features/bluetooth/types.d.ts. Media domain types + window.mediaAPI live
// in src/features/media/types.d.ts (co-located with each feature).

interface SystemMetrics {
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

interface ListedProcess {
    pid: number;
    ppid: number;
    user: string;
    isOwnUser: boolean;
    cpuPercent: number;
    memoryBytes: number;
    name: string;
    command: string;
    appPath: string | null;
    appName: string | null;
}

interface KillResult {
    success: boolean;
    error?: string;
    code?: string;
}

type KillSignal = 'SIGTERM' | 'SIGKILL' | 'SIGINT' | 'SIGHUP';

interface SystemAPI {
    getMetrics: () => Promise<SystemMetrics>;
    listProcesses: () => Promise<ListedProcess[]>;
    killProcess: (pid: number, signal?: KillSignal) => Promise<KillResult>;
    getAppIcon: (appPath: string) => Promise<string | null>;
}

interface DiskNode {
    name: string;
    path: string;
    size: number;
    isDir: boolean;
    children?: DiskNode[];
}

interface DiskScanProgress {
    bytesSoFar: number;
    pathsSeen: number;
}

interface DiskAPI {
    scan: (rootPath: string, depth?: number) => Promise<DiskNode | null>;
    cancel: () => Promise<boolean>;
    onProgress: (callback: (progress: DiskScanProgress) => void) => () => void;
}

type SshHostSource = 'config' | 'known_hosts' | 'saved';
type SshAuthMethod = 'password' | 'key' | 'agent';

interface SshHost {
    id: string;
    alias: string;
    originalAlias?: string;
    customAlias?: string;
    hostname: string;
    user?: string;
    originalUser?: string;
    port?: number;
    identityFile?: string;
    source: SshHostSource;
    savedId?: number;
    authMethod?: SshAuthMethod;
    color?: string;
    notes?: string;
    hidden?: boolean;
    hasOverridePassword?: boolean;
    forwardCount?: number;
}

interface HostOverridePatch {
    customAlias?: string | null;
    color?: string | null;
    notes?: string | null;
    hidden?: boolean;
    username?: string | null;
    /** undefined = keep; null/'' = clear stored password; '...' = set */
    password?: string | null;
    authMethod?: SshAuthMethod | null;
}

type PortForwardType = 'local' | 'remote';

interface PortForward {
    id: number;
    hostId: string;
    type: PortForwardType;
    bindAddress: string | null;
    bindPort: number;
    targetHost: string;
    targetPort: number;
    label: string | null;
    enabled: boolean;
    createdAt: number;
    updatedAt: number;
}

interface PortForwardInput {
    type: PortForwardType;
    bindAddress?: string | null;
    bindPort: number;
    targetHost: string;
    targetPort: number;
    label?: string | null;
    enabled?: boolean;
}

interface SavedHost {
    id: number;
    label: string;
    hostname: string;
    port: number;
    username: string;
    authMethod: SshAuthMethod;
    hasPassword: boolean;
    identityFile?: string;
    color?: string;
    createdAt: number;
    updatedAt: number;
}

interface SavedHostInput {
    label: string;
    hostname: string;
    port?: number;
    username: string;
    authMethod: SshAuthMethod;
    password?: string | null;
    identityFile?: string | null;
    color?: string | null;
}

interface SshSessionData {
    sessionId: string;
    data: string;
}

interface SshSessionExit {
    sessionId: string;
    exitCode: number;
    signal?: number;
}

interface SshActiveSession {
    sessionId: string;
    host: SshHost;
}

interface AppAPI {
    showMain: () => Promise<boolean>;
    hidePopup: () => Promise<boolean>;
    closeSelf: () => Promise<boolean>;
}

type ThemePreference = 'light' | 'dark' | 'system';

interface PopupSectionSettings {
    showMedia: boolean;
    showBluetooth: boolean;
    showSystem: boolean;
    showSsh: boolean;
    showDocker: boolean;
}

interface HotkeySettings {
    enabled: boolean;
    combo: string;
}

interface HotkeyStatus {
    registered: boolean;
    combo: string | null;
    error: string | null;
}

interface PluginSettings {
    disabled: string[];
}

interface AppSettings {
    theme: ThemePreference;
    popup: PopupSectionSettings;
    hotkey: HotkeySettings;
    plugins: PluginSettings;
}

interface SettingsAPI {
    get: () => Promise<AppSettings>;
    update: (patch: Partial<AppSettings>) => Promise<AppSettings>;
    onChanged: (callback: (settings: AppSettings) => void) => () => void;
}

interface PluginInfo {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    enabled: boolean;
    external: boolean;
    source?: string;
    hasRenderer: boolean;
}

interface PluginInstallResult {
    ok: boolean;
    manifest?: { id: string; name: string; version: string };
    errors?: string[];
}

interface PluginsAPI {
    setEnabled: (id: string, enabled: boolean) => Promise<AppSettings>;
    list: () => Promise<PluginInfo[]>;
    readRenderer: (id: string) => Promise<string | null>;
    install: (gitUrl: string) => Promise<PluginInstallResult>;
    uninstall: (id: string) => Promise<boolean>;
    onChanged: (callback: () => void) => () => void;
}

interface HotkeyAPI {
    status: () => Promise<HotkeyStatus>;
}

type DbTableGroup = 'sshHosts' | 'mediaHistory' | 'mediaStats';

interface DbStats {
    sizeBytes: number;
    path: string;
    groups: Record<DbTableGroup, { rowCount: number; tables: string[] }>;
}

interface DbAPI {
    getStats: () => Promise<DbStats>;
    clearTables: (groups: DbTableGroup[]) => Promise<DbStats>;
}

interface FileEntry {
    name: string;
    path: string;
    isDir: boolean;
    isLink: boolean;
    size: number;
    mtimeMs: number;
}

interface FilesAPI {
    localHome: () => Promise<string>;
    listLocal: (dirPath: string) => Promise<FileEntry[]>;
    remoteConnect: (host: SshHost) => Promise<{ sessionId: string; homePath: string }>;
    listRemote: (sessionId: string, dirPath: string) => Promise<FileEntry[]>;
    remoteDisconnect: (sessionId: string) => Promise<boolean>;
}

type TransferDirection = 'upload' | 'download';

interface TransferOptions {
    direction: TransferDirection;
    localPath: string;
    remotePath: string;
    dryRun?: boolean;
    mirror?: boolean;
    compress?: boolean;
}

interface ActiveTransfer {
    id: string;
    hostId: string;
    hostAlias: string;
    direction: TransferDirection;
    localPath: string;
    remotePath: string;
    options: TransferOptions;
    state: 'running' | 'done' | 'error' | 'cancelled';
    bytesTransferred: number;
    percent: number;
    bytesPerSecond: number;
    eta: string;
    log: string[];
    stderr: string;
    command: string;
    startedAt: number;
    finishedAt?: number;
    exitCode?: number;
    error?: string;
}

interface TransferAPI {
    start: (hostId: string, options: TransferOptions) => Promise<{ transferId: string }>;
    cancel: (transferId: string) => Promise<boolean>;
    list: () => Promise<ActiveTransfer[]>;
    sshpassAvailable: () => Promise<boolean>;
    onProgress: (callback: (transfer: ActiveTransfer) => void) => () => void;
    onDone: (callback: (transfer: ActiveTransfer) => void) => () => void;
}

// Docker domain types + window.dockerAPI live in
// src/features/docker/types.d.ts (co-located with the feature).

interface SshAPI {
    listHosts: () => Promise<{ visible: SshHost[]; hidden: SshHost[] }>;
    listActive: () => Promise<SshActiveSession[]>;
    createSession: (host: SshHost, cols: number, rows: number) => Promise<{ sessionId: string }>;
    write: (sessionId: string, data: string) => Promise<boolean>;
    resize: (sessionId: string, cols: number, rows: number) => Promise<boolean>;
    closeSession: (sessionId: string) => Promise<boolean>;
    detachSession: (
        sessionId: string,
        hostMeta: { alias?: string; user?: string; hostname?: string; port?: number }
    ) => Promise<{ success: boolean }>;

    listSaved: () => Promise<SavedHost[]>;
    createSaved: (input: SavedHostInput) => Promise<SavedHost>;
    updateSaved: (id: number, input: SavedHostInput) => Promise<SavedHost>;
    deleteSaved: (id: number) => Promise<boolean>;
    encryptionAvailable: () => Promise<boolean>;

    setOverride: (hostId: string, patch: HostOverridePatch) => Promise<unknown>;
    deleteOverride: (hostId: string) => Promise<boolean>;
    removeKnownHost: (hostname: string) => Promise<{ success: boolean; error?: string }>;

    listForwards: (hostId: string) => Promise<PortForward[]>;
    createForward: (hostId: string, input: PortForwardInput) => Promise<PortForward>;
    updateForward: (id: number, patch: Partial<PortForwardInput>) => Promise<boolean>;
    deleteForward: (id: number) => Promise<boolean>;

    onSessionData: (callback: (payload: SshSessionData) => void) => () => void;
    onSessionExit: (callback: (payload: SshSessionExit) => void) => () => void;
}

interface Window {
    systemAPI: SystemAPI;
    sshAPI: SshAPI;
    appAPI: AppAPI;
    settingsAPI: SettingsAPI;
    pluginsAPI: PluginsAPI;
    hotkeyAPI: HotkeyAPI;
    dbAPI: DbAPI;
    filesAPI: FilesAPI;
    transferAPI: TransferAPI;
    diskAPI: DiskAPI;
}
