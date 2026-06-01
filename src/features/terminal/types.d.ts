// Ambient (no import/export) so these stay global and augment `interface Window`,
// mirroring src/features/docker/types.d.ts.

interface TerminalSpawnOptions {
    shell?: string;
    cwd?: string;
    cols?: number;
    rows?: number;
}

interface TerminalDataPayload {
    sessionId: string;
    data: string;
}

interface TerminalExitPayload {
    sessionId: string;
    exitCode: number;
    signal?: number;
}

interface TerminalDetachMeta {
    title?: string;
    cwd?: string;
}

interface TerminalContext {
    cwd: string;
    gitBranch?: string;
    gitDirty?: boolean;
    node?: string;
    python?: string;
}

interface TerminalAPI {
    spawn: (options?: TerminalSpawnOptions) => Promise<{ sessionId: string }>;
    write: (sessionId: string, data: string) => Promise<boolean>;
    resize: (sessionId: string, cols: number, rows: number) => Promise<boolean>;
    close: (sessionId: string) => Promise<boolean>;
    detach: (sessionId: string, meta?: TerminalDetachMeta) => Promise<boolean>;
    context: (cwd: string) => Promise<TerminalContext>;
    onData: (callback: (payload: TerminalDataPayload) => void) => () => void;
    onExit: (callback: (payload: TerminalExitPayload) => void) => () => void;
}

interface Window {
    terminalAPI: TerminalAPI;
}
