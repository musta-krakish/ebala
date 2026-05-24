import { useCallback, useEffect, useMemo, useState } from 'react';

export interface DockerExecTarget {
    id: string;
    name: string;
    image: string;
}

interface BaseSession {
    id: string;
    status: 'open' | 'closed';
    exitCode?: number;
}

export interface SshSshSession extends BaseSession {
    kind: 'ssh';
    host: SshHost;
}

export interface SshExecSession extends BaseSession {
    kind: 'docker-exec';
    container: DockerExecTarget;
}

export type SshSession = SshSshSession | SshExecSession;

export function getSessionLabel(session: SshSession): string {
    return session.kind === 'ssh' ? session.host.alias : session.container.name;
}

export function getSessionSubtitle(session: SshSession): string {
    if (session.kind === 'ssh') {
        const host = session.host;
        return [
            host.user && `${host.user}@`,
            host.hostname,
            host.port && host.port !== 22 ? `:${host.port}` : ''
        ]
            .filter(Boolean)
            .join('');
    }
    return `exec · ${session.container.image}`;
}

export function useSshSessions() {
    const [allSessions, setAllSessions] = useState<SshSession[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [detachedIds, setDetachedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (typeof window === 'undefined' || !window.sshAPI) return;

        const unsubscribe = window.sshAPI.onSessionExit(({ sessionId, exitCode }) => {
            setAllSessions((prev) =>
                prev.map((session) =>
                    session.id === sessionId
                        ? { ...session, status: 'closed', exitCode }
                        : session
                )
            );
            setDetachedIds((prev) => {
                if (!prev.has(sessionId)) return prev;
                const next = new Set(prev);
                next.delete(sessionId);
                return next;
            });
        });

        return unsubscribe;
    }, []);

    const sessions = useMemo(
        () => allSessions.filter((session) => !detachedIds.has(session.id)),
        [allSessions, detachedIds]
    );

    const open = useCallback(async (host: SshHost) => {
        const { sessionId } = await window.sshAPI.createSession(host, 120, 30);
        setAllSessions((prev) => [
            ...prev,
            { id: sessionId, kind: 'ssh', host, status: 'open' }
        ]);
        setActiveId(sessionId);
        return sessionId;
    }, []);

    const openExec = useCallback(async (container: DockerExecTarget) => {
        const { sessionId } = await window.dockerAPI.startExec(
            container.id,
            container.name,
            120,
            30
        );
        setAllSessions((prev) => [
            ...prev,
            { id: sessionId, kind: 'docker-exec', container, status: 'open' }
        ]);
        setActiveId(sessionId);
        return sessionId;
    }, []);

    const close = useCallback(async (sessionId: string) => {
        try {
            await window.sshAPI.closeSession(sessionId);
        } catch {
            // ignore
        }
        setAllSessions((prev) => {
            const next = prev.filter((session) => session.id !== sessionId);
            setActiveId((current) =>
                current === sessionId ? next[next.length - 1]?.id ?? null : current
            );
            return next;
        });
        setDetachedIds((prev) => {
            if (!prev.has(sessionId)) return prev;
            const next = new Set(prev);
            next.delete(sessionId);
            return next;
        });
    }, []);

    const detach = useCallback(async (sessionId: string) => {
        const session = allSessions.find((item) => item.id === sessionId);
        if (!session || session.kind !== 'ssh') return;

        await window.sshAPI.detachSession(sessionId, {
            alias: session.host.alias,
            user: session.host.user,
            hostname: session.host.hostname,
            port: session.host.port
        });

        setDetachedIds((prev) => {
            const next = new Set(prev);
            next.add(sessionId);
            return next;
        });
        setActiveId((current) => {
            if (current !== sessionId) return current;
            const remaining = allSessions.filter(
                (item) => item.id !== sessionId && !detachedIds.has(item.id)
            );
            return remaining[remaining.length - 1]?.id ?? null;
        });
    }, [allSessions, detachedIds]);

    return { sessions, activeId, setActiveId, open, openExec, close, detach };
}
