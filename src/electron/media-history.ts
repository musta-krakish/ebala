import type { BindParams } from 'sql.js';
import { getDb, persist } from './db.ts';

export interface MediaHistoryEntry {
    id: number;
    title: string | null;
    artist: string | null;
    album: string | null;
    bundleId: string | null;
    appName: string | null;
    artworkUrl: string | null;
    artworkDataUrl: string | null;
    durationSeconds: number | null;
    listenedSeconds: number;
    startedAt: number;
    endedAt: number | null;
}

export interface MediaHistoryInput {
    title: string | null;
    artist: string | null;
    album: string | null;
    bundleId: string | null;
    appName: string | null;
    artworkUrl: string | null;
    artworkDataUrl: string | null;
    durationSeconds: number | null;
    startedAt: number;
}

export interface MediaStats {
    totalListenedSeconds: number;
    uniqueTracks: number;
    uniqueArtists: number;
    topArtists: Array<{ artist: string; totalSeconds: number; plays: number }>;
    topTracks: Array<{ title: string; artist: string | null; totalSeconds: number; plays: number }>;
    last24hSeconds: number;
    last7dSeconds: number;
}

export interface MediaArtistGroup {
    artist: string;
    totalSeconds: number;
    totalPlays: number;
    lastPlayedAt: number;
    firstPlayedAt: number;
    tracks: Array<{
        title: string;
        album: string | null;
        artworkUrl: string | null;
        artworkDataUrl: string | null;
        totalSeconds: number;
        totalPlays: number;
        lastPlayedAt: number;
    }>;
}

interface Row {
    id: number;
    title: string | null;
    artist: string | null;
    album: string | null;
    bundle_id: string | null;
    app_name: string | null;
    artwork_url: string | null;
    artwork_data_url: string | null;
    duration_seconds: number | null;
    listened_seconds: number;
    started_at: number;
    ended_at: number | null;
}

const rowToEntry = (row: Row): MediaHistoryEntry => ({
    id: row.id,
    title: row.title,
    artist: row.artist,
    album: row.album,
    bundleId: row.bundle_id,
    appName: row.app_name,
    artworkUrl: row.artwork_url,
    artworkDataUrl: row.artwork_data_url,
    durationSeconds: row.duration_seconds,
    listenedSeconds: row.listened_seconds,
    startedAt: row.started_at,
    endedAt: row.ended_at
});

const queryRows = <T = Row>(sql: string, params: BindParams = []): T[] => {
    const db = getDb();
    const stmt = db.prepare(sql);
    try {
        stmt.bind(params);
        const out: T[] = [];
        while (stmt.step()) {
            out.push(stmt.getAsObject() as unknown as T);
        }
        return out;
    } finally {
        stmt.free();
    }
};

const MINIMUM_LISTENED_SECONDS_TO_KEEP = 5;
const HISTORY_RETENTION_DAYS = 30;

export async function startEntry(input: MediaHistoryInput): Promise<number> {
    const db = getDb();
    db.run(
        `INSERT INTO media_history
            (title, artist, album, bundle_id, app_name, artwork_url, artwork_data_url,
             duration_seconds, listened_seconds, started_at)
         VALUES ($title, $artist, $album, $bundle, $app, $art, $artData, $dur, 0, $started)`,
        {
            $title: input.title,
            $artist: input.artist,
            $album: input.album,
            $bundle: input.bundleId,
            $app: input.appName,
            $art: input.artworkUrl,
            $artData: input.artworkDataUrl,
            $dur: input.durationSeconds,
            $started: input.startedAt
        }
    );
    const result = db.exec('SELECT last_insert_rowid() AS id');
    const id = Number(result[0]?.values[0]?.[0] ?? 0);
    await persist();
    return id;
}

export async function extendEntry(id: number, additionalSeconds: number): Promise<void> {
    if (additionalSeconds <= 0) return;
    const db = getDb();
    db.run(
        `UPDATE media_history SET listened_seconds = listened_seconds + $delta WHERE id = $id`,
        { $delta: Math.round(additionalSeconds), $id: id }
    );
    await persist();
}

