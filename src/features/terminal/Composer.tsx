import { useEffect, useRef, useState } from 'react';
import { CornerDownLeft, FolderGit2, GitBranch } from 'lucide-react';

interface ComposerProps {
    /** Real cwd (used to fetch git/version context). */
    cwd?: string;
    onSubmit: (command: string) => void;
}

/**
 * Warp-style command composer. A context line (cwd · git branch · node/python)
 * over an input where the user "throws in" commands — Enter sends `cmd\n` to the
 * shell. Additive to typing directly in xterm; keeps its own up/down history of
 * submitted commands.
 */
export function Composer({ cwd, onSubmit }: ComposerProps) {
    const [value, setValue] = useState('');
    const [ctx, setCtx] = useState<TerminalContext | null>(null);
    const historyRef = useRef<string[]>([]);
    const navRef = useRef<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!cwd) return;
        let cancelled = false;
        window.terminalAPI
            .context(cwd)
            .then((result) => {
                if (!cancelled) setCtx(result);
            })
            .catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [cwd]);

    const submit = () => {
        const command = value.trim();
        if (!command) return;
        onSubmit(command);
        historyRef.current.push(command);
        navRef.current = null;
        setValue('');
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const history = historyRef.current;
        if (event.key === 'Enter') {
            event.preventDefault();
            submit();
        } else if (event.key === 'ArrowUp') {
            if (history.length === 0) return;
            event.preventDefault();
            const next = navRef.current === null ? history.length - 1 : Math.max(0, navRef.current - 1);
            navRef.current = next;
            setValue(history[next]);
        } else if (event.key === 'ArrowDown') {
            if (navRef.current === null) return;
            event.preventDefault();
            const next = navRef.current + 1;
            if (next >= history.length) {
                navRef.current = null;
                setValue('');
            } else {
                navRef.current = next;
                setValue(history[next]);
            }
        }
    };

    return (
        <div className="shrink-0 border-t border-zinc-800 bg-zinc-900/80 px-3 py-2">
            <div className="mb-1.5 flex items-center gap-2 text-[11px] text-zinc-400">
                {ctx?.node && (
                    <span className="flex items-center gap-1 rounded bg-zinc-800 px-1.5 py-0.5">
                        <span className="text-emerald-400">node</span>
                        <span className="tabular-nums">{ctx.node}</span>
                    </span>
                )}
                {ctx?.python && (
                    <span className="flex items-center gap-1 rounded bg-zinc-800 px-1.5 py-0.5">
                        <span className="text-sky-400">py</span>
                        <span className="tabular-nums">{ctx.python}</span>
                    </span>
                )}
                <span className="flex min-w-0 items-center gap-1">
                    <FolderGit2 className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden="true" />
                    <span className="truncate text-zinc-300" title={ctx?.cwd}>
                        {ctx?.cwd ?? '~'}
                    </span>
                </span>
                {ctx?.gitBranch && (
                    <span className="flex shrink-0 items-center gap-1 text-amber-300/90">
                        <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{ctx.gitBranch}</span>
                        {ctx.gitDirty && <span className="text-rose-400" title="uncommitted changes">±</span>}
                    </span>
                )}
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 focus-within:border-indigo-500">
                <span className="select-none font-mono text-sm text-indigo-400">›</span>
                <input
                    ref={inputRef}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Run a command…"
                    spellCheck={false}
                    autoCapitalize="off"
                    autoCorrect="off"
                    className="min-w-0 flex-1 bg-transparent font-mono text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
                />
                <span className="flex shrink-0 items-center gap-1 text-[10px] text-zinc-600">
                    <CornerDownLeft className="h-3 w-3" aria-hidden="true" />
                    run
                </span>
            </div>
        </div>
    );
}
