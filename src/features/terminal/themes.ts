import type { ITheme } from '@xterm/xterm';

export interface TerminalTheme {
    id: string;
    label: string;
    /** Background used for the surrounding chrome so it matches the xterm bg. */
    background: string;
    xterm: ITheme;
}

export const TERMINAL_THEMES: TerminalTheme[] = [
    {
        id: 'midnight',
        label: 'Midnight',
        background: '#09090b',
        xterm: {
            background: '#09090b',
            foreground: '#e4e4e7',
            cursor: '#22d3ee',
            selectionBackground: '#27272a'
        }
    },
    {
        id: 'dracula',
        label: 'Dracula',
        background: '#282a36',
        xterm: {
            background: '#282a36',
            foreground: '#f8f8f2',
            cursor: '#f8f8f2',
            selectionBackground: '#44475a',
            black: '#21222c',
            red: '#ff5555',
            green: '#50fa7b',
            yellow: '#f1fa8c',
            blue: '#bd93f9',
            magenta: '#ff79c6',
            cyan: '#8be9fd',
            white: '#f8f8f2',
            brightBlack: '#6272a4',
            brightRed: '#ff6e6e',
            brightGreen: '#69ff94',
            brightYellow: '#ffffa5',
            brightBlue: '#d6acff',
            brightMagenta: '#ff92df',
            brightCyan: '#a4ffff',
            brightWhite: '#ffffff'
        }
    },
    {
        id: 'solarized-dark',
        label: 'Solarized Dark',
        background: '#002b36',
        xterm: {
            background: '#002b36',
            foreground: '#93a1a1',
            cursor: '#93a1a1',
            selectionBackground: '#073642',
            black: '#073642',
            red: '#dc322f',
            green: '#859900',
            yellow: '#b58900',
            blue: '#268bd2',
            magenta: '#d33682',
            cyan: '#2aa198',
            white: '#eee8d5'
        }
    },
    {
        id: 'light',
        label: 'Light',
        background: '#fafafa',
        xterm: {
            background: '#fafafa',
            foreground: '#18181b',
            cursor: '#2563eb',
            selectionBackground: '#e4e4e7',
            black: '#27272a',
            red: '#dc2626',
            green: '#16a34a',
            yellow: '#ca8a04',
            blue: '#2563eb',
            magenta: '#c026d3',
            cyan: '#0891b2',
            white: '#fafafa'
        }
    }
];

export const DEFAULT_THEME_ID = 'midnight';

export function getTheme(id: string | null | undefined): TerminalTheme {
    return TERMINAL_THEMES.find((t) => t.id === id) ?? TERMINAL_THEMES[0];
}
