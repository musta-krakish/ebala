import { lazy } from 'react';
import { Container } from 'lucide-react';
import type { RendererPlugin } from '../../plugin/renderer-types';

export const dockerPlugin: RendererPlugin = {
    id: 'docker',
    label: 'Docker',
    description: 'Manage containers, images, volumes, networks, and exec into containers.',
    icon: Container,
    Panel: lazy(() => import('./Panel'))
};
