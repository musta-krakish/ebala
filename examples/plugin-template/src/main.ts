// Main-process side of the plugin. The host loads this (dist/main.cjs) and
// calls setup(ctx) once, where ctx = { ipcMain, broadcast }. Register IPC
// handlers here; gate any background work in start()/dispose() (omitted here).

export function createPlugin() {
    return {
        id: 'hello-world',
        setup(ctx: { ipcMain: { handle: (c: string, h: (...a: unknown[]) => unknown) => void; removeHandler: (c: string) => void } }) {
            // removeHandler keeps setup idempotent across reinstalls in one session.
            ctx.ipcMain.removeHandler('hello-world:ping');
            ctx.ipcMain.handle('hello-world:ping', async () => ({ pong: Date.now() }));
        }
    };
}
