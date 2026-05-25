import { useEffect, useReducer } from 'react';

interface DiskScanState {
    root: DiskNode | null;
    rootPath: string;
    loading: boolean;
    error: string | null;
    progressPaths: number;
    progressBytes: number;
    currentPath: string;
}

// Module-level store: scan progress and result persist across tab
// switches and remounts of DiskUsagePanel. The IPC call to the main
// process continues regardless of which renderer view is mounted —
// keeping React state out of the component makes that survive.
let state: DiskScanState = {
    root: null,
    rootPath: '',
    loading: false,
    error: null,
    progressPaths: 0,
    progressBytes: 0,
    currentPath: ''
};

const listeners = new Set<() => void>();
let progressSubscribed = false;

function setState(patch: Partial<DiskScanState>): void {
    state = { ...state, ...patch };
    for (const listener of listeners) listener();
}

function ensureProgressSubscription(): void {
    if (progressSubscribed) return;
    if (typeof window === 'undefined' || !window.diskAPI) return;
    progressSubscribed = true;
    window.diskAPI.onProgress((payload) => {
        setState({ progressPaths: payload.pathsSeen, progressBytes: payload.bytesSoFar });
    });
}

export async function startDiskScan(requestedRoot: string = '/'): Promise<void> {
    if (typeof window === 'undefined' || !window.diskAPI) return;
    ensureProgressSubscription();
    setState({
        loading: true,
        error: null,
        progressPaths: 0,
        progressBytes: 0
    });
    try {
        const root = await window.diskAPI.scan(requestedRoot, 4);
        if (!root) {
            // Pre-empted by a newer scan call or cancelled by the user.
            // We don't surface this as an error — the newer call will own
            // the next state transition.
            return;
        }
        setState({
            root,
            rootPath: root.path,
            currentPath: root.path,
            loading: false,
            error: null
        });
    } catch (err) {
        setState({
            loading: false,
            error: err instanceof Error ? err.message : 'Scan failed'
        });
    }
}

export async function cancelDiskScan(): Promise<void> {
    if (typeof window === 'undefined' || !window.diskAPI) return;
    await window.diskAPI.cancel();
    // Don't set an error — the user explicitly clicked Cancel, so just
    // drop the loading state. The in-flight scan promise will resolve
    // with null and be ignored by startDiskScan().
    setState({ loading: false });
}

export function setDiskCurrentPath(targetPath: string): void {
    setState({ currentPath: targetPath });
}

export function clearDiskError(): void {
    setState({ error: null });
}

export function useDiskScan(): DiskScanState {
    const [, forceUpdate] = useReducer((x: number) => x + 1, 0);
    useEffect(() => {
        ensureProgressSubscription();
        listeners.add(forceUpdate);
        return () => {
            listeners.delete(forceUpdate);
        };
    }, []);
    return state;
}
