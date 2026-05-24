import { readFile } from 'fs/promises';
import os from 'os';
import path from 'path';

export type SshHostSource = 'config' | 'known_hosts' | 'saved';

export interface SshHost {
    id: string;
    alias: string;
    originalAlias?: string;
    customAlias?: string;
    hostname: string;
    user?: string;
    originalUser?: string;
    port?: number;
    identityFile?: string;
    source: SshHostSource;
    savedId?: number;
    authMethod?: 'password' | 'key' | 'agent';
    color?: string;
    notes?: string;
    hidden?: boolean;
    /** true if a host_overrides row provides a stored password for this host */
    hasOverridePassword?: boolean;
    /** number of enabled port forwards configured for this host */
    forwardCount?: number;
}

const CONFIG_PATH = path.join(os.homedir(), '.ssh', 'config');
const KNOWN_HOSTS_PATH = path.join(os.homedir(), '.ssh', 'known_hosts');

const expandHome = (value: string) =>
    value.startsWith('~') ? path.join(os.homedir(), value.slice(1)) : value;

interface HostBlock {
    patterns: string[];
    options: Map<string, string>;
}

const parseConfig = (text: string): HostBlock[] => {
    const blocks: HostBlock[] = [];
    let current: HostBlock | null = null;

    for (const rawLine of text.split('\n')) {
        const line = rawLine.replace(/#.*$/, '').trim();
        if (!line) continue;

        const [keyword, ...rest] = line.split(/\s+/);
        if (!keyword) continue;

        const value = rest.join(' ');
        const lowerKey = keyword.toLowerCase();

        if (lowerKey === 'host') {
            current = { patterns: rest, options: new Map() };
            blocks.push(current);
        } else if (current && value) {
            current.options.set(lowerKey, value);
        }
    }

    return blocks;
};

const isConcreteAlias = (alias: string) =>
    !alias.includes('*') && !alias.includes('?') && !alias.startsWith('!');

const blockToHosts = (block: HostBlock): SshHost[] => {
    const hostname = block.options.get('hostname');
    const user = block.options.get('user');
    const portRaw = block.options.get('port');
    const identityFile = block.options.get('identityfile');
    const port = portRaw ? Number(portRaw) : undefined;

    return block.patterns
        .filter(isConcreteAlias)
        .map((alias) => ({
            id: `config:${alias}`,
            alias,
            hostname: hostname ?? alias,
            user,
            port: Number.isFinite(port) ? port : undefined,
            identityFile: identityFile ? expandHome(identityFile) : undefined,
            source: 'config' as const
        }));
};

const parseKnownHostName = (rawName: string): { hostname: string; port?: number } | null => {
    if (!rawName || rawName.startsWith('|')) return null;
    if (rawName.includes('*') || rawName.includes('?')) return null;

    // [hostname]:port form
    const bracketMatch = rawName.match(/^\[([^\]]+)\]:(\d+)$/);
    if (bracketMatch) {
        return { hostname: bracketMatch[1], port: Number(bracketMatch[2]) };
    }

    return { hostname: rawName };
};

const parseKnownHosts = (text: string): SshHost[] => {
    const seen = new Set<string>();
    const result: SshHost[] = [];

    for (const rawLine of text.split('\n')) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#') || line.startsWith('|')) continue;

        const [hostField] = line.split(/\s+/);
        if (!hostField) continue;

        for (const candidate of hostField.split(',')) {
            const parsed = parseKnownHostName(candidate);
            if (!parsed) continue;

            const key = parsed.port ? `${parsed.hostname}:${parsed.port}` : parsed.hostname;
            if (seen.has(key)) continue;
            seen.add(key);

            result.push({
                id: `known:${key}`,
                alias: key,
                hostname: parsed.hostname,
                port: parsed.port,
                source: 'known_hosts'
            });
        }
    }

    return result;
};

const safeRead = async (file: string) => {
    try {
        return await readFile(file, 'utf8');
    } catch {
        return null;
    }
};

export async function listFileBasedHosts(): Promise<SshHost[]> {
    const [configText, knownHostsText] = await Promise.all([
        safeRead(CONFIG_PATH),
        safeRead(KNOWN_HOSTS_PATH)
    ]);

    const configHosts = configText ? parseConfig(configText).flatMap(blockToHosts) : [];
    const knownHosts = knownHostsText ? parseKnownHosts(knownHostsText) : [];

    const configHostnames = new Set(
        configHosts.flatMap((host) => [host.alias.toLowerCase(), host.hostname.toLowerCase()])
    );

    const knownOnly = knownHosts.filter(
        (host) =>
            !configHostnames.has(host.hostname.toLowerCase()) &&
            !configHostnames.has(host.alias.toLowerCase())
    );

    return [...configHosts, ...knownOnly];
}
