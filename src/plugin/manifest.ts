// Static plugin manifest (plugin.json) — describes an installable plugin
// without executing any of its code. Validation runs against this BEFORE the
// plugin is ever loaded, so a malformed repo is rejected and deleted.

export interface PluginCapabilities {
    // Relative path to the built CJS main entry (exports createPlugin/default).
    main?: string;
    // Relative path to the built IIFE renderer entry (calls register()).
    renderer?: string;
    badge?: boolean;
}

export interface PluginManifest {
    id: string;
    name: string;
    description?: string;
    version: string;
    icon?: string;
    capabilities: PluginCapabilities;
    source?: string;
}

export interface ManifestValidation {
    ok: boolean;
    errors: string[];
    manifest?: PluginManifest;
}

const ID_RE = /^[a-z0-9][a-z0-9-]*$/;

// Validates the parsed plugin.json. Does NOT touch the filesystem or run code —
// callers separately verify that the declared entry files exist.
export function validateManifest(raw: unknown): ManifestValidation {
    const errors: string[] = [];

    if (typeof raw !== 'object' || raw === null) {
        return { ok: false, errors: ['plugin.json must be a JSON object'] };
    }
    const obj = raw as Record<string, unknown>;

    if (typeof obj.id !== 'string' || !ID_RE.test(obj.id)) {
        errors.push('id must be a lowercase slug (a-z, 0-9, hyphen)');
    }
    if (typeof obj.name !== 'string' || obj.name.trim() === '') {
        errors.push('name is required');
    }
    if (typeof obj.version !== 'string' || obj.version.trim() === '') {
        errors.push('version is required');
    }
    if (obj.description !== undefined && typeof obj.description !== 'string') {
        errors.push('description must be a string');
    }
    if (obj.icon !== undefined && typeof obj.icon !== 'string') {
        errors.push('icon must be a string (lucide icon name)');
    }

    const caps = obj.capabilities;
    if (typeof caps !== 'object' || caps === null) {
        errors.push('capabilities is required');
    } else {
        const c = caps as Record<string, unknown>;
        if (c.main !== undefined && typeof c.main !== 'string') errors.push('capabilities.main must be a path string');
        if (c.renderer !== undefined && typeof c.renderer !== 'string') errors.push('capabilities.renderer must be a path string');
        if (!c.main && !c.renderer) errors.push('plugin must declare capabilities.main and/or capabilities.renderer');
    }

    if (errors.length > 0) return { ok: false, errors };

    return { ok: true, errors: [], manifest: obj as unknown as PluginManifest };
}
