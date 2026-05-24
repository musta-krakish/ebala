export const formatTime = (seconds?: number | null) => {
    if (seconds === undefined || seconds === null || !Number.isFinite(seconds)) {
        return '--:--';
    }

    const minutes = Math.floor(seconds / 60);
    const rest = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${rest}`;
};

export const formatBytes = (bytes?: number | null) => {
    if (bytes === undefined || bytes === null || !Number.isFinite(bytes)) {
        return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = Math.max(bytes, 0);
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex += 1;
    }

    const digits = value >= 100 || unitIndex === 0 ? 0 : value >= 10 ? 1 : 2;
    return `${value.toFixed(digits)} ${units[unitIndex]}`;
};

export const formatRate = (bytesPerSecond?: number | null) => `${formatBytes(bytesPerSecond)}/s`;

export const formatPercent = (value?: number | null) => `${Math.round(value ?? 0)}%`;

export const formatDuration = (seconds?: number | null) => {
    if (!seconds || !Number.isFinite(seconds) || seconds <= 0) return '0s';
    const totalSeconds = Math.round(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
};

export const formatRelativeTime = (timestamp?: number | null) => {
    if (!timestamp) return '';
    const deltaSec = Math.max(0, (Date.now() - timestamp) / 1000);
    if (deltaSec < 60) return 'just now';
    if (deltaSec < 3600) return `${Math.floor(deltaSec / 60)}m ago`;
    if (deltaSec < 86400) return `${Math.floor(deltaSec / 3600)}h ago`;
    const days = Math.floor(deltaSec / 86400);
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
};
