import React, { useEffect, useRef, useSyncExternalStore } from 'react';
import type { ComponentType } from 'react';
import {
    Activity,
    Bell,
    Box,
    Cloud,
    Code,
    Database,
    Globe,
    Heart,
    Package,
    Plug,
    Puzzle,
    Star,
    Terminal,
    Wrench,
    Zap,
    type LucideIcon
} from 'lucide-react';
import type { RendererPlugin } from './renderer-types';

// Curated icon set external plugins can name in their manifest. Keeping it
// small avoids bundling all of lucide; unknown names fall back to Puzzle.
const ICONS: Record<string, LucideIcon> = {
    Activity, Bell, Box, Cloud, Code, Database, Globe, Heart, Package, Plug, Puzzle, Star, Terminal, Wrench, Zap
};

// Shape an external IIFE passes to register(). Panel/useBadge use the host's
// React instance (exposed below), so hooks share one React.
interface ExternalPluginDef {
    id: string;
    label: string;
    description?: string;
    icon?: string;
    Panel: ComponentType;
    useBadge?: () => number | undefined;
}

let externals: RendererPlugin[] = [];
const listeners = new Set<() => void>();

function emit() {
    for (const listener of listeners) listener();
}

function normalize(def: ExternalPluginDef): RendererPlugin {
    return {
        id: def.id,
        label: def.label,
        description: def.description,
        icon: (def.icon && ICONS[def.icon]) || Puzzle,
        Panel: def.Panel,
        useBadge: def.useBadge
    };
}

function register(def: ExternalPluginDef) {
    if (!def || typeof def.id !== 'string' || typeof def.Panel !== 'function') {
        console.error('[plugin] register() called with an invalid definition', def);
        return;
    }
    externals = [...externals.filter((plugin) => plugin.id !== def.id), normalize(def)];
    emit();
}

export function removeExternalPlugin(id: string) {
    externals = externals.filter((plugin) => plugin.id !== id);
    emit();
}

function getSnapshot() {
    return externals;
}

function subscribe(callback: () => void) {
    listeners.add(callback);
    return () => listeners.delete(callback);
}

export function useExternalPlugins(): RendererPlugin[] {
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

interface PluginBridge {
    invoke: (channel: string, ...args: unknown[]) => Promise<unknown>;
    on: (channel: string, callback: (payload: unknown) => void) => () => void;
}

declare global {
    interface Window {
        pluginBridge?: PluginBridge;
        __PLUGIN_RUNTIME__?: {
            react: typeof React;
            register: (def: ExternalPluginDef) => void;
            invoke: PluginBridge['invoke'];
            on: PluginBridge['on'];
            version: number;
        };
    }
}

// Expose the host runtime so external IIFE bundles can grab React, register a
// panel, and reach their own main-process IPC handlers.
if (typeof window !== 'undefined' && !window.__PLUGIN_RUNTIME__) {
    const bridge = window.pluginBridge;
    window.__PLUGIN_RUNTIME__ = {
        react: React,
        register,
        invoke: (channel, ...args) => bridge?.invoke(channel, ...args) ?? Promise.resolve(undefined),
        on: (channel, cb) => bridge?.on(channel, cb) ?? (() => undefined),
        version: 1
    };
}

function injectExternalRenderer(id: string, code: string) {
    const el = document.createElement('script');
    el.dataset.plugin = id;
    el.textContent = `${code}\n//# sourceURL=plugin-${id}.js`;
    document.head.appendChild(el);
}

// Fetches the installed-plugin list, injects each renderer IIFE once, and drops
// uninstalled ones from the store. Enable/disable is handled by tab filtering,
// not by unloading, so the code only ever loads once per install.
export function useExternalPluginLoader() {
    const loaded = useRef(new Set<string>());

    useEffect(() => {
        const api = typeof window !== 'undefined' ? window.pluginsAPI : undefined;
        if (!api) return;
        let cancelled = false;

        const sync = async () => {
            let infos: PluginInfo[];
            try {
                infos = await api.list();
            } catch {
                return;
            }
            if (cancelled) return;

            const present = new Set(infos.map((info) => info.id));
            for (const id of [...loaded.current]) {
                if (!present.has(id)) {
                    loaded.current.delete(id);
                    removeExternalPlugin(id);
                }
            }

            for (const info of infos) {
                if (!info.hasRenderer || loaded.current.has(info.id)) continue;
                loaded.current.add(info.id);
                try {
                    const code = await api.readRenderer(info.id);
                    if (code) injectExternalRenderer(info.id, code);
                    else loaded.current.delete(info.id);
                } catch {
                    loaded.current.delete(info.id);
                }
            }
        };

        sync();
        const off = api.onChanged(sync);
        return () => {
            cancelled = true;
            off();
        };
    }, []);
}
