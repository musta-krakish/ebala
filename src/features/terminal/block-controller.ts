import type { IDecoration, IMarker, Terminal } from '@xterm/xterm';

export type BlockStatus = 'input' | 'running' | 'success' | 'error';

export interface TermBlock {
    id: string;
    command: string;
    cwd?: string;
    status: BlockStatus;
    exitCode?: number;
    startedAt?: number;
    endedAt?: number;
}

const GUTTER_COLOR: Record<BlockStatus, string> = {
    input: '#52525b', // zinc-600
    running: '#f59e0b', // amber-500
    success: '#10b981', // emerald-500
    error: '#f43f5e' // rose-500
};

const MAX_BLOCKS = 200;

/**
 * Parses OSC 133 (semantic prompt) + OSC 633;E (command line) + OSC 7 (cwd) out
 * of a live xterm and turns them into command blocks. Anchors each block to a
 * buffer marker so a left-gutter status bar (via registerDecoration) and
 * scroll-to-block stay aligned across scroll/resize. Reads the marker's live
 * `.line` rather than snapshotting, so reflow on resize stays correct.
 *
 * Robustness: anchors on C/D, treats repeated A as prompt redraw (idempotent),
 * and drops empty prompts that get a D without ever running (e.g. Ctrl+C).
 */
export class BlockController {
    private blocks: TermBlock[] = [];
    private currentId: string | null = null;
    private markers = new Map<string, IMarker>();
    private decorations = new Map<string, IDecoration>();
    private disposers: Array<() => void> = [];
    private idSeq = 0;

    cwd: string | undefined;

    private term: Terminal;
    private onChange: () => void;

    constructor(term: Terminal, onChange: () => void) {
        this.term = term;
        this.onChange = onChange;
        this.register(133, (data) => this.onOsc133(data));
        this.register(633, (data) => this.onOsc633(data));
        this.register(7, (data) => this.onOsc7(data));
    }

    getBlocks(): TermBlock[] {
        return this.blocks;
    }

    scrollTo(id: string): void {
        const marker = this.markers.get(id);
        if (marker && marker.line >= 0) {
            this.term.scrollToLine(Math.max(0, marker.line - 1));
        }
    }

    dispose(): void {
        for (const d of this.disposers) d();
        for (const dec of this.decorations.values()) dec.dispose();
        for (const m of this.markers.values()) m.dispose();
        this.disposers = [];
        this.decorations.clear();
        this.markers.clear();
        this.blocks = [];
        this.currentId = null;
    }

    private register(ident: number, handler: (data: string) => void): void {
        const disposable = this.term.parser.registerOscHandler(ident, (data) => {
            // Never let a parsing/marker error break xterm's write pipeline —
            // a throw here would stall all terminal output.
            try {
                handler(data);
            } catch {
                /* ignore */
            }
            // Consume our private markers so they never leak as visible text.
            return true;
        });
        this.disposers.push(() => disposable.dispose());
    }

    private current(): TermBlock | undefined {
        return this.blocks.find((b) => b.id === this.currentId);
    }

    private onOsc133(data: string): void {
        const [type, arg] = data.split(';');
        if (type === 'A') this.onPromptStart();
        else if (type === 'C') this.onOutputStart();
        else if (type === 'D') this.onDone(arg);
        // 'B' (prompt end) is advisory — ignored.
    }

    private onOsc633(data: string): void {
        // 633;E;<command line>
        if (data.startsWith('E;')) {
            const cmd = data.slice(2);
            const cur = this.current();
            if (cur && cur.status === 'input') {
                cur.command = cmd;
                this.onChange();
            }
        }
    }

    private onOsc7(data: string): void {
        // file://host/path
        const match = /^file:\/\/[^/]*(\/.*)$/.exec(data);
        if (!match) return;
        let dir = match[1];
        try {
            dir = decodeURIComponent(dir);
        } catch {
            /* keep raw */
        }
        this.cwd = dir;
        const cur = this.current();
        if (cur) cur.cwd = dir;
        this.onChange();
    }

    private onPromptStart(): void {
        const cur = this.current();
        // Repeated A with an untouched prompt (redraw, Ctrl+C) → reuse the block.
        if (cur && cur.status === 'input' && !cur.command) {
            this.remark(cur.id);
            this.onChange();
            return;
        }
        const id = `b${++this.idSeq}`;
        const block: TermBlock = { id, command: '', status: 'input', cwd: this.cwd };
        this.blocks.push(block);
        this.currentId = id;
        this.remark(id);

        if (this.blocks.length > MAX_BLOCKS) {
            const removed = this.blocks.splice(0, this.blocks.length - MAX_BLOCKS);
            for (const b of removed) this.dropAnchors(b.id);
        }
        this.onChange();
    }

    private onOutputStart(): void {
        const cur = this.current();
        if (cur && cur.status === 'input') {
            cur.status = 'running';
            cur.startedAt = Date.now();
            this.onChange();
        }
    }

    private onDone(arg: string | undefined): void {
        const cur = this.current();
        if (!cur) return;
        // A D on an empty, never-run prompt = interrupted blank line — drop it.
        if (cur.status === 'input' && !cur.command) {
            this.blocks = this.blocks.filter((b) => b.id !== cur.id);
            this.dropAnchors(cur.id);
            this.currentId = null;
            this.onChange();
            return;
        }
        const code = Number.parseInt(arg ?? '0', 10);
        const exit = Number.isNaN(code) ? 0 : code;
        cur.status = exit === 0 ? 'success' : 'error';
        cur.exitCode = exit;
        cur.endedAt = Date.now();
        this.currentId = null;
        this.onChange();
    }

    /** (Re)anchor a block's marker + gutter decoration at the cursor's line. */
    private remark(id: string): void {
        this.dropAnchors(id);
        const marker = this.term.registerMarker(0);
        if (!marker) return;
        this.markers.set(id, marker);

        const decoration = this.term.registerDecoration({ marker, x: 0, width: 1 });
        if (!decoration) return;
        this.decorations.set(id, decoration);
        decoration.onRender((el) => {
            const block = this.blocks.find((b) => b.id === id);
            el.style.width = '3px';
            el.style.left = '0';
            el.style.height = '100%';
            el.style.backgroundColor = GUTTER_COLOR[block?.status ?? 'input'];
            if (block?.status === 'running') {
                el.style.opacity = '0.9';
                el.style.boxShadow = '0 0 6px #f59e0b';
            } else {
                el.style.boxShadow = 'none';
            }
        });
    }

    private dropAnchors(id: string): void {
        this.decorations.get(id)?.dispose();
        this.markers.get(id)?.dispose();
        this.decorations.delete(id);
        this.markers.delete(id);
    }
}
