// Registry of terminal "backends" that can own a session id and handle its
// write/resize/close. SSH is the default (handled directly in main.js); plugins
// like Docker exec register a backend here so the shared ssh:* IPC handlers can
// route to them without main.js referencing the plugin's manager.

export interface TerminalBackend {
    owns: (sessionId: string) => boolean;
    write: (sessionId: string, data: string) => unknown;
    resize: (sessionId: string, cols: number, rows: number) => unknown;
    close: (sessionId: string) => unknown;
}

const backends: TerminalBackend[] = [];

export function registerTerminalBackend(backend: TerminalBackend): () => void {
    backends.push(backend);
    return () => {
        const i = backends.indexOf(backend);
        if (i >= 0) backends.splice(i, 1);
    };
}

export function isRouted(sessionId: string): boolean {
    return backends.some((backend) => backend.owns(sessionId));
}

export function routeTerminal(action: 'write' | 'resize' | 'close', sessionId: string, ...args: unknown[]): unknown {
    const backend = backends.find((b) => b.owns(sessionId));
    if (!backend) return undefined;
    const fn = backend[action] as (id: string, ...rest: unknown[]) => unknown;
    return fn(sessionId, ...args);
}
