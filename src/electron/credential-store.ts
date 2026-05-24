import { safeStorage } from 'electron';

export function isCredentialEncryptionAvailable(): boolean {
    return safeStorage.isEncryptionAvailable();
}

export function encryptPassword(plain: string): Buffer | null {
    if (!plain) return null;
    if (!safeStorage.isEncryptionAvailable()) {
        throw new Error('Credential encryption is not available on this system');
    }
    return safeStorage.encryptString(plain);
}

export function decryptPassword(blob: Buffer | null | undefined): string | null {
    if (!blob || blob.length === 0) return null;
    if (!safeStorage.isEncryptionAvailable()) {
        throw new Error('Credential encryption is not available on this system');
    }
    return safeStorage.decryptString(blob);
}
