// Main-process plugin lifecycle manager. Owns the active plugin list + the
// shared context, and gates start()/dispose() by the user's enabled selection
// so a disabled plugin fully stops (no background monitors). Kept as plain JS
// so main.js imports it without type-stripping concerns.

let plugins = [];
let ctx = null;
const started = new Set();

export function initPluginManager(initial, context) {
    plugins = [...initial];
    ctx = context;
    // Handlers are cheap and the renderer guards unavailable APIs, so register
    // them for every plugin up front; start() is what gets gated.
    for (const plugin of plugins) {
        plugin.setup(ctx);
    }
}

// Reconcile running plugins against the disabled set: start newly-enabled ones,
// dispose newly-disabled ones. Safe to call repeatedly (idempotent).
export function applyEnabled(disabled) {
    const off = new Set(disabled);
    for (const plugin of plugins) {
        const enabled = !off.has(plugin.id);
        if (enabled && !started.has(plugin.id)) {
            started.add(plugin.id);
            plugin.start?.();
        } else if (!enabled && started.has(plugin.id)) {
            started.delete(plugin.id);
            plugin.dispose?.();
        }
    }
}

export async function disposeAllPlugins() {
    for (const plugin of plugins) {
        if (started.has(plugin.id)) {
            started.delete(plugin.id);
            await plugin.dispose?.();
        }
    }
}

// Register an external plugin discovered/installed at runtime. setup() runs now
// (cheap); the caller drives start() via applyEnabled().
export function registerPlugin(plugin) {
    plugins.push(plugin);
    plugin.setup(ctx);
}

export async function unregisterPlugin(id) {
    const idx = plugins.findIndex((plugin) => plugin.id === id);
    if (idx === -1) return;
    if (started.has(id)) {
        started.delete(id);
        await plugins[idx].dispose?.();
    }
    plugins.splice(idx, 1);
}

