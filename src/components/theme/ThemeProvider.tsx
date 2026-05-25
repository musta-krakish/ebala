import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
    theme: ThemePreference;
    resolved: ResolvedTheme;
    toggle: () => void;
    setTheme: (theme: ThemePreference) => void;
}

const STORAGE_KEY = 'ebala:theme';
const ThemeContext = createContext<ThemeContextValue | null>(null);

const getStoredTheme = (): ThemePreference => {
    if (typeof window === 'undefined') return 'system';
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
    return 'system';
};

const getSystemDark = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<ThemePreference>(getStoredTheme);
    const [systemDark, setSystemDark] = useState<boolean>(getSystemDark);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (event: MediaQueryListEvent) => setSystemDark(event.matches);
        media.addEventListener('change', handler);
        return () => media.removeEventListener('change', handler);
    }, []);

    // Settings file is canonical across BrowserWindows; localStorage above
    // just avoids a flash on first paint.
    useEffect(() => {
        if (typeof window === 'undefined' || !window.settingsAPI) return;
        let cancelled = false;
        window.settingsAPI.get().then((next) => {
            if (cancelled) return;
            if (next.theme !== theme) {
                setThemeState(next.theme);
                window.localStorage.setItem(STORAGE_KEY, next.theme);
            }
        });
        const off = window.settingsAPI.onChanged((next) => {
            setThemeState(next.theme);
            window.localStorage.setItem(STORAGE_KEY, next.theme);
        });
        return () => {
            cancelled = true;
            off();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const resolved: ResolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle('dark', resolved === 'dark');
        root.style.colorScheme = resolved;
    }, [resolved]);

    const setTheme = useCallback((next: ThemePreference) => {
        setThemeState(next);
        window.localStorage.setItem(STORAGE_KEY, next);
        window.settingsAPI?.update({ theme: next });
    }, []);

    const toggle = useCallback(() => {
        // Header button cycles light ↔ dark only — picking 'system' is the
        // settings panel's job, otherwise toggle would be ambiguous.
        setThemeState((prev) => {
            const resolvedPrev: ResolvedTheme = prev === 'system' ? (getSystemDark() ? 'dark' : 'light') : prev;
            const next: ThemePreference = resolvedPrev === 'dark' ? 'light' : 'dark';
            window.localStorage.setItem(STORAGE_KEY, next);
            window.settingsAPI?.update({ theme: next });
            return next;
        });
    }, []);

    const value = useMemo(
        () => ({ theme, resolved, toggle, setTheme }),
        [theme, resolved, toggle, setTheme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
    return ctx;
}
