import type { BindParams } from 'sql.js';
import { getDb, persist } from './db.ts';

export type PortForwardType = 'local' | 'remote';

export interface PortForward {
    id: number;
    hostId: string;
    type: PortForwardType;
    bindAddress: string | null;
    bindPort: number;
    targetHost: string;
    targetPort: number;
    label: string | null;
    enabled: boolean;
    createdAt: number;
    updatedAt: number;
}

export interface PortForwardInput {
    type: PortForwardType;
    bindAddress?: string | null;
    bindPort: number;
    targetHost: string;
    targetPort: number;
    label?: string | null;
    enabled?: boolean;
}

interface Row {
    id: number;
    host_id: string;
    type: PortForwardType;
    bind_address: string | null;
    bind_port: number;
    target_host: string;
    target_port: number;
    label: string | null;
    enabled: number;
    created_at: number;
    updated_at: number;
}

const rowToForward = (row: Row): PortForward => ({
    id: row.id,
    hostId: row.host_id,
    type: row.type,
    bindAddress: row.bind_address,
    bindPort: row.bind_port,
    targetHost: row.target_host,
    targetPort: row.target_port,
    label: row.label,
    enabled: row.enabled === 1,
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

export function listPortForwards(hostId: string): PortForward[] {
    return queryRows(
        'SELECT * FROM port_forwards WHERE host_id = $host ORDER BY id ASC',
        { $host: hostId }
    ).map(rowToForward);
}

export function listAllPortForwards(): PortForward[] {
    return queryRows('SELECT * FROM port_forwards ORDER BY host_id, id').map(rowToForward);
}

export async function createPortForward(hostId: string, input: PortForwardInput): Promise<PortForward> {
    const db = getDb();
    const now = Date.now();
    db.run(
        `INSERT INTO port_forwards
            (host_id, type, bind_address, bind_port, target_host, target_port, label, enabled, created_at, updated_at)
         VALUES ($host, $type, $bindAddr, $bindPort, $target, $targetPort, $label, $enabled, $created, $updated)`,
        {
            $host: hostId,
            $type: input.type,
            $bindAddr: input.bindAddress ?? null,
            $bindPort: input.bindPort,
            $target: input.targetHost,
            $targetPort: input.targetPort,
            $label: input.label ?? null,
            $enabled: (input.enabled ?? true) ? 1 : 0,
            $created: now,
            $updated: now
        }
    );
    const idRow = db.exec('SELECT last_insert_rowid() AS id');
    const id = Number(idRow[0]?.values[0]?.[0] ?? 0);
    await persist();
    return listPortForwards(hostId).find((forward) => forward.id === id)!;
}

export async function updatePortForward(id: number, patch: Partial<PortForwardInput>): Promise<void> {
    const db = getDb();
    const current = queryRows('SELECT * FROM port_forwards WHERE id = $id', { $id: id })[0];
    if (!current) return;

    db.run(
        `UPDATE port_forwards SET
            type = $type,
            bind_address = $bindAddr,
            bind_port = $bindPort,
            target_host = $target,
            target_port = $targetPort,
            label = $label,
            enabled = $enabled,
            updated_at = $updated
         WHERE id = $id`,
        {
            $id: id,
            $type: patch.type ?? current.type,
            $bindAddr: patch.bindAddress !== undefined ? patch.bindAddress : current.bind_address,
            $bindPort: patch.bindPort ?? current.bind_port,
            $target: patch.targetHost ?? current.target_host,
            $targetPort: patch.targetPort ?? current.target_port,
            $label: patch.label !== undefined ? patch.label : current.label,
            $enabled:
                (patch.enabled !== undefined ? patch.enabled : current.enabled === 1) ? 1 : 0,
            $updated: Date.now()
        }
    );
    await persist();
}

export async function deletePortForward(id: number): Promise<void> {
    const db = getDb();
    db.run('DELETE FROM port_forwards WHERE id = $id', { $id: id });
    await persist();
}
