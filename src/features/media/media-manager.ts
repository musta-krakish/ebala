import { execFile } from 'child_process';
import { existsSync, mkdirSync, statSync } from 'fs';
import path from 'path';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { helperCacheDir, helperSourceDir } from '../../electron/paths.ts';

const execFilePromise = promisify(execFile);

// Dev-time location of this feature's .swift sources (co-located here).
// Ignored in packaged builds, which read from the flattened resources dir.
const featureDir = path.dirname(fileURLToPath(import.meta.url));

// Only track music from real music apps — never browsers (Chrome/Safari/etc.
// would otherwise leak YouTube/SoundCloud/site audio into history). Add a
// bundle id here to enable a new source.
const ALLOWED_BUNDLE_IDS = new Set<string>([
    'com.spotify.client',     // Spotify
    'com.apple.Music',        // Apple Music
    'com.apple.iTunes',       // Legacy iTunes (still used on older macOS)
    'ru.yandex.desktop.music' // Yandex Music desktop app
]);

const isAllowedSource = (bundleId: string | null | undefined): boolean =>
    typeof bundleId === 'string' && ALLOWED_BUNDLE_IDS.has(bundleId);

export interface MediaTrack {
    id: string;
    title: string | null;
    artist: string | null;
    album: string | null;
    app: string | null;
    bundleId: string | null;
    pid: number | null;
    artworkUrl?: string | null;
    artworkDataUrl?: string | null;
    duration?: number | null;
    elapsed?: number | null;
    fetchedAt?: number;
    isPlaying: boolean;
    source: 'media-remote' | 'applescript' | 'none';
}

type MediaAction = 'play-pause' | 'next' | 'previous';

function numberFrom(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
}

function stringFrom(value: unknown): string | null {
    return typeof value === 'string' && value.trim() ? value : null;
}

function normalizeMediaRemoteEntry(info: Record<string, unknown>): MediaTrack {
    const title = stringFrom(info.kMRMediaRemoteNowPlayingInfoTitle);
    const artist = stringFrom(info.kMRMediaRemoteNowPlayingInfoArtist);
    const album = stringFrom(info.kMRMediaRemoteNowPlayingInfoAlbum);
    const bundleId = stringFrom(info.__bundleId);
    const pid = numberFrom(info.__pid);
    const displayName = stringFrom(info.__displayName);
    const app =
        displayName ??
        stringFrom(info.kMRMediaRemoteNowPlayingClientName) ??
        stringFrom(info.kMRMediaRemoteNowPlayingApplicationDisplayName) ??
        bundleId;
    const duration = numberFrom(info.kMRMediaRemoteNowPlayingInfoDuration);
    const elapsed = numberFrom(info.kMRMediaRemoteNowPlayingInfoElapsedTime);
    const playbackRate = numberFrom(info.kMRMediaRemoteNowPlayingInfoPlaybackRate);
    const timestamp = numberFrom(info.kMRMediaRemoteNowPlayingInfoTimestamp);
    const artworkBase64 = stringFrom(info.kMRMediaRemoteNowPlayingInfoArtworkData);
    const artworkMimeType = stringFrom(info.kMRMediaRemoteNowPlayingInfoArtworkMIMEType) ?? 'image/jpeg';

    return {
        id: `mr:${bundleId ?? 'unknown'}:${pid ?? 0}`,
        title,
        artist,
        album,
        app,
        bundleId,
        pid: pid ?? null,
        artworkUrl: null,
        artworkDataUrl: artworkBase64 ? `data:${artworkMimeType};base64,${artworkBase64}` : null,
        duration,
        elapsed,
        fetchedAt: timestamp ? timestamp * 1000 : Date.now(),
        isPlaying: playbackRate === null ? false : playbackRate > 0,
        source: 'media-remote'
    };
}

async function runAppleScript(script: string): Promise<string> {
    const { stdout } = await execFilePromise('osascript', ['-e', script], { timeout: 3000 });
    return stdout.toString().trim();
}

async function getSwiftHelper(scriptName: string): Promise<string> {
    const cacheDir = helperCacheDir();
    const sourcePath = path.join(helperSourceDir(featureDir), scriptName);
    const outputPath = path.join(cacheDir, scriptName.replace(/\.swift$/, ''));
    const needsBuild =
        !existsSync(outputPath) ||
        statSync(outputPath).mtimeMs < statSync(sourcePath).mtimeMs;

    if (needsBuild) {
        mkdirSync(cacheDir, { recursive: true });
        await execFilePromise('xcrun', ['swiftc', sourcePath, '-o', outputPath], { timeout: 15000 });
    }

    return outputPath;
}

