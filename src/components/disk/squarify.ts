export interface TreemapRect {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface Scaled {
    idx: number;
    area: number;
}

// Squarified treemap (Bruls/Huijbregts/van Wijk 2000). Packs rectangles
// to minimise the worst aspect ratio across the layout — the WinDirStat
// look-and-feel.
export function squarify(values: number[], rect: TreemapRect): TreemapRect[] {
    const result: TreemapRect[] = new Array(values.length);
    if (values.length === 0) return result;

    const total = values.reduce((sum, value) => sum + value, 0);
    if (total <= 0 || rect.w <= 0 || rect.h <= 0) {
        for (let i = 0; i < values.length; i += 1) {
            result[i] = { x: rect.x, y: rect.y, w: 0, h: 0 };
        }
        return result;
    }

    const scale = (rect.w * rect.h) / total;
    let queue: Scaled[] = values.map((value, idx) => ({ idx, area: value * scale }));

    let remaining = rect;
    while (queue.length > 0) {
        const side = Math.min(remaining.w, remaining.h);
        let row: Scaled[] = [];
        let bestWorst = Infinity;
        let consumed = 0;

        for (let i = 0; i < queue.length; i += 1) {
            const candidate = queue[i];
            const next = row.concat(candidate);
            const w = worst(next, side);
            if (w <= bestWorst || row.length === 0) {
                row = next;
                bestWorst = w;
                consumed = i + 1;
            } else {
                break;
            }
        }

        remaining = placeRow(row, remaining, result);
        queue = queue.slice(consumed);
    }

    return result;
}

function worst(row: Scaled[], side: number): number {
    if (row.length === 0 || side <= 0) return Infinity;
    let sum = 0;
    let max = -Infinity;
    let min = Infinity;
    for (const item of row) {
        sum += item.area;
        if (item.area > max) max = item.area;
        if (item.area < min) min = item.area;
    }
    if (sum <= 0 || min <= 0) return Infinity;
    const sideSq = side * side;
    const sumSq = sum * sum;
    return Math.max((sideSq * max) / sumSq, sumSq / (sideSq * min));
}

function placeRow(row: Scaled[], rect: TreemapRect, result: TreemapRect[]): TreemapRect {
    if (row.length === 0) return rect;
    const sum = row.reduce((acc, item) => acc + item.area, 0);
    const horizontal = rect.w >= rect.h;

    if (horizontal) {
        const stripWidth = sum / rect.h;
        let y = rect.y;
        for (const item of row) {
            const itemHeight = item.area / stripWidth;
            result[item.idx] = { x: rect.x, y, w: stripWidth, h: itemHeight };
            y += itemHeight;
        }
        return { x: rect.x + stripWidth, y: rect.y, w: rect.w - stripWidth, h: rect.h };
    }

    const stripHeight = sum / rect.w;
    let x = rect.x;
    for (const item of row) {
        const itemWidth = item.area / stripHeight;
        result[item.idx] = { x, y: rect.y, w: itemWidth, h: stripHeight };
        x += itemWidth;
    }
    return { x: rect.x, y: rect.y + stripHeight, w: rect.w, h: rect.h - stripHeight };
}
