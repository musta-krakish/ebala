import { execFile } from 'child_process';
import os from 'os';
import path from 'path';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

const KNOWN_HOSTS_PATH = path.join(os.homedir(), '.ssh', 'known_hosts');

export async function removeFromKnownHosts(hostname: string): Promise<{ success: boolean; error?: string }> {
    if (!hostname || hostname.trim().length === 0) {
        return { success: false, error: 'hostname is empty' };
    }

    try {
        await execFileAsync('ssh-keygen', ['-R', hostname, '-f', KNOWN_HOSTS_PATH], {
            timeout: 10000
        });
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        };
    }
}
