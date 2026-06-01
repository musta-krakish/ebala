import { TerminalManager, type SpawnOptions } from './terminal-manager.ts';
import { getTerminalContext } from './terminal-context.ts';
import { registerTerminalBackend } from '../../plugin/terminal-router.ts';
import type { MainPlugin, MainPluginContext } from '../../plugin/main-types.ts';

export function createTerminalPlugin(): MainPlugin {
    const terminal = new TerminalManager();

    return {
        id: 'terminal',

        setup(ctx: MainPluginContext) {
            const { ipcMain } = ctx;

            // Data/exit ride dedicated terminal:* channels (raw stream the
            // renderer parses for OSC blocks).
            terminal.on('data', (payload) => ctx.broadcast('terminal:data', payload));
            terminal.on('exit', (payload) => ctx.broadcast('terminal:exit', payload));

            // Register with the shared terminal-router purely so main.js can
            // close a session by id (e.g. when a detached window closes) without
            // importing this plugin's manager. write/resize go via terminal:*.
            registerTerminalBackend({
                owns: (id) => terminal.owns(id),
                write: (id, data) => terminal.write(id, data),
                resize: (id, cols, rows) => terminal.resize(id, cols, rows),
                close: (id) => terminal.close(id)
            });

            ipcMain.handle('terminal:spawn', async (_event, options: SpawnOptions) =>
                terminal.spawn(options ?? {})
            );
            ipcMain.handle('terminal:write', async (_event, sessionId, data) =>
                terminal.write(sessionId, data)
            );
            ipcMain.handle('terminal:resize', async (_event, sessionId, cols, rows) =>
                terminal.resize(sessionId, cols, rows)
            );
            ipcMain.handle('terminal:close', async (_event, sessionId) =>
                terminal.close(sessionId)
            );
            ipcMain.handle('terminal:context', async (_event, cwd: string) =>
                getTerminalContext(cwd)
            );
        },

        dispose() {
            terminal.dispose();
        }
    };
}
