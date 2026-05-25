// Tiny path helpers shared between local and remote panes — both are
// POSIX-style on macOS, so a single set of utilities is fine.
export function parentPath(filePath: string): string {
    if (!filePath || filePath === '/') return '/';
    const trimmed = filePath.replace(/\/+$/, '');
    const idx = trimmed.lastIndexOf('/');
    if (idx <= 0) return '/';
    return trimmed.slice(0, idx);
}

export function splitSegments(filePath: string): string[] {
    if (!filePath || filePath === '/') return [];
    return filePath.split('/').filter(Boolean);
}

export function joinSegments(segments: string[]): string {
    if (segments.length === 0) return '/';
    return '/' + segments.join('/');
}

export function basename(filePath: string): string {
    const trimmed = filePath.replace(/\/+$/, '');
    const idx = trimmed.lastIndexOf('/');
    return idx >= 0 ? trimmed.slice(idx + 1) : trimmed;
}
