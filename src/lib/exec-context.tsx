import { createContext, useContext, type ReactNode } from 'react';

export interface ExecTarget {
    id: string;
    name: string;
    image: string;
}

interface ExecApi {
    openExec: (target: ExecTarget) => void;
}

// Lets a feature panel (e.g. Docker) open a terminal exec session in the shared
// SSH terminal drawer without importing the shell's session manager directly.
const ExecContext = createContext<ExecApi | null>(null);

export function ExecProvider({ value, children }: { value: ExecApi; children: ReactNode }) {
    return <ExecContext.Provider value={value}>{children}</ExecContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useExec(): ExecApi | null {
    return useContext(ExecContext);
}