const upsertArtistStats = (
    artist: string,
    seconds: number,
    timestamp: number
) => {
    const db = getDb();
    db.run(
        `INSERT INTO media_artist_stats (artist, total_seconds, total_plays, first_played_at, last_played_at)
         VALUES ($artist, $sec, 1, $now, $now)
         ON CONFLICT(artist) DO UPDATE SET
            total_seconds = total_seconds + $sec,
            total_plays = total_plays + 1,
            last_played_at = $now`,
        { $artist: artist, $sec: seconds, $now: timestamp }
    );
};

const upsertTrackStats = (
    artist: string,
    title: string,
    album: string | null,
    artworkUrl: string | null,
    artworkDataUrl: string | null,
    seconds: number,
    timestamp: number
) => {
    const db = getDb();
    db.run(
        `INSERT INTO media_track_stats
            (artist, title, album, artwork_url, artwork_data_url, total_seconds, total_plays, first_played_at, last_played_at)
         VALUES ($artist, $title, $album, $art, $artData, $sec, 1, $now, $now)
         ON CONFLICT(artist, title) DO UPDATE SET
            total_seconds = total_seconds + $sec,
            total_plays = total_plays + 1,
            last_played_at = $now,
            album = COALESCE($album, album),
            artwork_url = COALESCE($art, artwork_url),
            artwork_data_url = COALESCE($artData, artwork_data_url)`,
        {
            $artist: artist,
            $title: title,
            $album: album,
            $art: artworkUrl,
            $artData: artworkDataUrl,
            $sec: seconds,
            $now: timestamp
        }
    );
};

export async function closeEntry(id: number, endedAt: number): Promise<void> {
    const db = getDb();

    // Read the entry to decide whether to roll it up into aggregates.
    const rows = queryRows<Row>(`SELECT * FROM media_history WHERE id = $id`, { $id: id });
    const entry = rows[0];

    if (!entry) {
        return;
    }

    if (entry.listened_seconds < MINIMUM_LISTENED_SECONDS_TO_KEEP) {
        // Skipped track — drop it, don't pollute aggregates.
        db.run(`DELETE FROM media_history WHERE id = $id`, { $id: id });
        await persist();
        return;
    }

    if (entry.title && entry.title.trim()) {
        upsertTrackStats(
            entry.artist ?? '',
            entry.title,
            entry.album,
            entry.artwork_url,
            entry.artwork_data_url,
            entry.listened_seconds,
            endedAt
        );
    }
    if (entry.artist && entry.artist.trim()) {
        upsertArtistStats(entry.artist, entry.listened_seconds, endedAt);
    }

    db.run(
        `UPDATE media_history SET ended_at = $ended WHERE id = $id AND ended_at IS NULL`,
        { $ended: endedAt, $id: id }
    );
    await persist();
}

export function listHistory(limit = 50): MediaHistoryEntry[] {
    return queryRows<Row>(
        `SELECT * FROM media_history
         WHERE listened_seconds >= ${MINIMUM_LISTENED_SECONDS_TO_KEEP}
         ORDER BY started_at DESC
         LIMIT $limit`,
        { $limit: limit }
    ).map(rowToEntry);
}

export function listArtistGroups(limit = 30): MediaArtistGroup[] {
    const artistRows = queryRows<{
        artist: string;
        total_seconds: number;
        total_plays: number;
        first_played_at: number;
        last_played_at: number;
    }>(
        `SELECT artist, total_seconds, total_plays, first_played_at, last_played_at
         FROM media_artist_stats
         WHERE artist != ''
         ORDER BY total_seconds DESC
         LIMIT $limit`,
        { $limit: limit }
    );

    if (artistRows.length === 0) return [];

    return artistRows.map((row) => {
        const tracks = queryRows<{
            title: string;
            album: string | null;
            artwork_url: string | null;
            artwork_data_url: string | null;
            total_seconds: number;
            total_plays: number;
            last_played_at: number;
        }>(
            `SELECT title, album, artwork_url, artwork_data_url,
                    total_seconds, total_plays, last_played_at
             FROM media_track_stats
             WHERE artist = $artist
             ORDER BY total_seconds DESC`,
            { $artist: row.artist }
        );

        return {
            artist: row.artist,
            totalSeconds: row.total_seconds,
            totalPlays: row.total_plays,
            lastPlayedAt: row.last_played_at,
            firstPlayedAt: row.first_played_at,
            tracks: tracks.map((track) => ({
                title: track.title,
                album: track.album,
                artworkUrl: track.artwork_url,
                artworkDataUrl: track.artwork_data_url,
                totalSeconds: track.total_seconds,
                totalPlays: track.total_plays,
                lastPlayedAt: track.last_played_at
            }))
        };
    });
}

