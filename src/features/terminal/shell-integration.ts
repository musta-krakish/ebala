import fs from 'fs';
import os from 'os';
import path from 'path';
import { randomUUID } from 'crypto';

/**
 * Shell integration injector. Spawns the user's shell so it emits OSC 133
 * semantic-prompt markers (A=prompt start, B=prompt end, C=output start,
 * D;exit=command done), OSC 633;E=<command line>, and OSC 7=cwd — which the
 * renderer parses into command "blocks" (Warp-style).
 *
 * zsh: a throwaway ZDOTDIR whose startup files source the user's real rc (with
 * ZDOTDIR restored) and then append hooks. bash: a --rcfile that sources the
 * user's profile then installs a DEBUG trap + PROMPT_COMMAND. Unknown shells
 * fall back to a plain interactive shell with no blocks.
 *
 * ESC (\x1b) and BEL (\x07) are written as literal bytes into the scripts so the
 * shell's `printf` passes them straight through.
 */

export interface ShellIntegration {
    args: string[];
    env: Record<string, string>;
    cleanup: () => void;
    /** True when OSC-133 hooks were injected (renderer can show block UI). */
    integrated: boolean;
}

const ESC = '\x1b';
const BEL = '\x07';

function mkTempDir(): string {
    const dir = path.join(os.tmpdir(), `ebala-shell-${randomUUID()}`);
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
    return dir;
}

function noCleanup() {
    /* nothing to clean for plain shells */
}

export function buildShellIntegration(
    shell: string,
    baseEnv: NodeJS.ProcessEnv
): ShellIntegration {
    const name = path.basename(shell);
    try {
        if (name === 'zsh') return buildZsh(baseEnv);
        if (name === 'bash') return buildBash(baseEnv);
    } catch {
        // Any FS/permission failure → degrade to a plain shell rather than break.
    }
    return { args: ['-i'], env: { ...baseEnv } as Record<string, string>, cleanup: noCleanup, integrated: false };
}

function buildZsh(baseEnv: NodeJS.ProcessEnv): ShellIntegration {
    const dir = mkTempDir();
    const userZdotdir = baseEnv.ZDOTDIR || os.homedir();

    // Each startup file: restore real ZDOTDIR, source the user's matching file,
    // re-capture ZDOTDIR (user rc may change it), then point back at our temp
    // dir so zsh loads the next file from us.
    const restoreAndSource = (file: string) =>
        [
            'ZDOTDIR="$EBALA_USER_ZDOTDIR"',
            `[[ -f "$EBALA_USER_ZDOTDIR/${file}" ]] && source "$EBALA_USER_ZDOTDIR/${file}"`,
            'EBALA_USER_ZDOTDIR="$ZDOTDIR"',
            'ZDOTDIR="$EBALA_TEMP_ZDOTDIR"'
        ].join('\n');

    const zshenv = [
        'EBALA_TEMP_ZDOTDIR="$ZDOTDIR"',
        ': ${EBALA_USER_ZDOTDIR:=$HOME}',
        restoreAndSource('.zshenv')
    ].join('\n') + '\n';

    const zprofile = restoreAndSource('.zprofile') + '\n';
    const zlogin = restoreAndSource('.zlogin') + '\n';

    const hooks = [
        '',
        'autoload -Uz add-zsh-hook 2>/dev/null',
        '__ebala_preexec() {',
        '  local cmd=${1//$\'\\n\'/ }',
        `  printf '${ESC}]633;E;%s${BEL}' "$cmd"`,
        `  printf '${ESC}]133;C${BEL}'`,
        '}',
        '__ebala_precmd() {',
        '  local ec=$?',
        `  printf '${ESC}]133;D;%s${BEL}' "$ec"`,
        `  printf '${ESC}]133;A${BEL}'`,
        `  printf '${ESC}]7;file://%s%s${BEL}' "$HOST" "$PWD"`,
        '}',
        'add-zsh-hook preexec __ebala_preexec',
        'add-zsh-hook precmd __ebala_precmd',
        `PS1="$PS1"$'%{${ESC}]133;B${BEL}%}'`,
        ''
    ].join('\n');

    const zshrc = restoreAndSource('.zshrc') + '\n' + hooks;

    fs.writeFileSync(path.join(dir, '.zshenv'), zshenv, { mode: 0o600 });
    fs.writeFileSync(path.join(dir, '.zprofile'), zprofile, { mode: 0o600 });
    fs.writeFileSync(path.join(dir, '.zshrc'), zshrc, { mode: 0o600 });
    fs.writeFileSync(path.join(dir, '.zlogin'), zlogin, { mode: 0o600 });

    return {
        args: ['-l', '-i'],
        env: { ...baseEnv, ZDOTDIR: dir, EBALA_USER_ZDOTDIR: userZdotdir } as Record<string, string>,
        cleanup: () => {
            try {
                fs.rmSync(dir, { recursive: true, force: true });
            } catch {
                /* ignore */
            }
        },
        integrated: true
    };
}

function buildBash(baseEnv: NodeJS.ProcessEnv): ShellIntegration {
    const dir = mkTempDir();
    const rcfile = path.join(dir, 'ebala-bashrc');

    // --rcfile is only honored by interactive NON-login bash, so we spawn `-i`
    // (no -l) and source the user's profile ourselves to approximate login env.
    const rc = [
        'if [[ -f "$HOME/.bash_profile" ]]; then source "$HOME/.bash_profile"',
        'elif [[ -f "$HOME/.bashrc" ]]; then source "$HOME/.bashrc"; fi',
        '',
        '__ebala_preexec() {',
        '  [[ -n "$COMP_LINE" ]] && return',
        '  [[ "$BASH_COMMAND" == "$PROMPT_COMMAND" ]] && return',
        '  [[ -n "$__ebala_inflight" ]] && return',
        '  __ebala_inflight=1',
        '  local cmd=${BASH_COMMAND//$\'\\n\'/ }',
        `  printf '${ESC}]633;E;%s${BEL}' "$cmd"`,
        `  printf '${ESC}]133;C${BEL}'`,
        '}',
        '__ebala_precmd() {',
        '  local ec=$?',
        `  printf '${ESC}]133;D;%s${BEL}' "$ec"`,
        `  printf '${ESC}]133;A${BEL}'`,
        `  printf '${ESC}]7;file://%s%s${BEL}' "$HOSTNAME" "$PWD"`,
        '  __ebala_inflight=',
        '}',
        "trap '__ebala_preexec' DEBUG",
        'case ";$PROMPT_COMMAND;" in',
        '  *__ebala_precmd*) ;;',
        '  *) PROMPT_COMMAND="__ebala_precmd${PROMPT_COMMAND:+;$PROMPT_COMMAND}" ;;',
        'esac',
        `PS1='\\[${ESC}]133;B${BEL}\\]'"$PS1"`,
        ''
    ].join('\n');

    fs.writeFileSync(rcfile, rc, { mode: 0o600 });

    return {
        args: ['-i', '--rcfile', rcfile],
        env: { ...baseEnv } as Record<string, string>,
        cleanup: () => {
            try {
                fs.rmSync(dir, { recursive: true, force: true });
            } catch {
                /* ignore */
            }
        },
        integrated: true
    };
}
