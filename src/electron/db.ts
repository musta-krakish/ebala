import { existsSync, mkdirSync, statSync } from 'fs';
import { readFile, rename, unlink, writeFile } from 'fs/promises';
import { createRequire } from 'module';
import path from 'path';
import { app } from 'electron';
import initSqlJs, { type Database } from 'sql.js';

// Logical groups exposed to the settings panel. The right side is the SQL
// table list cleared when the user picks a group — keeping it here means
// the renderer never has to know about table names.
export const DB_TABLE_GROUPS = {
    sshHosts: ['saved_hosts', 'host_overrides', 'port_forwards'],
    mediaHistory: ['media_history'],
    mediaStats: ['media_artist_stats', 'media_track_stats']
} as const;

export type DbTableGroup = keyof typeof DB_TABLE_GROUPS;

export interface DbStats {
    sizeBytes: number;
    path: string;
    groups: Record<DbTableGroup, { rowCount: number; tables: string[] }>;
}

const require = createRequire(import.meta.url);
const DB_FILENAME = 'ebala.db';

let db: Database | null = null;
let dbPath: string | null = null;
let persistQueue: Promise<void> = Promise.resolve();

const existingColumns = (database: Database, table: string): Set<string> => {
    const stmt = database.prepare(`PRAGMA table_info(${table})`);
    const names = new Set<string>();
    try {
        while (stmt.step()) {
            const row = stmt.getAsObject() as { name?: string };
            if (row.name) names.add(row.name);
        }
    } finally {
        stmt.free();
    }
    return names;
};

const addColumnIfMissing = (database: Database, table: string, column: string, definition: string) => {
    const columns = existingColumns(database, table);
    if (!columns.has(column)) {
        database.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    }
};

const runMigrations = (database: Database) => {
    database.exec(`
        CREATE TABLE IF NOT EXISTS saved_hosts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            label TEXT NOT NULL,
            hostname TEXT NOT NULL,
            port INTEGER NOT NULL DEFAULT 22,
            username TEXT NOT NULL,
            auth_method TEXT NOT NULL DEFAULT 'password',
            password_encrypted BLOB,
            identity_file TEXT,
            color TEXT,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_saved_hosts_label ON saved_hosts (label);

        CREATE TABLE IF NOT EXISTS host_overrides (
            host_id TEXT PRIMARY KEY,
            custom_alias TEXT,
            color TEXT,
            notes TEXT,
            hidden INTEGER NOT NULL DEFAULT 0,
            username TEXT,
            password_encrypted BLOB,
            auth_method TEXT,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_host_overrides_hidden ON host_overrides (hidden);

        CREATE TABLE IF NOT EXISTS port_forwards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            host_id TEXT NOT NULL,
            type TEXT NOT NULL CHECK (type IN ('local', 'remote')),
            bind_address TEXT,
            bind_port INTEGER NOT NULL,
            target_host TEXT NOT NULL,
            target_port INTEGER NOT NULL,
            label TEXT,
            enabled INTEGER NOT NULL DEFAULT 1,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_port_forwards_host ON port_forwards (host_id);

        CREATE TABLE IF NOT EXISTS media_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            artist TEXT,
            album TEXT,
            bundle_id TEXT,
            app_name TEXT,
            artwork_url TEXT,
            artwork_data_url TEXT,
            duration_seconds INTEGER,
            listened_seconds INTEGER NOT NULL DEFAULT 0,
            started_at INTEGER NOT NULL,
            ended_at INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_media_history_started ON media_history (started_at DESC);
        CREATE INDEX IF NOT EXISTS idx_media_history_artist ON media_history (artist);

        -- Cumulative per-artist totals — survive media_history purges.
        CREATE TABLE IF NOT EXISTS media_artist_stats (
            artist TEXT PRIMARY KEY,
            total_seconds INTEGER NOT NULL DEFAULT 0,
            total_plays INTEGER NOT NULL DEFAULT 0,
            first_played_at INTEGER NOT NULL,
            last_played_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_media_artist_stats_total ON media_artist_stats (total_seconds DESC);

        -- Cumulative per-track totals (keyed by artist + title) — also survive purges.
        CREATE TABLE IF NOT EXISTS media_track_stats (
            artist TEXT NOT NULL DEFAULT '',
            title TEXT NOT NULL,
            album TEXT,
            artwork_url TEXT,
            artwork_data_url TEXT,
            total_seconds INTEGER NOT NULL DEFAULT 0,
            total_plays INTEGER NOT NULL DEFAULT 0,
            first_played_at INTEGER NOT NULL,
            last_played_at INTEGER NOT NULL,
            PRIMARY KEY (artist, title)
        );
        CREATE INDEX IF NOT EXISTS idx_media_track_stats_artist ON media_track_stats (artist, total_seconds DESC);
        CREATE INDEX IF NOT EXISTS idx_media_track_stats_total ON media_track_stats (total_seconds DESC);
    `);

    // Forward-compatible migrations for databases created by older versions.
    addColumnIfMissing(database, 'host_overrides', 'username', 'TEXT');
    addColumnIfMissing(database, 'host_overrides', 'password_encrypted', 'BLOB');
    addColumnIfMissing(database, 'host_overrides', 'auth_method', 'TEXT');

    // One-time backfill: if the aggregate tables are empty but we have an
    // existing media_history, roll it up so the "By artist" view isn't blank
    // after the schema change.
    const hasArtistRows =
        (database.exec('SELECT 1 FROM media_artist_stats LIMIT 1')[0]?.values.length ?? 0) > 0;
    const hasHistoryRows =
        (database.exec('SELECT 1 FROM media_history WHERE listened_seconds >= 5 LIMIT 1')[0]?.values
            .length ?? 0) > 0;

    if (!hasArtistRows && hasHistoryRows) {
        database.exec(`
            INSERT INTO media_artist_stats (artist, total_seconds, total_plays, first_played_at, last_played_at)
            SELECT artist, SUM(listened_seconds), COUNT(*), MIN(started_at), MAX(started_at)
            FROM media_history
            WHERE artist IS NOT NULL AND artist != '' AND listened_seconds >= 5
            GROUP BY artist;

            INSERT INTO media_track_stats (artist, title, album, artwork_url, artwork_data_url,
                                           total_seconds, total_plays, first_played_at, last_played_at)
            SELECT
                COALESCE(artist, ''),
                title,
                MAX(album),
                MAX(artwork_url),
                MAX(artwork_data_url),
                SUM(listened_seconds),
                COUNT(*),
                MIN(started_at),
                MAX(started_at)
            FROM media_history
            WHERE title IS NOT NULL AND title != '' AND listened_seconds >= 5
            GROUP BY COALESCE(artist, ''), title;
        `);
    }
};

