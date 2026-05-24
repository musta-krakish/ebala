import { useCallback, useEffect, useState } from 'react';

export function useSshHosts() {
    const [hosts, setHosts] = useState<SshHost[]>([]);
    const [hiddenHosts, setHiddenHosts] = useState<SshHost[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const available = typeof window !== 'undefined' && Boolean(window.sshAPI);

    const load = useCallback(async () => {
        if (!available) return;
        setLoading(true);
        setError(null);
        try {
            const result = await window.sshAPI.listHosts();
            setHosts(result.visible);
            setHiddenHosts(result.hidden);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load SSH hosts');
        } finally {
            setLoading(false);
        }
    }, [available]);

    useEffect(() => {
        if (!available) return;
        load();
    }, [available, load]);

    const setOverride = useCallback(
        async (hostId: string, patch: HostOverridePatch) => {
            await window.sshAPI.setOverride(hostId, patch);
            await load();
        },
        [load]
    );

    const resetOverride = useCallback(
        async (hostId: string) => {
            await window.sshAPI.deleteOverride(hostId);
            await load();
        },
        [load]
    );

    const removeKnownHost = useCallback(
        async (hostname: string) => {
            const result = await window.sshAPI.removeKnownHost(hostname);
            if (result.success) await load();
            return result;
        },
        [load]
    );

    return {
        hosts,
        hiddenHosts,
        loading,
        error,
        refresh: load,
        available,
        setOverride,
        resetOverride,
        removeKnownHost
    };
}
