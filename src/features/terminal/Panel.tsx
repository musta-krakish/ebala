import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    PanelRightClose,
    PanelRightOpen,
    Plus,
    SquareArrowOutUpRight,
    SquareTerminal,
    X
} from 'lucide-react';
import { TerminalView } from './TerminalView';
import { CommandPalette, type PaletteCommand } from './CommandPalette';
import { terminalStore, type LocalSession } from './terminal-store';
import { DEFAULT_THEME_ID, TERMINAL_THEMES, getTheme } from './themes';

const BLOCKS_KEY = 'ebala.terminal.showBlocks';
const THEME_KEY = 'ebala.terminal.theme';

function basename(dir?: string): string {
    if (!dir) return '';
    const parts = dir.replace(/\/+$/, '').split('/');
    return parts[parts.length - 1] || '/';
}

export default function TerminalPanel() {
    const [sessions, setSessions] = useState<LocalSession[]>(() => terminalStore.getSessions());
    const [activeId, setActiveId] = useState<string | null>(() => terminalStore.getActiveId());
    const [showBlocks, setShowBlocks] = useState<boolean>(
        () => localStorage.getItem(BLOCKS_KEY) !== '0'
    );
    const [themeId, setThemeId] = useState<string>(
        () => localStorage.getItem(THEME_KEY) ?? DEFAULT_THEME_ID
    );
    const [paletteOpen, setPaletteOpen] = useState(false);
    const [cwds, setCwds] = useState<Record<string, string>>({});
    const bootstrappedRef = useRef(false);

    const reportCwd = useCallback((id: string, cwd: string) => {
        setCwds((prev) => (prev[id] === cwd ? prev : { ...prev, [id]: cwd }));
    }, []);

    const theme = getTheme(themeId);

    // Persist session list + selection across tab-switch remounts and to localStorage.
    useEffect(() => {
        terminalStore.setSessions(sessions);
    }, [sessions]);
    useEffect(() => {
        terminalStore.setActiveId(activeId);
    }, [activeId]);
    useEffect(() => {
        localStorage.setItem(BLOCKS_KEY, showBlocks ? '1' : '0');
    }, [showBlocks]);
    useEffect(() => {
        localStorage.setItem(THEME_KEY, themeId);
    }, [themeId]);

    const open = useCallback(async (cwd?: string) => {
        const { sessionId } = await window.terminalAPI.spawn(cwd ? { cwd } : {});
        const title = `shell ${terminalStore.nextCounter()}`;
        setSessions((prev) => [...prev, { id: sessionId, title, status: 'open' }]);
        if (cwd) setCwds((prev) => ({ ...prev, [sessionId]: cwd }));
        setActiveId(sessionId);
        return sessionId;
    }, []);

    const close = useCallback(async (sessionId: string) => {
        await window.terminalAPI.close(sessionId);
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        setActiveId((cur) => (cur === sessionId ? null : cur));
    }, []);

    const detach = useCallback(async (session: LocalSession, title?: string) => {
        await window.terminalAPI.detach(session.id, { title: title || session.title });
        setSessions((prev) => prev.map((s) => (s.id === session.id ? { ...s, detached: true } : s)));
        setActiveId((cur) => (cur === session.id ? null : cur));
    }, []);

    // Restore tabs on remount; only spawn a shell when there are genuinely none.
    useEffect(() => {
        if (bootstrappedRef.current) return;
        bootstrappedRef.current = true;
        // Spawning a shell is an external side effect, not render-derived state.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (terminalStore.getSessions().length === 0) void open();
    }, [open]);

    useEffect(() => {
        const unsub = window.terminalAPI.onExit(({ sessionId, exitCode }) => {
            setSessions((prev) => {
                const session = prev.find((s) => s.id === sessionId);
                if (session?.detached) return prev.filter((s) => s.id !== sessionId);
                return prev.map((s) => (s.id === sessionId ? { ...s, status: 'closed', exitCode } : s));
            });
        });
        return unsub;
    }, []);

    const visibleSessions = useMemo(() => sessions.filter((s) => !s.detached), [sessions]);

    const effectiveActiveId = visibleSessions.some((s) => s.id === activeId)
        ? activeId
        : (visibleSessions[0]?.id ?? null);
    const activeCwd = effectiveActiveId ? cwds[effectiveActiveId] : undefined;

    // Latest nav state for the global key handler (synced without re-binding).
    const navRef = useRef({ visible: visibleSessions, activeId: effectiveActiveId, cwds });
    useEffect(() => {
        navRef.current = { visible: visibleSessions, activeId: effectiveActiveId, cwds };
    });

    // Open a new terminal in the active terminal's current directory.
    const openHere = useCallback(() => {
        const { activeId: id, cwds: dirs } = navRef.current;
        return open(id ? dirs[id] : undefined);
    }, [open]);

    const switchRelative = useCallback((delta: number) => {
        const { visible, activeId: current } = navRef.current;
        if (visible.length < 2) return;
        const idx = Math.max(0, visible.findIndex((s) => s.id === current));
        const next = (idx + delta + visible.length) % visible.length;
        setActiveId(visible[next].id);
    }, []);

    const paletteOpenRef = useRef(paletteOpen);
    useEffect(() => {
        paletteOpenRef.current = paletteOpen;
    }, [paletteOpen]);

    // Global shortcuts on the Terminal tab.
    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            const mod = event.metaKey || event.ctrlKey;
            if (!mod) return;
            const key = event.key.toLowerCase();
            if (key === 'k') {
                event.preventDefault();
                setPaletteOpen((v) => !v);
                return;
            }
            if (paletteOpenRef.current) return; // palette owns keys while open
            const digit = Number(event.key);
            if (Number.isInteger(digit) && digit >= 1 && digit <= 9) {
                event.preventDefault();
                const target = navRef.current.visible[digit - 1];
                if (target) setActiveId(target.id);
                return;
            }
            if (key === 't') {
                event.preventDefault();
                void openHere();
            } else if (key === 'i') {
                event.preventDefault();
                switchRelative(event.shiftKey ? -1 : 1);
            } else if (key === 'b') {
                event.preventDefault();
                setShowBlocks((v) => !v);
            }
        };
        window.addEventListener('keydown', onKey, true);
        return () => window.removeEventListener('keydown', onKey, true);
    }, [openHere, switchRelative]);

    const commands: PaletteCommand[] = useMemo(() => {
        const list: PaletteCommand[] = [
            { id: 'new', section: 'Terminal', label: 'New terminal', hint: '⌘T', run: () => void open(activeCwd) },
            {
                id: 'toggle-blocks',
                section: 'Terminal',
                label: showBlocks ? 'Hide command history' : 'Show command history',
                hint: '⌘B',
                run: () => setShowBlocks((v) => !v)
            }
        ];
        if (visibleSessions.length > 1) {
            const idx = Math.max(0, visibleSessions.findIndex((s) => s.id === effectiveActiveId));
            const len = visibleSessions.length;
            const nextId = visibleSessions[(idx + 1) % len].id;
            const prevId = visibleSessions[(idx - 1 + len) % len].id;
            list.push(
                { id: 'next', section: 'Terminal', label: 'Next terminal', hint: '⌘I', run: () => setActiveId(nextId) },
                { id: 'prev', section: 'Terminal', label: 'Previous terminal', hint: '⌘⇧I', run: () => setActiveId(prevId) }
            );
        }
        if (effectiveActiveId) {
            const current = visibleSessions.find((s) => s.id === effectiveActiveId);
            if (current) {
                list.push(
                    { id: 'detach', section: 'Terminal', label: `Detach ${current.title}`, run: () => void detach(current) },
                    { id: 'close', section: 'Terminal', label: `Close ${current.title}`, run: () => void close(current.id) }
                );
            }
        }
        visibleSessions.forEach((session, i) => {
            list.push({
                id: `switch-${session.id}`,
                section: 'Switch to',
                label: session.title,
                hint: i < 9 ? `⌘${i + 1}` : undefined,
                active: session.id === effectiveActiveId,
                run: () => setActiveId(session.id)
            });
        });
        for (const t of TERMINAL_THEMES) {
            list.push({
                id: `theme-${t.id}`,
                section: 'Theme',
                label: t.label,
                active: t.id === themeId,
                run: () => setThemeId(t.id)
            });
        }
        return list;
    }, [open, activeCwd, close, detach, visibleSessions, effectiveActiveId, showBlocks, themeId]);

    return (
        <div className="flex h-full w-full flex-col overflow-hidden bg-zinc-950">
            <div className="flex items-center gap-1 border-b border-zinc-800 bg-zinc-900 px-2 py-1.5">
                <div className="flex flex-1 items-center gap-1 overflow-x-auto">
                    {visibleSessions.map((session, i) => {
                        const active = session.id === effectiveActiveId;
                        const dir = basename(cwds[session.id]);
                        const display = dir || session.title;
                        return (
                            <div
                                key={session.id}
                                className={`group flex shrink-0 items-center gap-2 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                                    active
                                        ? 'bg-zinc-800 text-zinc-100'
                                        : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                                }`}
                            >
                                <button
                                    type="button"
                                    className="flex items-center gap-1.5"
                                    onClick={() => setActiveId(session.id)}
                                    title={cwds[session.id] ?? session.title}
                                >
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${
                                            session.status === 'open' ? 'bg-emerald-500' : 'bg-zinc-600'
                                        }`}
                                    />
                                    {i < 9 && (
                                        <span className="text-[10px] tabular-nums text-zinc-500">⌘{i + 1}</span>
                                    )}
                                    <SquareTerminal className="h-3.5 w-3.5" aria-hidden="true" />
                                    {display}
                                    {session.status === 'closed' && (
                                        <span className="text-[10px] text-zinc-500">
                                            exit {session.exitCode ?? 0}
                                        </span>
                                    )}
                                </button>
                                {session.status === 'open' && (
                                    <button
                                        type="button"
                                        className="rounded p-0.5 text-zinc-500 opacity-0 transition hover:bg-zinc-700 hover:text-zinc-200 group-hover:opacity-100"
                                        onClick={() => void detach(session, display)}
                                        title="Open in separate window"
                                        aria-label={`Detach ${session.title}`}
                                    >
                                        <SquareArrowOutUpRight className="h-3 w-3" aria-hidden="true" />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="rounded p-0.5 text-zinc-500 opacity-0 transition hover:bg-zinc-700 hover:text-zinc-200 group-hover:opacity-100"
                                    onClick={() => void close(session.id)}
                                    title="Close terminal"
                                    aria-label={`Close ${session.title}`}
                                >
                                    <X className="h-3 w-3" aria-hidden="true" />
                                </button>
                            </div>
                        );
                    })}
                </div>
                <button
                    type="button"
                    className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100"
                    onClick={() => setShowBlocks((v) => !v)}
                    title={showBlocks ? 'Hide command history (⌘B)' : 'Show command history (⌘B)'}
                >
                    {showBlocks ? (
                        <PanelRightOpen className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                        <PanelRightClose className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                </button>
                <button
                    type="button"
                    className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
                    onClick={() => void open(activeCwd)}
                    title="New terminal in current directory (⌘T)"
                >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    New
                    <span className="ml-0.5 rounded bg-zinc-800 px-1 text-[10px] text-zinc-500">⌘T</span>
                </button>
            </div>

            <div className="relative min-h-0 flex-1">
                {visibleSessions.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-sm text-zinc-500">
                        <p>No terminals open.</p>
                        <button
                            type="button"
                            onClick={() => void open()}
                            className="flex items-center gap-1.5 rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
                        >
                            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                            New terminal
                        </button>
                    </div>
                ) : (
                    visibleSessions.map((session) => (
                        <div key={session.id} className="absolute inset-0">
                            <TerminalView
                                sessionId={session.id}
                                isActive={session.id === effectiveActiveId}
                                hideSidebar={!showBlocks}
                                theme={theme}
                                onCwd={(cwd) => reportCwd(session.id, cwd)}
                            />
                        </div>
                    ))
                )}

                {paletteOpen && (
                    <CommandPalette commands={commands} onClose={() => setPaletteOpen(false)} />
                )}
            </div>
        </div>
    );
}
