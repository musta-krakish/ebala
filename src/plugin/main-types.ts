import type { IpcMain } from 'electron';

export interface MainPluginContext {
    ipcMain: IpcMain;
    broadcast: (channel: string, payload?: unknown) => void;
}

export interface MainPlugin {
    id: string;
    // Register IPC handlers. Runs before windows load; capture ctx here for
    // later use in start().
    setup(ctx: MainPluginContext): void;
    // Async initialization (spawn monitors, open connections). Fire-and-forget
    // by the host, so handlers must tolerate being called before this resolves.
    start?(): void | Promise<void>;
    // Cleanup on app quit.
    dispose?(): void | Promise<void>;
}
