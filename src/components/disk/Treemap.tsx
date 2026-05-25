import { useEffect, useMemo, useRef, useState } from 'react';
import { formatBytes } from '../../lib/format';
import { squarify, type TreemapRect } from './squarify';

interface TreemapProps {
    children: DiskNode[];
    width: number;
    height: number;
    onActivate?: (node: DiskNode) => void;
}

interface HoverState {
    node: DiskNode;
    rect: TreemapRect;
}

export function Treemap({ children, width, height, onActivate }: TreemapProps) {
    const [hover, setHover] = useState<HoverState | null>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    const items = useMemo(() => {
        // Filter zero/negative-sized entries — they can't render and
        // poison the squarify ratios.
        return children.filter((child) => child.size > 0);
    }, [children]);

    const rects = useMemo(
        () => squarify(items.map((item) => item.size), { x: 0, y: 0, w: width, h: height }),
        [items, width, height]
    );

    useEffect(() => setHover(null), [children]);

    if (items.length === 0) {
        return (
            <div
                className="flex h-full w-full items-center justify-center rounded-md border border-dashed border-zinc-300 text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
                style={{ width, height }}
            >
                No items to show
            </div>
        );
    }

    return (
        <div
            ref={overlayRef}
            className="relative overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-950"
            style={{ width, height }}
            onMouseLeave={() => setHover(null)}
        >
            <svg width={width} height={height} className="block">
                {rects.map((rect, idx) => {
                    const node = items[idx];
                    const fill = colorForNode(node);
                    const labelVisible = rect.w > 60 && rect.h > 24;
                    return (
                        <g key={node.path}>
                            <rect
                                x={rect.x + 0.5}
                                y={rect.y + 0.5}
                                width={Math.max(rect.w - 1, 0)}
                                height={Math.max(rect.h - 1, 0)}
                                fill={fill}
                                stroke="rgba(0,0,0,0.25)"
                                strokeWidth={1}
                                className="transition-opacity hover:opacity-80"
                                style={{ cursor: node.isDir && onActivate ? 'pointer' : 'default' }}
                                onMouseEnter={() => setHover({ node, rect })}
                                onClick={() => {
                                    if (node.isDir && onActivate) onActivate(node);
                                }}
                            />
                            {labelVisible && (
                                <foreignObject
                                    x={rect.x + 4}
                                    y={rect.y + 4}
                                    width={Math.max(rect.w - 8, 0)}
                                    height={Math.max(rect.h - 8, 0)}
                                    pointerEvents="none"
                                >
                                    <div className="flex h-full flex-col overflow-hidden font-medium text-white">
                                        <span
                                            className="truncate text-[11px] leading-tight drop-shadow-sm"
                                            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}
                                        >
                                            {node.name}
                                        </span>
                                        {rect.h > 38 && (
                                            <span
                                                className="text-[10px] leading-tight text-white/90 drop-shadow-sm"
                                                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}
                                            >
                                                {formatBytes(node.size)}
                                            </span>
                                        )}
                                    </div>
                                </foreignObject>
                            )}
                        </g>
                    );
                })}
            </svg>

            {hover && <Tooltip hover={hover} containerWidth={width} containerHeight={height} />}
        </div>
    );
}

function Tooltip({
    hover,
    containerWidth,
    containerHeight
}: {
    hover: HoverState;
    containerWidth: number;
    containerHeight: number;
}) {
    // Position above the hovered rect, snap below if it would clip the top.
    const TOOLTIP_W = 280;
    const TOOLTIP_H = 60;
    const left = clamp(hover.rect.x + hover.rect.w / 2 - TOOLTIP_W / 2, 4, containerWidth - TOOLTIP_W - 4);
    const top =
        hover.rect.y > TOOLTIP_H + 8
            ? hover.rect.y - TOOLTIP_H - 6
            : Math.min(hover.rect.y + hover.rect.h + 6, containerHeight - TOOLTIP_H - 4);
    return (
        <div
            className="pointer-events-none absolute rounded-md border border-zinc-700 bg-zinc-900/95 px-3 py-2 text-xs text-zinc-100 shadow-lg backdrop-blur"
            style={{ left, top, width: TOOLTIP_W }}
        >
            <div className="truncate font-medium" title={hover.node.path}>
                {hover.node.name}
            </div>
            <div className="truncate text-[10px] text-zinc-400" title={hover.node.path}>
                {hover.node.path}
            </div>
            <div className="mt-0.5 text-[11px] text-zinc-300">
                {formatBytes(hover.node.size)} · {hover.node.isDir ? 'folder' : 'files at this level'}
            </div>
        </div>
    );
}

const EXT_COLORS: Record<string, string> = {
    // Stable colours for common extensions, like WinDirStat.
    '.app': '#8b5cf6',
    '.dmg': '#a78bfa',
    '.zip': '#f59e0b',
    '.tar': '#f59e0b',
    '.gz': '#f59e0b',
    '.7z': '#f59e0b',
    '.mp4': '#ef4444',
    '.mov': '#ef4444',
    '.mkv': '#dc2626',
    '.mp3': '#f97316',
    '.flac': '#f97316',
    '.wav': '#f97316',
    '.png': '#10b981',
    '.jpg': '#10b981',
    '.jpeg': '#10b981',
    '.gif': '#22c55e',
    '.heic': '#34d399',
    '.pdf': '#ec4899',
    '.doc': '#3b82f6',
    '.docx': '#3b82f6',
    '.xls': '#22c55e',
    '.xlsx': '#22c55e'
};

function colorForNode(node: DiskNode): string {
    if (node.isDir) return hashColor(node.path, 65, 32);
    const ext = extensionOf(node.path).toLowerCase();
    if (EXT_COLORS[ext]) return EXT_COLORS[ext];
    return hashColor(ext || node.path, 70, 42);
}

function extensionOf(filePath: string): string {
    const base = filePath.split('/').pop() ?? '';
    const dot = base.lastIndexOf('.');
    return dot > 0 ? base.slice(dot) : '';
}

function hashColor(value: string, saturation: number, lightness: number): string {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
        hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
    }
    const hue = hash % 360;
    return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}