async function fetchSpotifyTrack(): Promise<MediaTrack | null> {
    const script = `
        if application id "com.spotify.client" is running then
            tell application id "com.spotify.client"
                if player state is stopped then return ""
                set trackName to name of current track
                set trackArtist to artist of current track
                set trackAlbum to album of current track
                set trackDuration to duration of current track / 1000
                set trackPosition to player position
                set trackArtwork to artwork url of current track
                set trackPlaying to player state is playing
                return trackName & linefeed & trackArtist & linefeed & trackAlbum & linefeed & trackDuration & linefeed & trackPosition & linefeed & trackArtwork & linefeed & trackPlaying
            end tell
        else
            return ""
        end if
    `;
    try {
        const output = await runAppleScript(script);
        if (!output) return null;
        const [title, artist, album, duration, elapsed, artworkUrl, isPlaying] = output.split('\n');
        return {
            id: 'as:com.spotify.client',
            title,
            artist,
            album,
            app: 'Spotify',
            bundleId: 'com.spotify.client',
            pid: null,
            artworkUrl,
            artworkDataUrl: null,
            duration: numberFrom(duration),
            elapsed: numberFrom(elapsed),
            isPlaying: isPlaying === 'true',
            fetchedAt: Date.now(),
            source: 'applescript'
        };
    } catch {
        return null;
    }
}

async function fetchMusicTrack(): Promise<MediaTrack | null> {
    const script = `
        if application id "com.apple.Music" is running then
            tell application id "com.apple.Music"
                if player state is stopped then return ""
                set trackName to name of current track
                set trackArtist to artist of current track
                set trackAlbum to album of current track
                set trackDuration to duration of current track
                set trackPosition to player position
                set trackPlaying to player state is playing
                return trackName & linefeed & trackArtist & linefeed & trackAlbum & linefeed & trackDuration & linefeed & trackPosition & linefeed & trackPlaying
            end tell
        else
            return ""
        end if
    `;
    try {
        const output = await runAppleScript(script);
        if (!output) return null;
        const [title, artist, album, duration, elapsed, isPlaying] = output.split('\n');
        return {
            id: 'as:com.apple.Music',
            title,
            artist,
            album,
            app: 'Music',
            bundleId: 'com.apple.Music',
            pid: null,
            artworkUrl: null,
            artworkDataUrl: null,
            duration: numberFrom(duration),
            elapsed: numberFrom(elapsed),
            isPlaying: isPlaying === 'true',
            fetchedAt: Date.now(),
            source: 'applescript'
        };
    } catch {
        return null;
    }
}

const APPLESCRIPT_COMMANDS: Record<MediaAction, string> = {
    'play-pause': 'playpause',
    next: 'next track',
    previous: 'previous track'
};

const APPLESCRIPT_CONTROLLERS: Record<string, (action: MediaAction) => Promise<void>> = {
    'com.apple.Music': async (action) => {
        await runAppleScript(`tell application id "com.apple.Music" to ${APPLESCRIPT_COMMANDS[action]}`);
    },
    'com.spotify.client': async (action) => {
        await runAppleScript(`tell application id "com.spotify.client" to ${APPLESCRIPT_COMMANDS[action]}`);
    }
};

export class MediaManager {
    async getAllNowPlaying(): Promise<MediaTrack[]> {
        try {
            const swiftPath = path.join(helperSourceDir(featureDir), 'now-playing.swift');
            const { stdout } = await execFilePromise('swift', [swiftPath], { timeout: 7000 });
            const entries = JSON.parse(stdout.toString()) as Record<string, unknown>[];
            const tracks = entries
                .map(normalizeMediaRemoteEntry)
                .filter((track) => isAllowedSource(track.bundleId));
            if (tracks.length > 0) {
                return tracks;
            }
        } catch (error) {
            console.error('Failed to read MediaRemote now playing:', error);
        }

        // MediaRemote returned nothing from allowed sources — try AppleScript
        // directly for Spotify / Music (both already whitelisted).
        for (const fetcher of [fetchSpotifyTrack, fetchMusicTrack]) {
            const track = await fetcher();
            if (track && (track.title || track.artist)) {
                return [track];
            }
        }

        return [];
    }

    async control(action: MediaAction, bundleId?: string | null): Promise<{ success: boolean; error?: string }> {
        try {
            if (bundleId && bundleId in APPLESCRIPT_CONTROLLERS) {
                await APPLESCRIPT_CONTROLLERS[bundleId](action);
                return { success: true };
            }

            const helper = await getSwiftHelper('media-key.swift');
            await execFilePromise(helper, [action], { timeout: 2500 });
            return { success: true };
        } catch (error) {
            console.error('Failed to send media key:', error);
            return { success: false, error: error instanceof Error ? error.message : String(error) };
        }
    }
}
