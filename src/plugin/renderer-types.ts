import type { ComponentType, LazyExoticComponent } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface RendererPlugin {
    id: string;
    label: string;
    description?: string;
    icon: LucideIcon;
    // Built-in panels are lazy() (own bundle chunk, mount on tab open). External
    // plugins register a plain component, so accept either.
    Panel: ComponentType | LazyExoticComponent<ComponentType>;
    // Optional lightweight tab-badge count. Lives in the shell and stays
    // mounted regardless of the active tab, so it must be cheap (a single
    // subscription / one-shot fetch — not the full feature hook).
    useBadge?: () => number | undefined;
}
