import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

interface SshTerminalProps {
    sessionId: string;
    isActive: boolean;
}

export function SshTerminal({ sessionId, isActive }: SshTerminalProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const termRef = useRef<Terminal | null>(null);
    const fitRef = useRef<FitAddon | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const term = new Terminal({
            theme: {
                background: '#09090b',
                foreground: '#e4e4e7',
                cursor: '#22d3ee'
            },
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
            fontSize: 13,
            cursorBlink: true,
            convertEol: true,
            // 5k lines was eating ~3-5 MB per session in long-running shells.
            // 1500 is enough for typical debug scrolling and trims ~70%.
            scrollback: 1500
        });
        const fit = new FitAddon();
        term.loadAddon(fit);
        term.open(containerRef.current);

        try {
            fit.fit();
        } catch {
            // container might be hidden — fit on activation instead
        }

        termRef.current = term;
        fitRef.current = fit;

        const dataSub = term.onData((data) => {
            window.sshAPI.write(sessionId, data);
        });

        const unsubData = window.sshAPI.onSessionData((payload) => {
            if (payload.sessionId === sessionId) {
                term.write(payload.data);
            }
        });

        const unsubExit = window.sshAPI.onSessionExit((payload) => {
            if (payload.sessionId === sessionId) {
                term.write(`\r\n\x1b[33m[session closed: exit ${payload.exitCode}]\x1b[0m\r\n`);
            }
        });

        window.sshAPI.resize(sessionId, term.cols, term.rows);

        const observer = new ResizeObserver(() => {
            if (!fitRef.current) return;
            try {
                fitRef.current.fit();
            } catch {
                return;
            }
            window.sshAPI.resize(sessionId, term.cols, term.rows);
        });
        observer.observe(containerRef.current);

        return () => {
            observer.disconnect();
            dataSub.dispose();
            unsubData();
            unsubExit();
            term.dispose();
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
            window.sshAPI.resize(sessionId, term.cols, term.rows);
            term.focus();
        } catch {
            // ignore
        }
    }, [isActive, sessionId]);

    return (
        <div
            ref={containerRef}
            className={`h-full w-full bg-zinc-950 ${isActive ? 'block' : 'hidden'}`}
        />
    );
}
