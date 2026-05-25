import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { BrowserPane, type DragPayload } from './BrowserPane';
import { TransferQueue } from './TransferQueue';
import { useDirectory } from './useDirectory';
import { useTransfers } from './useTransfers';
import { basename } from './posixPath';

interface FileBrowserProps {
    host: SshHost;
    onBack: () => void;
}

export function FileBrowser({ host, onBack }: FileBrowserProps) {
    const [localHome, setLocalHome] = useState<string>('');
    const [remoteSessionId, setRemoteSessionId] = useState<string | null>(null);
    const [remoteHome, setRemoteHome] = useState<string>('');
    const [connectError, setConnectError] = useState<string | null>(null);
    const [connecting, setConnecting] = useState(true);
    const [localSelected, setLocalSelected] = useState<FileEntry[]>([]);
    const [remoteSelected, setRemoteSelected] = useState<FileEntry[]>([]);
    const transfers = useTransfers();

    useEffect(() => {
        if (typeof window === 'undefined') return;
        let cancelled = false;
        setConnecting(true);
        setConnectError(null);

        Promise.all([
            window.filesAPI.localHome(),
            window.filesAPI.remoteConnect(host)
        ])
            .then(([home, conn]) => {
                if (cancelled) return;
                setLocalHome(home);
                setRemoteSessionId(conn.sessionId);
                setRemoteHome(conn.homePath);
            })
            .catch((err: unknown) => {
                if (!cancelled) {
                    setConnectError(err instanceof Error ? err.message : 'Failed to connect to remote');
                }
            })
            .finally(() => {
                if (!cancelled) setConnecting(false);
            });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [host.id]);

    // Clean up the SFTP session when the user leaves the browser. The
    // dependency list intentionally only touches the session id so we don't
    // re-disconnect on re-renders triggered by selection state.
    useEffect(() => {
        return () => {
            if (remoteSessionId && window.filesAPI) {
                window.filesAPI.remoteDisconnect(remoteSessionId);
            }
        };
    }, [remoteSessionId]);

    const localList = useCallback((dirPath: string) => window.filesAPI.listLocal(dirPath), []);
    const remoteList = useCallback(
        (dirPath: string) => {
            if (!remoteSessionId) return Promise.resolve([] as FileEntry[]);
            return window.filesAPI.listRemote(remoteSessionId, dirPath);
        },
        [remoteSessionId]
    );

    const local = useDirectory(localHome, localList, Boolean(localHome));
    const remote = useDirectory(remoteHome, remoteList, Boolean(remoteSessionId && remoteHome));

    const startTransfer = useCallback(
        async (
            direction: TransferDirection,
            items: FileEntry[],
            targetLocalDir: string,
            targetRemoteDir: string
        ) => {
            if (items.length === 0) return;
            try {
                for (const item of items) {
                    // For each selection we kick off rsync with that item as
                    // source and the opposite pane's directory as the dest.
                    // Trailing slashes are intentional on the destination so
                    // rsync drops files into the directory rather than
                    // renaming a single file to the dest path.
                    const options: TransferOptions = {
                        direction,
                        localPath:
                            direction === 'upload' ? item.path : ensureTrailingSlash(targetLocalDir),
                        remotePath:
                            direction === 'upload'
                                ? ensureTrailingSlash(targetRemoteDir)
                                : item.path
                    };
                    await window.transferAPI.start(host.id, options);
                }
                setLocalSelected([]);
                setRemoteSelected([]);
            } catch (err) {
                setConnectError(err instanceof Error ? err.message : 'Transfer failed to start');
            }
        },
        [host.id]
    );

    const handleDropOnRemote = (payload: DragPayload) => {
        if (payload.sourceSide === 'local') {
            startTransfer('upload', payload.items, local.path, remote.path);
        }
    };

    const handleDropOnLocal = (payload: DragPayload) => {
        if (payload.sourceSide === 'remote') {
            startTransfer('download', payload.items, local.path, remote.path);
        }
    };

    const target = host.user ? `${host.user}@${host.hostname}` : host.hostname;
    const portLabel = host.port && host.port !== 22 ? `:${host.port}` : '';

    return (
        <div className="flex h-[calc(100vh-12rem)] min-h-[500px] flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onBack}
                        className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        Back
                    </button>
                    <div>
                        <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                            Files · {host.alias}
                        </h2>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {target}
                            {portLabel} · rsync over ssh
                        </p>
                    </div>
                </div>
            </div>

            {connectError && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300">
                    {connectError}
                </div>
            )}

            {connecting ? (
                <div className="flex flex-1 items-center justify-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Connecting…
                </div>
            ) : (
                <div className="grid flex-1 min-h-0 grid-cols-1 gap-3 md:grid-cols-2">
                    <BrowserPane
                        title="Local"
                        subtitle="This Mac"
                        side="local"
                        path={local.path}
                        entries={local.entries}
                        loading={local.loading}
                        error={local.error}
                        selected={localSelected}
                        onSelect={setLocalSelected}
                        onNavigate={local.navigate}
                        onRefresh={local.refresh}
                        onHome={() => local.navigate(localHome)}
                        onDrop={handleDropOnLocal}
                        onTransfer={() =>
                            startTransfer('upload', localSelected, local.path, remote.path)
                        }
                        transferLabel={`Upload → ${remote.path}`}
                        transferDisabled={!remoteSessionId}
                    />
                    <BrowserPane
                        title="Remote"
                        subtitle={`${host.alias} · ${truncate(remoteHome, 40)}`}
                        side="remote"
                        path={remote.path}
                        entries={remote.entries}
                        loading={remote.loading}
                        error={remote.error}
                        selected={remoteSelected}
                        onSelect={setRemoteSelected}
                        onNavigate={remote.navigate}
                        onRefresh={remote.refresh}
                        onHome={() => remote.navigate(remoteHome)}
                        onDrop={handleDropOnRemote}
                        onTransfer={() =>
                            startTransfer('download', remoteSelected, local.path, remote.path)
                        }
                        transferLabel={`Download → ${truncate(local.path, 24)}`}
                        transferDisabled={!remoteSessionId}
                    />
                </div>
            )}

            <TransferQueue
                active={transfers.active}
                recent={transfers.recentDone}
                onCancel={(id) => transfers.cancel(id)}
            />
        </div>
    );
}

function ensureTrailingSlash(filePath: string): string {
    return filePath.endsWith('/') ? filePath : `${filePath}/`;
}

function truncate(value: string, max: number): string {
    if (value.length <= max) return value;
    const tail = basename(value);
    return tail.length > max ? `…${tail.slice(-max + 1)}` : `…/${tail}`;
}