async function openWithFallback(SQL: Awaited<ReturnType<typeof initSqlJs>>, filePath: string): Promise<Database> {
    if (!existsSync(filePath)) return new SQL.Database();

    const buffer = await readFile(filePath);
    try {
        const candidate = new SQL.Database(buffer);
        // Touch a real query so we surface malformed-image errors here, not
        // mid-runtime when the user clicks something.
        candidate.exec('PRAGMA quick_check');
        return candidate;
    } catch (err) {
        const stamp = new Date().toISOString().replace(/[:.]/g, '-');
        const quarantine = `${filePath}.corrupted-${stamp}`;
        try {
            await rename(filePath, quarantine);
        } catch {
            // ignore — worst case we overwrite below
        }
        console.error(`[db] image malformed (${(err as Error)?.message ?? err}); quarantined to ${quarantine}, starting fresh`);
        return new SQL.Database();
    }
}

export async function initDb(): Promise<Database> {
    if (db) return db;

    const sqlJsDistPath = path.dirname(require.resolve('sql.js/dist/sql-wasm.js'));
    const SQL = await initSqlJs({
        locateFile: (file) => path.join(sqlJsDistPath, file)
    });

    const userData = app.getPath('userData');
    if (!existsSync(userData)) {
        mkdirSync(userData, { recursive: true });
    }
    dbPath = path.join(userData, DB_FILENAME);

    if (existsSync(dbPath)) {
        db = await openWithFallback(SQL, dbPath);
    } else {
        db = new SQL.Database();
    }

    runMigrations(db);
    await persist();
    return db;
}

export function getDb(): Database {
    if (!db) throw new Error('Database not initialized. Call initDb() first.');
    return db;
}

export function persist(): Promise<void> {
    persistQueue = persistQueue.then(async () => {
        if (!db || !dbPath) return;
        const data = db.export();
        // Atomic swap via tmp + rename — if the process is killed mid-write
        // (SIGKILL during a long disk scan, etc.) the on-disk file remains
        // the previous valid version instead of a truncated mess.
        const tmpPath = `${dbPath}.tmp`;
        try {
            await writeFile(tmpPath, data);
            await rename(tmpPath, dbPath);
        } catch (err) {
            // Best-effort cleanup of the partial tmp file so we don't
            // accumulate `.tmp` corpses next to the db.
            try { await unlink(tmpPath); } catch { /* ignore */ }
            throw err;
        }
    });
    return persistQueue;
}

export async function closeDb() {
    await persistQueue;
    if (db) {
        db.close();
        db = null;
    }
}

function countRows(database: Database, tables: string[]): number {
    let total = 0;
    for (const table of tables) {
        const result = database.exec(`SELECT COUNT(*) FROM ${table}`)[0];
        const value = result?.values?.[0]?.[0];
        total += typeof value === 'number' ? value : Number(value ?? 0);
    }
    return total;
}

export async function getDbStats(): Promise<DbStats> {
    const database = getDb();
    await persistQueue;
    const sizeBytes = dbPath && existsSync(dbPath) ? statSync(dbPath).size : 0;

    const groups = Object.fromEntries(
        (Object.entries(DB_TABLE_GROUPS) as [DbTableGroup, readonly string[]][]).map(
            ([key, tables]) => [key, { rowCount: countRows(database, tables as string[]), tables: [...tables] }]
        )
    ) as DbStats['groups'];

    return { sizeBytes, path: dbPath ?? '', groups };
}

export async function clearTables(groups: DbTableGroup[]): Promise<DbStats> {
    const database = getDb();
    const tables = new Set<string>();
    for (const group of groups) {
        const list = DB_TABLE_GROUPS[group];
        if (!list) continue;
        for (const table of list) tables.add(table);
    }

    if (tables.size > 0) {
        database.exec('BEGIN TRANSACTION');
        try {
            for (const table of tables) {
                database.exec(`DELETE FROM ${table}`);
            }
            database.exec('COMMIT');
            // VACUUM has to run outside a transaction — without it the file
            // size stays the same after a big purge.
            database.exec('VACUUM');
        } catch (error) {
            database.exec('ROLLBACK');
            throw error;
        }
        await persist();
    }

    return getDbStats();
}
