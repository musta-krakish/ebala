import type { RendererPlugin } from '../plugin/renderer-types';
import { bluetoothPlugin } from './bluetooth/plugin';
import { dockerPlugin } from './docker/plugin';
import { mediaPlugin } from './media/plugin';

// Renderer plugins drive their tab + lazy-loaded panel in ControlCenter.
// Features still hardcoded in ControlCenter's legacy switch are migrated here
// one at a time.
export const rendererPlugins: RendererPlugin[] = [bluetoothPlugin, dockerPlugin, mediaPlugin];
