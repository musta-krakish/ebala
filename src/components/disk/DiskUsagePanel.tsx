import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, ChevronRight, HardDrive, Loader2, Play, RefreshCw, X } from 'lucide-react';
import { formatBytes } from '../../lib/format';
import { Treemap } from './Treemap';
import {
    cancelDiskScan,
    clearDiskError,
    setDiskCurrentPath,
    startDiskScan,
    useDiskScan
} from './useDiskScan';

function findNode(tree: DiskNode, targetPath: string): DiskNode | null {
    if (tree.path === targetPath) return tree;
    if (!tree.children) return null;
    for (const child of tree.children) {
        if (!targetPath.startsWith(child.path)) continue;
        const found = findNode(child, targetPath);
        if (found) return found;
    }
    return null;
}

function buildBreadcrumb(root: DiskNode, target: string): DiskNode[] {
    const trail: DiskNode[] = [];
    const walk = (node: DiskNode): boolean => {
        trail.push(node);
        if (node.path === target) return true;
        if (node.children) {
            for (const child of node.children) {
                if (target === child.path || target.startsWith(child.path + '/')) {
                    if (walk(child)) return true;
                }
            }
        }
        trail.pop();
        return false;
    };
    walk(root);
    return trail;
}

export function DiskUsagePanel() {
    const state = useDiskScan();
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 0, height: 480 });

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const update = () => {
            setSize({
                width: el.clientWidth,
                height: Math.max(360, Math.min(720, Math.round(el.clientWidth * 0.55)))
            });
        };
        update();
        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const { root, loading, error, progressPaths, progressBytes, currentPath } = state;
    const activeNode = root ? findNode(root, currentPath) : null;
    const breadcrumb = root && activeNode ? buildBreadcrumb(root, activeNode.path) : [];

    return (
        <section className="pb-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Disk usage
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Treemap of folder sizes. Click a tile to drill in. Scan runs in the background — you can switch tabs.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {!root && !loading && (
                        <button
                            type="button"
                            onClick={() => startDiskScan('/')}
                            className="inline-flex h-9 items-center gap-2 rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700"
                        >
                            <Play className="h-4 w-4" aria-hidden="true" />
                            Scan disk
                        </button>
                    )}
                    {root && !loading && (
                        <button
                            type="button"
                            onClick={() => startDiskScan('/')}
                            className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                            title="Rescan"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Rescan
                        </button>
                    )}
                    {loading && (
                        <button
                            type="button"
                            onClick={() => cancelDiskScan()}
                            className="inline-flex h-9 items-center gap-2 rounded-md border border-rose-200 bg-white px-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50 dark:border-rose-900 dark:bg-zinc-900 dark:text-rose-300 dark:hover:bg-rose-950"
                        >
                            <X className="h-4 w-4" aria-hidden="true" />
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            {loading && progressPaths > 0 && (
                <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs text-indigo-800 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-200">
                    <span className="flex items-center gap-2">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                        Scanning… {progressPaths.toLocaleString()} folders · {formatBytes(progressBytes)}
                    </span>
                </div>
            )}

            {breadcrumb.length > 0 && (
                <div className="mb-3 flex flex-wrap items-center gap-1 text-xs">
                    {breadcrumb.map((node, idx) => {
                        const isLast = idx === breadcrumb.length - 1;
                        return (
                            <span key={node.path} className="flex items-center gap-1">
                                <button
                                    type="button"
                                    disabled={isLast}
                                    onClick={() => setDiskCurrentPath(node.path)}
                                    className={`rounded px-1.5 py-0.5 transition ${
                                        isLast
                                            ? 'font-semibold text-zinc-900 dark:text-zinc-100'
                                            : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                                    }`}
                                    title={node.path}
                                >
                                    {node.name}
                                </button>
                                {!isLast && <ChevronRight className="h-3 w-3 text-zinc-300 dark:text-zinc-700" />}
                            </span>
                        );
                    })}
                    {activeNode && (
                        <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                            {formatBytes(activeNode.size)}
                        </span>
                    )}
                </div>
            )}

            {error && (
                <div className="mb-3 flex items-center justify-between gap-3 rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                    <span className="flex items-center gap-2">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {error}
                    </span>
                    <button
                        type="button"
                        onClick={clearDiskError}
                        className="rounded p-0.5 hover:bg-rose-100 dark:hover:bg-rose-900"
                        aria-label="Dismiss"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </div>
            )}

            <div ref={containerRef} className="w-full">
                {loading && !root ? (
                    <div
                        className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-zinc-300 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
                        style={{ height: size.height }}
                    >
                        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                        <div className="text-zinc-600 dark:text-zinc-300 tabular-nums">
                            {progressPaths > 0
                                ? `${progressPaths.toLocaleString()} folders · ${formatBytes(progressBytes)} scanned`
                                : 'Starting…'}
                        </div>
                        <span className="text-[11px] text-zinc-400">
                            Switch tabs freely — the scan keeps running in the background.
                        </span>
                    </div>
                ) : !root ? (
                    <div
                        className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-zinc-300 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
                        style={{ height: size.height }}
                    >
                        <HardDrive className="h-6 w-6" aria-hidden="true" />
                        Press <strong>Scan disk</strong> to build the treemap.
                    </div>
                ) : activeNode && activeNode.children && activeNode.children.length > 0 ? (
                    <Treemap
                        children={activeNode.children}
                        width={size.width}
                        height={size.height}
                        onActivate={(node) => {
                            if (node.isDir) setDiskCurrentPath(node.path);
                        }}
                    />
                ) : (
                    <div
                        className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-zinc-300 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
                        style={{ height: size.height }}
                    >
                        This folder has no enumerated subfolders — try the parent or rescan.
                    </div>
                )}
            </div>
        </section>
    );
}
