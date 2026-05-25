import { existsSync, readFileSync } from 'fs';
import os from 'os';
import path from 'path';
import type { SshHost } from './ssh-config-parser.ts';
import { getOverridePassword } from './host-overrides.ts';
import { getSavedHost, getSavedHostPassword } from './saved-hosts.ts';

export interface ResolvedCredentials {
    hostname: string;
    port: number;
    username: string;
    password?: string;
    identityFile?: string;
    privateKey?: Buffer;
    agentSocket?: string;
}

function expandHome(filePath: string): string {
    if (filePath.startsWith('~/')) return path.join(os.homedir(), filePath.slice(2));
    if (filePath === '~') return os.homedir();
    return filePath;
}

function loadPrivateKey(filePath?: string): Buffer | undefined {
    if (!filePath) return undefined;
    const expanded = expandHome(filePath);
    if (!existsSync(expanded)) return undefined;
    try {
        return readFileSync(expanded);
    } catch {
        return undefined;
    }
}

export function resolveCredentials(host: SshHost): ResolvedCredentials {
    const agentSocket = process.env.SSH_AUTH_SOCK || undefined;

    if (host.source === 'saved' && host.savedId !== undefined) {
        const saved = getSavedHost(host.savedId);
        if (!saved) throw new Error(`Saved host ${host.savedId} not found`);
        const password = saved.authMethod === 'password' ? getSavedHostPassword(host.savedId) : null;
        const identityFile = saved.identityFile ?? undefined;
        return {
            hostname: saved.hostname,
            port: saved.port,
            username: saved.username,
            password: password ?? undefined,
            identityFile,
            privateKey: loadPrivateKey(identityFile),
            agentSocket
        };
    }

    if (host.hasOverridePassword) {
        const password = getOverridePassword(host.id);
        if (!host.user) throw new Error('Override credential requires a username');
        return {
            hostname: host.hostname,
            port: host.port ?? 22,
            username: host.user,
            password: password ?? undefined,
            identityFile: host.identityFile,
            privateKey: loadPrivateKey(host.identityFile),
            agentSocket
        };
    }

    return {
        hostname: host.hostname,
        port: host.port ?? 22,
        username: host.user ?? os.userInfo().username,
        identityFile: host.identityFile,
        privateKey: loadPrivateKey(host.identityFile),
        agentSocket
    };
}
