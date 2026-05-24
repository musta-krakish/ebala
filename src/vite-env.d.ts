/// <reference types="vite/client" />

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

interface MediaTrack {
    id: string;
    title: string | null;
    artist: string | null;
    album: string | null;
    app: string | null;
    bundleId: string | null;
    pid: number | null;
    artworkUrl?: string | null;
    artworkDataUrl?: string | null;
    duration?: number | null;
    elapsed?: number | null;
    fetchedAt?: number;
    isPlaying: boolean;
    source: 'media-remote' | 'applescript' | 'client-only' | 'none';
}

type MediaAction = 'play-pause' | 'next' | 'previous';

interface MediaHistoryEntry {
    id: number;
    title: string | null;
    artist: string | null;
    album: string | null;
    bundleId: string | null;
    appName: string | null;
    artworkUrl: string | null;
    artworkDataUrl: string | null;
    durationSeconds: number | null;
    listenedSeconds: number;
    startedAt: number;
    endedAt: number | null;
}

interface MediaStats {
    totalListenedSeconds: number;
    uniqueTracks: number;
    uniqueArtists: number;
    topArtists: Array<{ artist: string; totalSeconds: number; plays: number }>;
    topTracks: Array<{ title: string; artist: string | null; totalSeconds: number; plays: number }>;
    last24hSeconds: number;
    last7dSeconds: number;
}

interface MediaArtistGroup {
    artist: string;
    totalSeconds: number;
    totalPlays: number;
    lastPlayedAt: number;
    firstPlayedAt: number;
    tracks: Array<{
        title: string;
        album: string | null;
        artworkUrl: string | null;
        artworkDataUrl: string | null;
        totalSeconds: number;
        totalPlays: number;
        lastPlayedAt: number;
    }>;
}

interface MediaAPI {
    getNowPlaying: () => Promise<MediaTrack[]>;
    control: (action: MediaAction, bundleId?: string | null) => Promise<{ success: boolean; error?: string }>;
    listHistory: (limit?: number) => Promise<MediaHistoryEntry[]>;
    listArtists: (limit?: number) => Promise<MediaArtistGroup[]>;
    getStats: () => Promise<MediaStats>;
    clearHistory: () => Promise<boolean>;
    clearAllStats: () => Promise<boolean>;
}

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

interface SystemAPI {
    getMetrics: () => Promise<SystemMetrics>;
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
}

interface DockerStatus {
    available: boolean;
    version?: string;
    error?: string;
}

interface DockerContainer {
    id: string;
    name: string;
    image: string;
    state: string;
    status: string;
    ports: string;
    command: string;
    createdAt: string;
    size: string;
}

interface DockerImage {
    id: string;
    repository: string;
    tag: string;
    size: string;
    createdSince: string;
}

interface DockerVolume {
    name: string;
    driver: string;
    mountpoint: string;
    scope: string;
}

interface DockerNetwork {
    id: string;
    name: string;
    driver: string;
    scope: string;
}

interface DockerRunOptions {
    image: string;
    name?: string | null;
    detached?: boolean;
    autoRemove?: boolean;
    ports?: Array<{ host: string; container: string }>;
    env?: Array<{ key: string; value: string }>;
    volumes?: Array<{ host: string; container: string }>;
    command?: string | null;
}

interface DockerAPI {
    status: () => Promise<DockerStatus>;
    listContainers: () => Promise<DockerContainer[]>;
    listImages: () => Promise<DockerImage[]>;
    listVolumes: () => Promise<DockerVolume[]>;
    listNetworks: () => Promise<DockerNetwork[]>;

    runImage: (options: DockerRunOptions) => Promise<{ containerId: string }>;
    startContainer: (id: string) => Promise<boolean>;
    stopContainer: (id: string) => Promise<boolean>;
    restartContainer: (id: string) => Promise<boolean>;
    removeContainer: (id: string, force?: boolean) => Promise<boolean>;
    removeImage: (id: string, force?: boolean) => Promise<boolean>;
    removeVolume: (name: string, force?: boolean) => Promise<boolean>;
    removeNetwork: (name: string) => Promise<boolean>;

    pruneContainers: () => Promise<string>;
    pruneImages: (all?: boolean) => Promise<string>;
    pruneVolumes: () => Promise<string>;
    pruneNetworks: () => Promise<string>;
    pruneSystem: (all?: boolean) => Promise<string>;

    getLogs: (id: string, tail?: number) => Promise<string>;
    startExec: (
        containerId: string,
        containerName: string,
        cols: number,
        rows: number
    ) => Promise<{ sessionId: string }>;
}

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
    bluetoothAPI: BluetoothAPI;
    mediaAPI: MediaAPI;
    systemAPI: SystemAPI;
    sshAPI: SshAPI;
    appAPI: AppAPI;
    dockerAPI: DockerAPI;
}
