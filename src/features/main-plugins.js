// Active main-process plugins. Add a feature's createXxxPlugin() here as it is
// migrated to the plugin contract; main.js drives setup/start/dispose.
import { createBluetoothPlugin } from './bluetooth/main.ts';
import { createDockerPlugin } from './docker/main.ts';
import { createMediaPlugin } from './media/main.ts';
import { createTerminalPlugin } from './terminal/main.ts';

export const mainPlugins = [
    createBluetoothPlugin(),
    createDockerPlugin(),
    createMediaPlugin(),
    createTerminalPlugin()
];
