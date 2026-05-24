import { useCallback, useEffect, useState } from 'react';

export function useSavedHosts() {
    const [savedHosts, setSavedHosts] = useState<SavedHost[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [encryptionAvailable, setEncryptionAvailable] = useState(true);

    const refresh = useCallback(async () => {
        if (typeof window === 'undefined' || !window.sshAPI) return;
        setLoading(true);
        setError(null);
        try {
            const [list, available] = await Promise.all([
                window.sshAPI.listSaved(),
                window.sshAPI.encryptionAvailable()
            ]);
            setSavedHosts(list);
            setEncryptionAvailable(available);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load saved hosts');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const create = useCallback(async (input: SavedHostInput) => {
        const created = await window.sshAPI.createSaved(input);
        setSavedHosts((prev) => [...prev, created].sort((a, b) => a.label.localeCompare(b.label)));
        return created;
    }, []);

    const update = useCallback(async (id: number, input: SavedHostInput) => {
        const updated = await window.sshAPI.updateSaved(id, input);
        setSavedHosts((prev) =>
            prev
                .map((host) => (host.id === id ? updated : host))
                .sort((a, b) => a.label.localeCompare(b.label))
        );
        return updated;
    }, []);

    const remove = useCallback(async (id: number) => {
        await window.sshAPI.deleteSaved(id);
        setSavedHosts((prev) => prev.filter((host) => host.id !== id));
    }, []);

    return { savedHosts, loading, error, encryptionAvailable, refresh, create, update, remove };
}
