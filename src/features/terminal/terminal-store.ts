// Module-level session registry that survives Panel unmount/remount. The
// Terminal tab's Panel is only mounted while the tab is active (full-bleed
// layout), so React state would be lost on every tab switch — and the ptys
// would leak. Keeping the session list here lets the Panel restore its tabs and
// re-attach to the still-alive ptys instead of spawning fresh shells.

export interface LocalSession {
    id: string;
    title: string;
    status: 'open' | 'closed';
    exitCode?: number;
    detached?: boolean;
}

let sessions: LocalSession[] = [];
let activeId: string | null = null;
let counter = 0;

export const terminalStore = {
    getSessions: (): LocalSession[] => sessions,
    setSessions: (next: LocalSession[]): void => {
        sessions = next;
    },
    getActiveId: (): string | null => activeId,
    setActiveId: (id: string | null): void => {
        activeId = id;
    },
    nextCounter: (): number => ++counter
};
