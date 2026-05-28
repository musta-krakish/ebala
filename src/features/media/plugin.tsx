import { lazy } from 'react';
import { Music2 } from 'lucide-react';
import type { RendererPlugin } from '../../plugin/renderer-types';

export const mediaPlugin: RendererPlugin = {
    id: 'media',
    label: 'Media',
    description: 'Now playing, playback controls, and listening history.',
    icon: Music2,
    Panel: lazy(() => import('./Panel'))
};
