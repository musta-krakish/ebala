import { lazy } from 'react';
import { SquareTerminal } from 'lucide-react';
import type { RendererPlugin } from '../../plugin/renderer-types';

export const terminalPlugin: RendererPlugin = {
    id: 'terminal',
    label: 'Terminal',
    description: 'Local shell terminal with command blocks (Warp-like, no AI).',
    icon: SquareTerminal,
    Panel: lazy(() => import('./Panel'))
};
