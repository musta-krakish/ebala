import { execFile } from 'child_process';
import dns from 'dns/promises';
import net from 'net';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

const IPV4_RE = /^(?:\d{1,3}\.){3}\d{1,3}$/;
const IPV6_RE = /:/;

function isIp(value: string): boolean {
    return IPV4_RE.test(value) || IPV6_RE.test(value);
}

async function lookupViaNode(hostname: string): Promise<string | null> {
    // Prefer IPv4 — Tailscale's MagicDNS hands out 100.x addresses for
    // tunnel routing, but a misconfigured host might also have an AAAA
    // record that isn't routable. Try IPv4 first, fall back to v6.
    try {
        const result = await dns.lookup(hostname, { family: 4, all: false });
        return result.address;
    } catch {
        // fall through
    }
    try {
        const result = await dns.lookup(hostname, { family: 6, all: false });
        return result.address;
    } catch {
        return null;
    }
}

async function lookupViaSystem(hostname: string): Promise<string | null> {
    // dscacheutil hits the macOS system resolver, which Tailscale's
    // MagicDNS hooks into via /etc/resolver. Node's dns.lookup uses
    // getaddrinfo which sometimes misses those — falling back here
    // gets us the 100.x.x.x address that the tunnel actually routes.
    try {
        const { stdout } = await execFileAsync('dscacheutil', ['-q', 'host', '-a', 'name', hostname], {
            timeout: 5000
        });
        const match = stdout.match(/ipv4_address:\s*(\S+)/) ?? stdout.match(/ip_address:\s*(\S+)/);
        return match ? match[1] : null;
    } catch {
        return null;
    }
}

export async function resolveHost(hostname: string): Promise<{ address: string; via: 'literal' | 'dns' | 'system' | 'unresolved' }> {
    if (isIp(hostname)) {
        return { address: hostname, via: 'literal' };
    }

    // dscacheutil first when the host looks like a Tailscale MagicDNS name —
    // Node's getaddrinfo on macOS has been observed to ignore /etc/resolver
    // hooks for ts.net, while the system resolver handles them correctly.
    if (hostname.endsWith('.ts.net') || hostname.includes('.tail')) {
        const fromSystem = await lookupViaSystem(hostname);
        if (fromSystem) return { address: fromSystem, via: 'system' };
    }

    const fromNode = await lookupViaNode(hostname);
    if (fromNode) return { address: fromNode, via: 'dns' };

    const fromSystem = await lookupViaSystem(hostname);
    if (fromSystem) return { address: fromSystem, via: 'system' };

    return { address: hostname, via: 'unresolved' };
}

export async function tcpPreflight(address: string, port: number, timeoutMs = 8000): Promise<void> {
    return new Promise((resolve, reject) => {
        const socket = net.connect({ host: address, port });
        const timer = setTimeout(() => {
            socket.destroy();
            reject(new Error(`TCP timeout connecting to ${address}:${port}`));
        }, timeoutMs);
        socket.once('connect', () => {
            clearTimeout(timer);
            socket.end();
            resolve();
        });
        socket.once('error', (err) => {
            clearTimeout(timer);
            reject(new Error(`TCP error: ${err.message}`));
        });
    });
}
