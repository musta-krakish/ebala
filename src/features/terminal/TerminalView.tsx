import { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { Check, Copy, FolderOpen, Loader, RotateCw, X } from 'lucide-react';
import '@xterm/xterm/css/xterm.css';
import { BlockController, type TermBlock } from './block-controller';
import { Composer } from './Composer';
import { getTheme, type TerminalTheme } from './themes';

interface TerminalViewProps {
    sessionId: string;
    isActive: boolean;
    /** Hide the block-timeline sidebar (e.g. small detached windows). */
    hideSidebar?: boolean;
    /** Active color theme; defaults to Midnight. */
    theme?: TerminalTheme;
    /** Reports the working directory (from OSC 7) as it changes. */
    onCwd?: (cwd: string) => void;
    /** Called when this session's process exits. */
    onExit?: (exitCode: number) => void;
}

function basename(dir?: string): string {
    if (!dir) return '~';
    const parts = dir.replace(/\/+$/, '').split('/');
    return parts[parts.length - 1] || '/';
}

function StatusDot({ status, exitCode }: { status: TermBlock['status']; exitCode?: number }) {
    if (status === 'running') {
        return <Loader className="h-3.5 w-3.5 shrink-0 animate-spin text-amber-400" aria-hidden="true" />;
    }
    if (status === 'success') {
        return <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" aria-hidden="true" />;
    }
    if (status === 'error') {
        return (
            <span className="flex shrink-0 items-center gap-0.5 text-rose-400">
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="text-[10px] font-semibold tabular-nums">{exitCode}</span>
            </span>
        );
    }
    return <span className="h-2 w-2 shrink-0 rounded-full bg-zinc-600" aria-hidden="true" />;
}

/**
 * Live local-shell terminal with Warp-style command blocks. One persistent
 * xterm renders everything (raw \r\n, no convertEol); BlockController parses
 * OSC 133/633/7 into the block timeline shown in the sidebar and the left
 * gutter bars. Typing goes straight into xterm so the shell's own line editor
 * (Ctrl+R, tab-completion, multiline) keeps working.
 */
export function TerminalView({ sessionId, isActive, hideSidebar, theme, onCwd, onExit }: TerminalViewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const termRef = useRef<Terminal | null>(null);
    const fitRef = useRef<FitAddon | null>(null);
    const blocksRef = useRef<BlockController | null>(null);
    const onExitRef = useRef(onExit);
    const onCwdRef = useRef(onCwd);
    useEffect(() => {
        onExitRef.current = onExit;
        onCwdRef.current = onCwd;
    }, [onExit, onCwd]);

    const activeTheme = theme ?? getTheme(null);
    const themeRef = useRef(activeTheme);

    // Apply theme changes to the live terminal without recreating it.
    useEffect(() => {
        themeRef.current = activeTheme;
        if (termRef.current) termRef.current.options.theme = activeTheme.xterm;
    }, [activeTheme]);

    const [blocks, setBlocks] = useState<TermBlock[]>([]);
    const [cwd, setCwd] = useState<string>();

    useEffect(() => {
        if (cwd) onCwdRef.current?.(cwd);
    }, [cwd]);

    useEffect(() => {
        if (!containerRef.current) return;

        const term = new Terminal({
            theme: themeRef.current.xterm,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
            fontSize: 13,
            cursorBlink: true,
            convertEol: false,
            scrollback: 5000
        });
        const fit = new FitAddon();
        term.loadAddon(fit);
        term.open(containerRef.current);

        try {
            fit.fit();
        } catch {
            // container hidden — fit on activation instead
        }

        termRef.current = term;
        fitRef.current = fit;

        const controller = new BlockController(term, () => {
            setBlocks([...controller.getBlocks()]);
            setCwd(controller.cwd);
        });
        blocksRef.current = controller;

        const dataSub = term.onData((data) => {
            window.terminalAPI.write(sessionId, data);
        });

        const unsubData = window.terminalAPI.onData((payload) => {
            if (payload.sessionId === sessionId) {
                term.write(payload.data);
            }
        });

        const unsubExit = window.terminalAPI.onExit((payload) => {
            if (payload.sessionId === sessionId) {
                term.write(`\r\n\x1b[33m[process exited: code ${payload.exitCode}]\x1b[0m\r\n`);
                onExitRef.current?.(payload.exitCode);
            }
        });

        window.terminalAPI.resize(sessionId, term.cols, term.rows);

        const observer = new ResizeObserver(() => {
            if (!fitRef.current) return;
            try {
                fitRef.current.fit();
            } catch {
                return;
            }
            window.terminalAPI.resize(sessionId, term.cols, term.rows);
        });
        observer.observe(containerRef.current);

        return () => {
            observer.disconnect();
            dataSub.dispose();
            unsubData();
            unsubExit();
            controller.dispose();
            term.dispose();
            blocksRef.current = null;
            termRef.current = null;
            fitRef.current = null;
        };
    }, [sessionId]);

    useEffect(() => {
        if (!isActive) return;
        const term = termRef.current;
        const fit = fitRef.current;
        if (!term || !fit) return;

        try {
            fit.fit();
            window.terminalAPI.resize(sessionId, term.cols, term.rows);
            term.focus();
        } catch {
            // ignore
        }
    }, [isActive, sessionId]);

    const rerun = (command: string) => {
        if (!command) return;
        window.terminalAPI.write(sessionId, command + '\r');
        termRef.current?.focus();
    };

    const copy = (text: string) => {
        if (text) void navigator.clipboard?.writeText(text);
    };

    const reversed = [...blocks].reverse();

    return (
        <div className={`h-full w-full ${isActive ? 'flex' : 'hidden'}`}>
            {!hideSidebar && (
            <aside className="flex w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900/60">
                <div className="flex items-center gap-1.5 border-b border-zinc-800 px-3 py-2 text-xs text-zinc-400">
                    <FolderOpen className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden="true" />
                    <span className="truncate font-medium text-zinc-300" title={cwd}>
                        {basename(cwd)}
                    </span>
                    <span className="ml-auto rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
                        {blocks.length}
                    </span>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {reversed.length === 0 ? (
                        <p className="px-3 py-4 text-xs text-zinc-600">
                            Commands appear here as blocks.
                        </p>
                    ) : (
                        <ul className="py-1">
                            {reversed.map((block) => (
                                <li key={block.id}>
                                    <div className="group flex items-start gap-2 px-3 py-1.5 hover:bg-zinc-800/60">
                                        <span className="mt-0.5">
                                            <StatusDot status={block.status} exitCode={block.exitCode} />
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => blocksRef.current?.scrollTo(block.id)}
                                            className="min-w-0 flex-1 text-left"
                                            title="Scroll to this command"
                                        >
                                            <span className="block truncate font-mono text-xs text-zinc-200">
                                                {block.command || <span className="text-zinc-600">(prompt)</span>}
                                            </span>
                                            {block.cwd && (
                                                <span className="block truncate text-[10px] text-zinc-500">
                                                    {basename(block.cwd)}
                                                </span>
                                            )}
                                        </button>
                                        {block.command && (
                                            <span className="flex shrink-0 items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
                                                <button
                                                    type="button"
                                                    onClick={() => copy(block.command)}
                                                    className="rounded p-1 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-200"
                                                    title="Copy command"
                                                >
                                                    <Copy className="h-3 w-3" aria-hidden="true" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => rerun(block.command)}
                                                    className="rounded p-1 text-zinc-500 hover:bg-zinc-700 hover:text-emerald-300"
                                                    title="Run again"
                                                >
                                                    <RotateCw className="h-3 w-3" aria-hidden="true" />
                                                </button>
                                            </span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </aside>
            )}
            <div className="flex min-w-0 flex-1 flex-col">
                <div
                    ref={containerRef}
                    className="min-h-0 flex-1"
                    style={{ backgroundColor: activeTheme.background }}
                />
                <Composer
                    cwd={cwd}
                    onSubmit={(command) => window.terminalAPI.write(sessionId, command + '\r')}
                />
            </div>
        </div>
    );
}
