import { DockerManager } from './docker-manager.ts';
import { registerTerminalBackend } from '../../plugin/terminal-router.ts';
import type { MainPlugin, MainPluginContext } from '../../plugin/main-types.ts';

export function createDockerPlugin(): MainPlugin {
    const docker = new DockerManager();

    return {
        id: 'docker',

        setup(ctx: MainPluginContext) {
            const { ipcMain } = ctx;

            // Docker exec sessions ride the shared SSH terminal channels so the
            // renderer's xterm pipeline handles them like any other session.
            docker.on('exec-data', (payload) => ctx.broadcast('ssh:session-data', payload));
            docker.on('exec-exit', (payload) => ctx.broadcast('ssh:session-exit', payload));

            // Let the shared ssh:write/resize/close handlers route exec I/O here.
            registerTerminalBackend({
                owns: (id) => docker.ownsExec(id),
                write: (id, data) => docker.writeExec(id, data),
                resize: (id, cols, rows) => docker.resizeExec(id, cols, rows),
                close: (id) => docker.closeExec(id)
            });

            ipcMain.handle('docker:status', async () => docker.isAvailable());
            ipcMain.handle('docker:list-containers', async () => docker.listContainers());
            ipcMain.handle('docker:list-images', async () => docker.listImages());
            ipcMain.handle('docker:list-volumes', async () => docker.listVolumes());
            ipcMain.handle('docker:list-networks', async () => docker.listNetworks());

            ipcMain.handle('docker:run-image', async (_event, options) => docker.runImage(options));
            ipcMain.handle('docker:start-container', async (_event, id) => {
                await docker.startContainer(id);
                return true;
            });
            ipcMain.handle('docker:stop-container', async (_event, id) => {
                await docker.stopContainer(id);
                return true;
            });
            ipcMain.handle('docker:restart-container', async (_event, id) => {
                await docker.restartContainer(id);
                return true;
            });
            ipcMain.handle('docker:remove-container', async (_event, id, force) => {
                await docker.removeContainer(id, Boolean(force));
                return true;
            });
            ipcMain.handle('docker:remove-image', async (_event, id, force) => {
                await docker.removeImage(id, Boolean(force));
                return true;
            });
            ipcMain.handle('docker:remove-volume', async (_event, name, force) => {
                await docker.removeVolume(name, Boolean(force));
                return true;
            });
            ipcMain.handle('docker:remove-network', async (_event, name) => {
                await docker.removeNetwork(name);
                return true;
            });

            ipcMain.handle('docker:prune-containers', async () => docker.pruneContainers());
            ipcMain.handle('docker:prune-images', async (_event, all) => docker.pruneImages(Boolean(all)));
            ipcMain.handle('docker:prune-volumes', async () => docker.pruneVolumes());
            ipcMain.handle('docker:prune-networks', async () => docker.pruneNetworks());
            ipcMain.handle('docker:prune-system', async (_event, all) => docker.pruneSystem(Boolean(all)));

            ipcMain.handle('docker:logs', async (_event, id, tail) =>
                docker.getLogs(id, typeof tail === 'number' ? tail : 500)
            );
            ipcMain.handle('docker:exec-start', async (_event, containerId, containerName, cols, rows) =>
                docker.startExec(containerId, containerName, cols, rows)
            );
        },

        dispose() {
            docker.dispose();
        }
    };
}
