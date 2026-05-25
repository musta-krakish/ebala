import { useEffect, useRef, useState } from 'react';
import { Keyboard, X } from 'lucide-react';

interface HotkeyCaptureProps {
    value: string;
    disabled?: boolean;
    onChange: (combo: string) => void;
}

// Map browser KeyboardEvent.key/code to Electron accelerator tokens.
// Electron reference: https://www.electronjs.org/docs/latest/api/accelerator
function normalizeKey(event: KeyboardEvent): string | null {
    const key = event.key;
    if (key === ' ' || event.code === 'Space') return 'Space';
    if (key === 'Escape') return 'Esc';
    if (key === 'Enter') return 'Return';
    if (key === 'Tab') return 'Tab';
    if (key === 'Backspace') return 'Backspace';
    if (key === 'Delete') return 'Delete';
    if (key === 'ArrowUp') return 'Up';
    if (key === 'ArrowDown') return 'Down';
    if (key === 'ArrowLeft') return 'Left';
    if (key === 'ArrowRight') return 'Right';
    if (key === 'Home' || key === 'End' || key === 'PageUp' || key === 'PageDown') return key;
    if (/^F\d{1,2}$/.test(key)) return key;
    if (/^[a-zA-Z]$/.test(key)) return key.toUpperCase();
    if (/^[0-9]$/.test(key)) return key;
    // Punctuation: map common keys to Electron names.
    const punct: Record<string, string> = {
        '`': '`', '~': '~', '-': '-', '_': '_', '=': '=', '+': '+',
        '[': '[', ']': ']', '\\': '\\', ';': ';', "'": "'",
        ',': ',', '.': '.', '/': '/', '?': '?'
    };
    if (punct[key]) return punct[key];
    return null;
}

function displayCombo(combo: string): string {
    // macOS-style symbols for compact display.
    return combo
        .replace(/Cmd|Command|CommandOrControl|CmdOrCtrl/g, '⌘')
        .replace(/Shift/g, '⇧')
        .replace(/Alt|Option/g, '⌥')
        .replace(/Ctrl|Control/g, '⌃')
        .replace(/\+/g, ' ');
}

export function HotkeyCapture({ value, disabled, onChange }: HotkeyCaptureProps) {
    const [capturing, setCapturing] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!capturing) return;
        const handler = (event: KeyboardEvent) => {
            // Ignore lone modifiers — we want at least one non-modifier key.
            if (['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) return;
            event.preventDefault();
            event.stopPropagation();

            if (event.key === 'Escape' && !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey) {
                setCapturing(false);
                return;
            }

            const key = normalizeKey(event);
            if (!key) return;

            const parts: string[] = [];
            if (event.metaKey) parts.push('Cmd');
            if (event.ctrlKey) parts.push('Ctrl');
            if (event.altKey) parts.push('Alt');
            if (event.shiftKey) parts.push('Shift');

            // Require at least one modifier — a global hotkey of just "M"
            // would steal that letter everywhere.
            if (parts.length === 0) return;

            parts.push(key);
            onChange(parts.join('+'));
            setCapturing(false);
        };

        window.addEventListener('keydown', handler, { capture: true });
        return () => window.removeEventListener('keydown', handler, { capture: true });
    }, [capturing, onChange]);

    return (
        <div className="flex items-center gap-2">
            <button
                ref={buttonRef}
                type="button"
                disabled={disabled}
                onClick={() => setCapturing((v) => !v)}
                onBlur={() => setCapturing(false)}
                className={`flex h-9 min-w-40 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium transition disabled:opacity-50 ${
                    capturing
                        ? 'border-indigo-400 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-200 dark:border-indigo-600 dark:bg-indigo-950 dark:text-indigo-100 dark:ring-indigo-900'
                        : 'border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800'
                }`}
            >
                <Keyboard className="h-4 w-4" aria-hidden="true" />
                {capturing ? 'Press keys… (Esc to cancel)' : value ? displayCombo(value) : 'Click to set'}
            </button>
            {value && !capturing && !disabled && (
                <button
                    type="button"
                    onClick={() => onChange('')}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                    title="Clear"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
