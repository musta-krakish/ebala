import type { BindParams } from 'sql.js';
import { getDb, persist } from './db.ts';
import { decryptPassword, encryptPassword } from './credential-store.ts';
import type { SshHost } from './ssh-config-parser.ts';

export type SavedHostAuthMethod = 'password' | 'key' | 'agent';

export interface SavedHost {
    id: number;
    label: string;
    hostname: string;
    port: number;
    username: string;
    authMethod: SavedHostAuthMethod;
    hasPassword: boolean;
    identityFile?: string;
    color?: string;
    createdAt: number;
    updatedAt: number;
}

export interface SavedHostInput {
    label: string;
    hostname: string;
    port?: number;
    username: string;
    authMethod: SavedHostAuthMethod;
    password?: string | null;
    identityFile?: string | null;
    color?: string | null;
}

interface SavedHostRow {
    id: number;
    label: string;
    hostname: string;
    port: number;
    username: string;
    auth_method: SavedHostAuthMethod;
    password_encrypted: Uint8Array | null;
    identity_file: string | null;
    color: string | null;
    created_at: number;
    updated_at: number;
}

const rowToHost = (row: SavedHostRow): SavedHost => ({
    id: row.id,
    label: row.label,
    hostname: row.hostname,
    port: row.port,
    username: row.username,
    authMethod: row.auth_method,
    hasPassword: Boolean(row.password_encrypted && row.password_encrypted.length > 0),
    identityFile: row.identity_file ?? undefined,
    color: row.color ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
});

const selectAll = `
    SELECT id, label, hostname, port, username, auth_method,
           password_encrypted, identity_file, color, created_at, updated_at
    FROM saved_hosts
    ORDER BY label COLLATE NOCASE ASC
`;

const selectById = `
    SELECT id, label, hostname, port, username, auth_method,
           password_encrypted, identity_file, color, created_at, updated_at
    FROM saved_hosts WHERE id = $id
`;

const rowsFromStmt = (sql: string, params: BindParams = []): SavedHostRow[] => {
    const db = getDb();
    const stmt = db.prepare(sql);
    try {
        stmt.bind(params);
        const result: SavedHostRow[] = [];
        while (stmt.step()) {
            result.push(stmt.getAsObject() as unknown as SavedHostRow);
        }
        return result;
    } finally {
        stmt.free();
    }
};

export function listSavedHosts(): SavedHost[] {
    return rowsFromStmt(selectAll).map(rowToHost);
}

export function getSavedHost(id: number): SavedHost | null {
    const rows = rowsFromStmt(selectById, { $id: id });
    return rows[0] ? rowToHost(rows[0]) : null;
}

export async function createSavedHost(input: SavedHostInput): Promise<SavedHost> {
    const db = getDb();
    const now = Date.now();
    const encrypted = input.password ? encryptPassword(input.password) : null;
    const port = input.port ?? 22;

    db.run(
        `INSERT INTO saved_hosts
            (label, hostname, port, username, auth_method, password_encrypted, identity_file, color, created_at, updated_at)
         VALUES ($label, $hostname, $port, $username, $auth, $pwd, $identity, $color, $created, $updated)`,
        {
            $label: input.label,
            $hostname: input.hostname,
            $port: port,
            $username: input.username,
            $auth: input.authMethod,
            $pwd: encrypted ?? null,
            $identity: input.identityFile ?? null,
            $color: input.color ?? null,
            $created: now,
            $updated: now
        }
    );

    const result = db.exec('SELECT last_insert_rowid() AS id');
    const id = Number(result[0]?.values[0]?.[0] ?? 0);

    await persist();
    return getSavedHost(id)!;
}

export async function updateSavedHost(id: number, input: SavedHostInput): Promise<SavedHost> {
    const db = getDb();
    const now = Date.now();
    const port = input.port ?? 22;

    // password === null  → keep existing
    // password === ''    → clear stored password
    // password === '...' → encrypt and store
    const shouldUpdatePassword = input.password !== undefined && input.password !== null;
    const newEncrypted =
        shouldUpdatePassword && input.password !== '' ? encryptPassword(input.password!) : null;

    if (shouldUpdatePassword) {
        db.run(
            `UPDATE saved_hosts SET
                label=$label, hostname=$hostname, port=$port, username=$username,
                auth_method=$auth, password_encrypted=$pwd, identity_file=$identity,
                color=$color, updated_at=$updated
             WHERE id=$id`,
            {
                $id: id,
                $label: input.label,
                $hostname: input.hostname,
                $port: port,
                $username: input.username,
                $auth: input.authMethod,
                $pwd: newEncrypted ?? null,
                $identity: input.identityFile ?? null,
                $color: input.color ?? null,
                $updated: now
            }
        );
    } else {
        db.run(
            `UPDATE saved_hosts SET
                label=$label, hostname=$hostname, port=$port, username=$username,
                auth_method=$auth, identity_file=$identity, color=$color, updated_at=$updated
             WHERE id=$id`,
            {
                $id: id,
                $label: input.label,
                $hostname: input.hostname,
                $port: port,
                $username: input.username,
                $auth: input.authMethod,
                $identity: input.identityFile ?? null,
                $color: input.color ?? null,
                $updated: now
            }
        );
    }

    await persist();
    const updated = getSavedHost(id);
    if (!updated) throw new Error(`Saved host ${id} not found after update`);
    return updated;
}

export async function deleteSavedHost(id: number): Promise<boolean> {
    const db = getDb();
    db.run('DELETE FROM saved_hosts WHERE id = $id', { $id: id });
    await persist();
    return true;
}

export function savedHostToSshHost(saved: SavedHost): SshHost {
    return {
        id: `saved:${saved.id}`,
        alias: saved.label,
        hostname: saved.hostname,
        user: saved.username,
        port: saved.port,
        identityFile: saved.identityFile,
        source: 'saved',
        savedId: saved.id,
        authMethod: saved.authMethod,
        color: saved.color
    };
}

export function getSavedHostPassword(id: number): string | null {
    const rows = rowsFromStmt(selectById, { $id: id });
    const row = rows[0];
    if (!row || !row.password_encrypted || row.password_encrypted.length === 0) return null;
    return decryptPassword(Buffer.from(row.password_encrypted));
}
