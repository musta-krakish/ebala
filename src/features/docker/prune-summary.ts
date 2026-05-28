// Turn docker's verbose prune output (lists of sha256s) into a single line.
// Native `window.alert` becomes unreadable when system-prune deletes dozens
// of images.

const countSection = (text: string, header: string): number => {
    const re = new RegExp(`^Deleted ${header}:\\n([\\s\\S]*?)(?=\\n\\n|\\nDeleted|\\nTotal|$)`, 'm');
    const match = text.match(re);
    if (!match) return 0;
    return match[1].split('\n').filter((line) => line.trim().length > 0).length;
};

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;

export function summarizePruneOutput(raw: string): string {
    const text = raw.trim();
    if (!text) return 'Nothing to remove';

    const reclaimedMatch = text.match(/Total reclaimed space:\s*(.+)/i);
    const reclaimed = reclaimedMatch?.[1]?.trim();

    const parts: string[] = [];

    const containers = countSection(text, 'Containers');
    if (containers > 0) parts.push(plural(containers, 'container'));

    const networks = countSection(text, 'Networks');
    if (networks > 0) parts.push(plural(networks, 'network'));

    const volumes = countSection(text, 'Volumes');
    if (volumes > 0) parts.push(plural(volumes, 'volume'));

    // For images: "untagged:" lines represent each image tag removed.
    // Fall back to counting sha256 layers if no untagged entries (rare).
    const untaggedCount = (text.match(/^untagged:/gm) || []).length;
    if (untaggedCount > 0) {
        parts.push(plural(untaggedCount, 'image'));
    } else {
        const layerCount = (text.match(/^deleted: sha256:/gm) || []).length;
        if (layerCount > 0) parts.push(plural(layerCount, 'layer'));
    }

    const segments: string[] = [];
    if (parts.length > 0) segments.push(`Removed ${parts.join(', ')}`);
    if (reclaimed) segments.push(`reclaimed ${reclaimed}`);

    return segments.join(' · ') || 'Done';
}
