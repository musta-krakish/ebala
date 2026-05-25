import { existsSync, mkdirSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { app } from 'electron';

export type ThemePreference = 'light' | 'dark' | 'system';

export interface PopupSectionSettings {
    showMedia: boolean;
    showBluetooth: boolean;
    showSystem: boolean;
    showSsh: boolean;
    showDocker: boolean;
}

export interface HotkeySettings {
    enabled: boolean;
    combo: string;
}

export interface AppSettings {
    theme: ThemePreference;
    popup: PopupSectionSettings;
    hotkey: HotkeySettings;
}

const SETTINGS_FILENAME = 'app-settings.json';

const DEFAULT_SETTINGS: AppSettings = {
    theme: 'system',
    popup: {
        showMedia: true,
        showBluetooth: true,
        showSystem: true,
        showSsh: true,
        showDocker: true
    },
    hotkey: {
        enabled: true,
        combo: 'Cmd+Shift+M'
    }
};

let cached: AppSettings | null = null;
let writeQueue: Promise<void> = Promise.resolve();

function settingsPath(): string {
    const userData = app.getPath('userData');
    if (!existsSync(userData)) mkdirSync(userData, { recursive: true });
    return path.join(userData, SETTINGS_FILENAME);
}

function mergeWithDefaults(partial: Partial<AppSettings> | undefined | null): AppSettings {
    return {
        theme: partial?.theme ?? DEFAULT_SETTINGS.theme,
        popup: { ...DEFAULT_SETTINGS.popup, ...(partial?.popup ?? {}) },
        hotkey: { ...DEFAULT_SETTINGS.hotkey, ...(partial?.hotkey ?? {}) }
    };
}

export async function loadSettings(): Promise<AppSettings> {
    if (cached) return cached;
    const file = settingsPath();
    if (!existsSync(file)) {
        cached = { ...DEFAULT_SETTINGS, popup: { ...DEFAULT_SETTINGS.popup } };
        return cached;
    }
    try {
        const raw = await readFile(file, 'utf8');
        cached = mergeWithDefaults(JSON.parse(raw));
        return cached;
    } catch {
        cached = { ...DEFAULT_SETTINGS, popup: { ...DEFAULT_SETTINGS.popup } };
        return cached;
    }
}

export function getSettings(): AppSettings {
    if (!cached) {
        // First sync access before async load — return defaults; the renderer
        // will overwrite once loadSettings resolves.
        return { ...DEFAULT_SETTINGS, popup: { ...DEFAULT_SETTINGS.popup } };
    }
    return cached;
}

export async function updateSettings(patch: Partial<AppSettings>): Promise<AppSettings> {
    const current = await loadSettings();
    const next: AppSettings = {
        theme: patch.theme ?? current.theme,
        popup: { ...current.popup, ...(patch.popup ?? {}) },
        hotkey: { ...current.hotkey, ...(patch.hotkey ?? {}) }
    };
    cached = next;
    const file = settingsPath();
    writeQueue = writeQueue.then(() => writeFile(file, JSON.stringify(next, null, 2)));
    await writeQueue;
    return next;
}
