import type { BindParams } from 'sql.js';
import { getDb, persist } from './db.ts';
import { decryptPassword, encryptPassword } from './credential-store.ts';

export interface RdpHost {
    id: number;
    label: string;
    hostname: string;
    port: number;
    username: string;
    hasPassword: boolean;
    domain?: string;
    color?: string;
    notes?: string;
    extraArgs?: string;
    createdAt: number;
    updatedAt: number;
}

export interface RdpHostInput {
    label: string;
    hostname: string;
    port?: number;
    username: string;
    /** undefined/null = keep existing; '' = clear; '...' = set */
    password?: string | null;
    domain?: string | null;
    color?: string | null;
    notes?: string | null;
    extraArgs?: string | null;
}

interface RdpHostRow {
    id: number;
    label: string;
    hostname: string;
    port: number;
    username: string;
    password_encrypted: Uint8Array | null;
    domain: string | null;
    color: string | null;
    notes: string | null;
    extra_args: string | null;
    created_at: number;
    updated_at: number;
}

const rowToHost = (row: RdpHostRow): RdpHost => ({
    id: row.id,
    label: row.label,
    hostname: row.hostname,
    port: row.port,
    username: row.username,
    hasPassword: Boolean(row.password_encrypted && row.password_encrypted.length > 0),
    domain: row.domain ?? undefined,
    color: row.color ?? undefined,
    notes: row.notes ?? undefined,
    extraArgs: row.extra_args ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
});

const selectAll = `
    SELECT id, label, hostname, port, username, password_encrypted,
           domain, color, notes, extra_args, created_at, updated_at
    FROM rdp_hosts
    ORDER BY label COLLATE NOCASE ASC
`;

const selectById = `
    SELECT id, label, hostname, port, username, password_encrypted,
           domain, color, notes, extra_args, created_at, updated_at
    FROM rdp_hosts WHERE id = $id
`;

function rowsFromStmt(sql: string, params: BindParams = []): RdpHostRow[] {
    const db = getDb();
    const stmt = db.prepare(sql);
    try {
        stmt.bind(params);
        const result: RdpHostRow[] = [];
        while (stmt.step()) {
            result.push(stmt.getAsObject() as unknown as RdpHostRow);
        }
        return result;
    } finally {
        stmt.free();
    }
}

export function listRdpHosts(): RdpHost[] {
    return rowsFromStmt(selectAll).map(rowToHost);
}

export function getRdpHost(id: number): RdpHost | null {
    const rows = rowsFromStmt(selectById, { $id: id });
    return rows[0] ? rowToHost(rows[0]) : null;
}

export function getRdpHostPassword(id: number): string | null {
    const rows = rowsFromStmt(selectById, { $id: id });
    if (!rows[0]) return null;
    const blob = rows[0].password_encrypted;
    if (!blob) return null;
    return decryptPassword(Buffer.from(blob));
}

export async function createRdpHost(input: RdpHostInput): Promise<RdpHost> {
    const db = getDb();
    const now = Date.now();
    const encrypted = input.password ? encryptPassword(input.password) : null;
    const port = input.port ?? 3389;

    db.run(
        `INSERT INTO rdp_hosts
            (label, hostname, port, username, password_encrypted, domain, color, notes, extra_args, created_at, updated_at)
         VALUES ($label, $hostname, $port, $username, $pwd, $domain, $color, $notes, $extra, $created, $updated)`,
        {
            $label: input.label,
            $hostname: input.hostname,
            $port: port,
            $username: input.username,
            $pwd: encrypted ?? null,
            $domain: input.domain ?? null,
            $color: input.color ?? null,
            $notes: input.notes ?? null,
            $extra: input.extraArgs ?? null,
            $created: now,
            $updated: now
        }
    );

    const result = db.exec('SELECT last_insert_rowid() AS id');
    const id = Number(result[0]?.values[0]?.[0] ?? 0);

    await persist();
    return getRdpHost(id)!;
}

export async function updateRdpHost(id: number, input: RdpHostInput): Promise<RdpHost> {
    const db = getDb();
    const now = Date.now();
    const port = input.port ?? 3389;

    const shouldUpdatePassword = input.password !== undefined && input.password !== null;
    const newEncrypted =
        shouldUpdatePassword && input.password !== '' ? encryptPassword(input.password!) : null;

    if (shouldUpdatePassword) {
        db.run(
            `UPDATE rdp_hosts SET
                label=$label, hostname=$hostname, port=$port, username=$username,
                password_encrypted=$pwd, domain=$domain, color=$color, notes=$notes,
                extra_args=$extra, updated_at=$updated
             WHERE id=$id`,
            {
                $id: id,
                $label: input.label,
                $hostname: input.hostname,
                $port: port,
                $username: input.username,
                $pwd: newEncrypted ?? null,
                $domain: input.domain ?? null,
                $color: input.color ?? null,
                $notes: input.notes ?? null,
                $extra: input.extraArgs ?? null,
                $updated: now
            }
        );
    } else {
        db.run(
            `UPDATE rdp_hosts SET
                label=$label, hostname=$hostname, port=$port, username=$username,
                domain=$domain, color=$color, notes=$notes,
                extra_args=$extra, updated_at=$updated
             WHERE id=$id`,
            {
                $id: id,
                $label: input.label,
                $hostname: input.hostname,
                $port: port,
                $username: input.username,
                $domain: input.domain ?? null,
                $color: input.color ?? null,
                $notes: input.notes ?? null,
                $extra: input.extraArgs ?? null,
                $updated: now
            }
        );
    }

    await persist();
    return getRdpHost(id)!;
}

export async function deleteRdpHost(id: number): Promise<boolean> {
    const db = getDb();
    db.run('DELETE FROM rdp_hosts WHERE id = $id', { $id: id });
    await persist();
    return true;
}
