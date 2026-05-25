import { useCallback, useEffect, useState } from 'react';

const DEFAULTS: AppSettings = {
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

export function useAppSettings() {
    const [settings, setSettings] = useState<AppSettings>(DEFAULTS);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined' || !window.settingsAPI) {
            setReady(true);
            return;
        }
        let cancelled = false;
        window.settingsAPI.get().then((next) => {
            if (!cancelled) {
                setSettings(next);
                setReady(true);
            }
        });
        const off = window.settingsAPI.onChanged((next) => setSettings(next));
        return () => {
            cancelled = true;
            off();
        };
    }, []);

    const update = useCallback(async (patch: Partial<AppSettings>) => {
        if (typeof window === 'undefined' || !window.settingsAPI) return;
        const next = await window.settingsAPI.update(patch);
        setSettings(next);
    }, []);

    return { settings, update, ready };
}
