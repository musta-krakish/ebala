# Control Center plugin template

A minimal plugin: one main-process IPC handler + one renderer tab/panel.

## Structure

```
plugin.json        # manifest (id, name, version, icon, capabilities)
src/main.ts        # exports createPlugin() -> { id, setup(ctx), start?, dispose? }
src/renderer.tsx   # builds a panel and calls runtime.register(...)
src/host-react.ts  # shim: 'react' -> host React instance (shared, so hooks work)
build.mjs          # esbuild -> dist/main.cjs (CJS) + dist/renderer.js (IIFE)
```

## Contract

- **Manifest** (`plugin.json`) is validated before any code runs. Required:
  `id` (lowercase slug), `name`, `version`, and `capabilities` with at least one
  of `main` / `renderer` pointing at the built entry files. `icon` is a
  [lucide](https://lucide.dev) icon name (from the host's curated set).
- **Main entry** must export `createPlugin()` returning `{ id, setup(ctx) }`.
  `ctx = { ipcMain, broadcast }`. Register IPC in `setup`; gate background work
  (monitors, intervals) in `start()` / `dispose()`.
- **Renderer entry** is an IIFE. Grab `globalThis.__PLUGIN_RUNTIME__`:
  - `react` — the host React instance (import `react`; the build aliases it).
  - `register({ id, label, description?, icon?, Panel, useBadge? })` — adds a tab.
  - `invoke(channel, ...args)` / `on(channel, cb)` — reach your main IPC.

## Build & publish

```sh
node build.mjs        # produces dist/
git add -A && git commit -m "build"
```

Push to a git repo, then in Control Center → Settings → Plugins paste the repo
URL (or a local path) and Install.

> ⚠️ Plugins run with full app privileges. There is no sandbox.