export function getStats(): MediaStats {
    const db = getDb();
    const exec = (sql: string, params?: BindParams) => {
        const stmt = db.prepare(sql);
        try {
            if (params) stmt.bind(params);
            const rows: Record<string, unknown>[] = [];
            while (stmt.step()) rows.push(stmt.getAsObject());
            return rows;
        } finally {
            stmt.free();
        }
    };

    // Totals & uniques come from the aggregate tables so they survive
    // history purges. Recent-window numbers still come from media_history
    // (which retains the last HISTORY_RETENTION_DAYS).
    const totalsRow = exec(
        `SELECT COALESCE(SUM(total_seconds), 0) AS total,
                COUNT(*) AS uniq_artists
         FROM media_artist_stats`
    )[0];

    const uniqTracksRow = exec(`SELECT COUNT(*) AS uniq_tracks FROM media_track_stats`)[0];

    const now = Date.now();
    const ms24h = now - 24 * 60 * 60 * 1000;
    const ms7d = now - 7 * 24 * 60 * 60 * 1000;

    const recentTotal = (since: number) =>
        Number(
            exec(
                `SELECT COALESCE(SUM(listened_seconds), 0) AS total
                 FROM media_history
                 WHERE started_at >= $since AND listened_seconds >= ${MINIMUM_LISTENED_SECONDS_TO_KEEP}`,
                { $since: since }
            )[0]?.total ?? 0
        );

    const topArtists = exec(
        `SELECT artist, total_seconds AS total, total_plays AS plays
         FROM media_artist_stats
         WHERE artist != ''
         ORDER BY total DESC
         LIMIT 5`
    ).map((row) => ({
        artist: String(row.artist ?? ''),
        totalSeconds: Number(row.total ?? 0),
        plays: Number(row.plays ?? 0)
    }));

    const topTracks = exec(
        `SELECT title, artist, total_seconds AS total, total_plays AS plays
         FROM media_track_stats
         WHERE title != ''
         ORDER BY total DESC
         LIMIT 5`
    ).map((row) => ({
        title: String(row.title ?? ''),
        artist: row.artist ? String(row.artist) : null,
        totalSeconds: Number(row.total ?? 0),
        plays: Number(row.plays ?? 0)
    }));

    return {
        totalListenedSeconds: Number(totalsRow?.total ?? 0),
        uniqueTracks: Number(uniqTracksRow?.uniq_tracks ?? 0),
        uniqueArtists: Number(totalsRow?.uniq_artists ?? 0),
        topArtists,
        topTracks,
        last24hSeconds: recentTotal(ms24h),
        last7dSeconds: recentTotal(ms7d)
    };
}

export async function purgeOldHistory(retentionDays = HISTORY_RETENTION_DAYS): Promise<number> {
    const db = getDb();
    const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
    db.run(`DELETE FROM media_history WHERE started_at < $cutoff`, { $cutoff: cutoff });
    const changes = db.exec('SELECT changes() AS c')[0]?.values[0]?.[0];
    await persist();
    return Number(changes ?? 0);
}

export async function clearHistory(): Promise<void> {
    // Only wipes the recent-tracks log — cumulative artist/track totals stay.
    const db = getDb();
    db.run('DELETE FROM media_history');
    await persist();
}

export async function clearAllStats(): Promise<void> {
    const db = getDb();
    db.run('DELETE FROM media_history');
    db.run('DELETE FROM media_artist_stats');
    db.run('DELETE FROM media_track_stats');
    await persist();
}
