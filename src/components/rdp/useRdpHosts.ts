import { useCallback, useEffect, useRef, useState } from 'react';

export interface RdpFailure {
    label: string;
    summary: string;
    stderr: string;
}

export function useRdpHosts() {
    const [hosts, setHosts] = useState<RdpHost[]>([]);
    const [activeSessions, setActiveSessions] = useState<ActiveRdpSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [failure, setFailure] = useState<RdpFailure | null>(null);
    const [availability, setAvailability] = useState<{ available: boolean; binary: string | null } | null>(null);

    const available = typeof window !== 'undefined' && Boolean(window.rdpAPI);
    // The session-exit listener is set up once; keep a live ref to hosts so
    // labels resolve against the latest list, not the one captured at mount.
    const hostsRef = useRef<RdpHost[]>([]);
    hostsRef.current = hosts;

    const refresh = useCallback(async () => {
        if (!available) return;
        setLoading(true);
        try {
            const [list, active, avail] = await Promise.all([
                window.rdpAPI.list(),
                window.rdpAPI.listActive(),
                window.rdpAPI.available()
            ]);
            setHosts(list);
            setActiveSessions(active);
            setAvailability(avail);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load RDP hosts');
        } finally {
            setLoading(false);
        }
    }, [available]);

    useEffect(() => {
        if (!available) return;
        refresh();
        const offActive = window.rdpAPI.onActiveChanged((sessions) => setActiveSessions(sessions));
        const offExit = window.rdpAPI.onSessionExit((payload) => {
            const label = hostsRef.current.find((h) => h.id === payload.hostId)?.label ?? `Host ${payload.hostId}`;
            if (payload.error) {
                setFailure({
                    label,
                    summary: `Failed to launch: ${payload.error}`,
                    stderr: payload.stderr ?? ''
                });
            } else if (typeof payload.exitCode === 'number' && payload.exitCode !== 0) {
                setFailure({
                    label,
                    summary: `xfreerdp exited with code ${payload.exitCode}`,
                    stderr: payload.stderr ?? ''
                });
            }
        });
        return () => {
            offActive();
            offExit();
        };
    }, [available, refresh]);

    const create = async (input: RdpHostInput) => {
        await window.rdpAPI.create(input);
        await refresh();
    };

    const update = async (id: number, input: RdpHostInput) => {
        await window.rdpAPI.update(id, input);
        await refresh();
    };

    const remove = async (id: number) => {
        await window.rdpAPI.remove(id);
        await refresh();
    };

    const connect = async (hostId: number) => {
        try {
            await window.rdpAPI.connect(hostId);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to launch RDP');
        }
    };

    const disconnect = (sessionId: string) => window.rdpAPI.disconnect(sessionId);

    return {
        available,
        availability,
        hosts,
        activeSessions,
        loading,
        error,
        failure,
        clearError: () => setError(null),
        clearFailure: () => setFailure(null),
        refresh,
        create,
        update,
        remove,
        connect,
        disconnect
    };
}
