import type { BindParams } from 'sql.js';
import { getDb, persist } from './db.ts';
import { decryptPassword, encryptPassword } from './credential-store.ts';

export type OverrideAuthMethod = 'password' | 'key' | 'agent';

export interface HostOverride {
    hostId: string;
    customAlias: string | null;
    color: string | null;
    notes: string | null;
    hidden: boolean;
    username: string | null;
    hasPassword: boolean;
    authMethod: OverrideAuthMethod | null;
    createdAt: number;
    updatedAt: number;
}

export interface HostOverridePatch {
    customAlias?: string | null;
    color?: string | null;
    notes?: string | null;
    hidden?: boolean;
    username?: string | null;
    /** undefined = keep, null = clear, '' = clear, '...' = encrypt-and-store */
    password?: string | null;
    authMethod?: OverrideAuthMethod | null;
}

interface Row {
    host_id: string;
    custom_alias: string | null;
    color: string | null;
    notes: string | null;
    hidden: number;
    username: string | null;
    password_encrypted: Uint8Array | null;
    auth_method: OverrideAuthMethod | null;
    created_at: number;
    updated_at: number;
}

const rowToOverride = (row: Row): HostOverride => ({
    hostId: row.host_id,
    customAlias: row.custom_alias,
    color: row.color,
    notes: row.notes,
    hidden: row.hidden === 1,
    username: row.username,
    hasPassword: Boolean(row.password_encrypted && row.password_encrypted.length > 0),
    authMethod: row.auth_method,
    createdAt: row.created_at,
    updatedAt: row.updated_at
});

const queryRows = (sql: string, params: BindParams = []): Row[] => {
    const db = getDb();
    const stmt = db.prepare(sql);
    try {
        stmt.bind(params);
        const out: Row[] = [];
        while (stmt.step()) out.push(stmt.getAsObject() as unknown as Row);
        return out;
    } finally {
        stmt.free();
    }
};

export function listOverrides(): HostOverride[] {
    return queryRows('SELECT * FROM host_overrides').map(rowToOverride);
}

export function getOverride(hostId: string): HostOverride | null {
    const rows = queryRows('SELECT * FROM host_overrides WHERE host_id = $id', { $id: hostId });
    return rows[0] ? rowToOverride(rows[0]) : null;
}

export function getOverridePassword(hostId: string): string | null {
    const rows = queryRows(
        'SELECT password_encrypted FROM host_overrides WHERE host_id = $id',
        { $id: hostId }
    );
    const row = rows[0];
    if (!row || !row.password_encrypted || row.password_encrypted.length === 0) return null;
    return decryptPassword(Buffer.from(row.password_encrypted));
}

export async function upsertOverride(hostId: string, patch: HostOverridePatch): Promise<HostOverride> {
    const db = getDb();
    const now = Date.now();
    const existing = getOverride(hostId);

    // password: undefined → keep, null/'' → clear, '...' → encrypt
    const passwordShouldUpdate = patch.password !== undefined;
    const passwordEncrypted =
        passwordShouldUpdate && patch.password ? encryptPassword(patch.password) : null;

    if (existing) {
        db.run(
            `UPDATE host_overrides SET
                custom_alias = $alias,
                color = $color,
                notes = $notes,
                hidden = $hidden,
                username = $username,
                auth_method = $auth,
                ${passwordShouldUpdate ? 'password_encrypted = $pwd,' : ''}
                updated_at = $updated
             WHERE host_id = $id`,
            {
                $id: hostId,
                $alias: patch.customAlias !== undefined ? patch.customAlias : existing.customAlias,
                $color: patch.color !== undefined ? patch.color : existing.color,
                $notes: patch.notes !== undefined ? patch.notes : existing.notes,
                $hidden: (patch.hidden !== undefined ? patch.hidden : existing.hidden) ? 1 : 0,
                $username: patch.username !== undefined ? patch.username : existing.username,
                $auth: patch.authMethod !== undefined ? patch.authMethod : existing.authMethod,
                ...(passwordShouldUpdate ? { $pwd: passwordEncrypted ?? null } : {}),
                $updated: now
            }
        );
    } else {
        db.run(
            `INSERT INTO host_overrides
                (host_id, custom_alias, color, notes, hidden,
                 username, password_encrypted, auth_method,
                 created_at, updated_at)
             VALUES ($id, $alias, $color, $notes, $hidden,
                     $username, $pwd, $auth,
                     $created, $updated)`,
            {
                $id: hostId,
                $alias: patch.customAlias ?? null,
                $color: patch.color ?? null,
                $notes: patch.notes ?? null,
                $hidden: patch.hidden ? 1 : 0,
                $username: patch.username ?? null,
                $pwd: passwordEncrypted ?? null,
                $auth: patch.authMethod ?? null,
                $created: now,
                $updated: now
            }
        );
    }

    await persist();
    return getOverride(hostId)!;
}

export async function deleteOverride(hostId: string): Promise<void> {
    const db = getDb();
    db.run('DELETE FROM host_overrides WHERE host_id = $id', { $id: hostId });
    await persist();
}
