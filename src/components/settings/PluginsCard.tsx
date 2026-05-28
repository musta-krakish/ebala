import { useEffect, useState } from 'react';
import { AlertTriangle, Loader2, Puzzle, Trash2 } from 'lucide-react';
import { rendererPlugins } from '../../features/renderer-plugins';
import { SettingCard } from './SettingCard';

interface PluginsCardProps {
    disabled: string[];
    ready: boolean;
}

interface PluginRowProps {
    label: string;
    description?: string;
    icon: React.ElementType;
    enabled: boolean;
    disabled?: boolean;
    onToggle: () => void;
    onUninstall?: () => void;
    uninstallConfirming?: boolean;
    source?: string;
}

export function PluginsCard({ disabled, ready }: PluginsCardProps) {
    const [external, setExternal] = useState<PluginInfo[]>([]);
    const [url, setUrl] = useState('');
    const [installing, setInstalling] = useState(false);
    const [errors, setErrors] = useState<string[] | null>(null);
    const [confirmUninstall, setConfirmUninstall] = useState<string | null>(null);

    const refresh = async () => {
        if (typeof window === 'undefined' || !window.pluginsAPI) return;
        try {
            setExternal(await window.pluginsAPI.list());
        } catch {
            // leave last known list
        }
    };

    useEffect(() => {
        const api = window.pluginsAPI;
        if (!api) return;
        api.list().then(setExternal).catch(() => undefined);
        const off = api.onChanged(refresh);
        return () => off();
    }, []);

    const toggle = (id: string, enabled: boolean) => {
        // Result broadcasts settings:changed; useAppSettings picks up the new
        // disabled set, so enabled state stays derived from the `disabled` prop.
        void window.pluginsAPI?.setEnabled(id, enabled);
    };

    const install = async () => {
        const value = url.trim();
        if (!value || !window.pluginsAPI) return;
        setInstalling(true);
        setErrors(null);
        try {
            const result = await window.pluginsAPI.install(value);
            if (result.ok) {
                setUrl('');
                await refresh();
            } else {
                setErrors(result.errors ?? ['Install failed']);
            }
        } catch (err) {
            setErrors([err instanceof Error ? err.message : 'Install failed']);
        } finally {
            setInstalling(false);
        }
    };

    const uninstall = async (id: string) => {
        await window.pluginsAPI?.uninstall(id);
        setConfirmUninstall(null);
        await refresh();
    };

    return (
        <SettingCard
            title="Plugins"
            description="Turn features on or off. Disabling a plugin hides its tab and stops its background work."
        >
            <ul className="space-y-2">
                {rendererPlugins.map((plugin) => (
                    <PluginRow
                        key={plugin.id}
                        label={plugin.label}
                        description={plugin.description}
                        icon={plugin.icon}
                        enabled={!disabled.includes(plugin.id)}
                        disabled={!ready}
                        onToggle={() => toggle(plugin.id, disabled.includes(plugin.id))}
                    />
                ))}

                {external.map((info) => (
                    <PluginRow
                        key={info.id}
                        label={info.name}
                        description={info.description}
                        icon={Puzzle}
                        source={info.source}
                        enabled={!disabled.includes(info.id)}
                        disabled={!ready}
                        onToggle={() => toggle(info.id, disabled.includes(info.id))}
                        uninstallConfirming={confirmUninstall === info.id}
                        onUninstall={() =>
                            confirmUninstall === info.id ? uninstall(info.id) : setConfirmUninstall(info.id)
                        }
                    />
                ))}
            </ul>

            <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-300">
                    Install from git
                </label>
                <div className="flex gap-2">
                    <input
                        className="h-9 flex-1 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-indigo-950"
                        value={url}
                        onChange={(event) => setUrl(event.target.value)}
                        placeholder="https://github.com/user/plugin.git or /local/path"
                        spellCheck={false}
                    />
                    <button
                        type="button"
                        onClick={install}
                        disabled={installing || !url.trim()}
                        className="inline-flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                    >
                        {installing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        Install
                    </button>
                </div>

                {errors && (
                    <ul className="mt-2 space-y-1 rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        {errors.map((message, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                {message}
                            </li>
                        ))}
                    </ul>
                )}

                <p className="mt-2 text-[11px] text-amber-700 dark:text-amber-400">
                    Plugins run with full app privileges. Only install code you trust — structure
                    validation is not a security sandbox.
                </p>
            </div>
        </SettingCard>
    );
}

function PluginRow({ label, description, icon: Icon, enabled, disabled, onToggle, onUninstall, uninstallConfirming, source }: PluginRowProps) {
    return (
        <li className="flex items-center gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/60">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{label}</div>
                {description && <div className="text-[11px] text-zinc-500 dark:text-zinc-400">{description}</div>}
                {source && <div className="truncate text-[10px] text-zinc-400 dark:text-zinc-500" title={source}>{source}</div>}
            </div>
            {onUninstall && (
                <button
                    type="button"
                    onClick={onUninstall}
                    className={`flex h-7 items-center gap-1 rounded-md border px-2 text-xs font-medium transition ${
                        uninstallConfirming
                            ? 'border-rose-300 bg-rose-600 text-white hover:bg-rose-700 dark:border-rose-700'
                            : 'border-zinc-200 bg-white text-zinc-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-rose-700 dark:hover:bg-rose-950 dark:hover:text-rose-300'
                    }`}
                >
                    <Trash2 className="h-3 w-3" aria-hidden="true" />
                    {uninstallConfirming ? 'Confirm' : 'Uninstall'}
                </button>
            )}
            <button
                type="button"
                disabled={disabled}
                onClick={onToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition disabled:opacity-50 ${
                    enabled ? 'bg-indigo-600' : 'bg-zinc-300 dark:bg-zinc-700'
                }`}
                aria-label={`Toggle ${label}`}
            >
                <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                        enabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                />
            </button>
        </li>
    );
}
