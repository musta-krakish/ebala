import { MediaManager } from './media-manager.ts';
import { MediaTracker } from './media-tracker.ts';
import {
    clearAllStats,
    clearHistory,
    getStats,
    listArtistGroups,
    listHistory,
    purgeOldHistory
} from './media-history.ts';
import type { MainPlugin, MainPluginContext } from '../../plugin/main-types.ts';

export function createMediaPlugin(): MainPlugin {
    // Kept alive for the app's lifetime so now-playing/control IPC still works
    // for the popup window even when the Media tab/plugin is disabled. Only the
    // background history tracker is gated by the plugin lifecycle.
    const media = new MediaManager();
    const tracker = new MediaTracker(media);

    return {
        id: 'media',

        setup(ctx: MainPluginContext) {
            const { ipcMain } = ctx;

            ipcMain.handle('media:get-now-playing', async () => media.getAllNowPlaying());
            ipcMain.handle('media:control', async (_event, action, bundleId) => media.control(action, bundleId));
            ipcMain.handle('media:list-history', async (_event, limit) =>
                listHistory(typeof limit === 'number' ? limit : 50)
            );
            ipcMain.handle('media:stats', async () => getStats());
            ipcMain.handle('media:clear-history', async () => {
                await clearHistory();
                return true;
            });
            ipcMain.handle('media:clear-all-stats', async () => {
                await clearAllStats();
                return true;
            });
            ipcMain.handle('media:list-artists', async (_event, limit) =>
                listArtistGroups(typeof limit === 'number' ? limit : 30)
            );
        },

        async start() {
            // Drop track entries older than the retention window before the
            // tracker begins appending new play records.
            await purgeOldHistory();
            tracker.start();
        },

        async dispose() {
            await tracker.stop();
        }
    };
}
