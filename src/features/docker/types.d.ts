// Ambient (no import/export) so these stay global, and the `interface Window`
// block merges with the central one in vite-env.d.ts.

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

interface Window {
    dockerAPI: DockerAPI;
}
