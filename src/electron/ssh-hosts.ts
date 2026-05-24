import { listFileBasedHosts, type SshHost } from './ssh-config-parser.ts';
import { listSavedHosts, savedHostToSshHost } from './saved-hosts.ts';
import { listOverrides } from './host-overrides.ts';
import { listAllPortForwards } from './port-forwards.ts';

const applyOverrides = (hosts: SshHost[]): SshHost[] => {
    const overrides = new Map(listOverrides().map((override) => [override.hostId, override]));

    return hosts.map((host) => {
        const override = overrides.get(host.id);
        if (!override) return host;

        return {
            ...host,
            originalAlias: host.alias,
            customAlias: override.customAlias ?? undefined,
            alias: override.customAlias || host.alias,
            color: override.color ?? host.color,
            notes: override.notes ?? undefined,
            hidden: override.hidden,
            originalUser: host.user,
            user: override.username ?? host.user,
            authMethod: override.authMethod ?? host.authMethod,
            hasOverridePassword: override.hasPassword
        };
    });
};

const applyForwardCounts = (hosts: SshHost[]): SshHost[] => {
    const counts = new Map<string, number>();
    for (const forward of listAllPortForwards()) {
        if (!forward.enabled) continue;
        counts.set(forward.hostId, (counts.get(forward.hostId) ?? 0) + 1);
    }

    return hosts.map((host) => {
        const count = counts.get(host.id);
        return count ? { ...host, forwardCount: count } : host;
    });
};

export async function listAllSshHosts(): Promise<{ visible: SshHost[]; hidden: SshHost[] }> {
    const [fileHosts, savedHosts] = await Promise.all([
        listFileBasedHosts(),
        Promise.resolve(listSavedHosts())
    ]);

    const merged = [...savedHosts.map(savedHostToSshHost), ...fileHosts];
    const enriched = applyForwardCounts(applyOverrides(merged));

    return {
        visible: enriched.filter((host) => !host.hidden),
        hidden: enriched.filter((host) => host.hidden)
    };
}
