import { execFile } from 'child_process';
import { existsSync } from 'fs';
import os from 'os';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const POSIX_ENV = { ...process.env, LC_NUMERIC: 'C', LC_CTYPE: 'en_US.UTF-8' };

interface CpuSnapshot {
    idle: number;
    total: number;
}

interface NetworkSnapshot {
    rxBytes: number;
    txBytes: number;
    timestamp: number;
}

interface ProcessInfo {
    pid: number;
    ppid: number;
    user: string;
    cpuPercent: number;
    memoryBytes: number;
    name: string;
    command: string;
    role: string;
}

export interface ListedProcess {
    pid: number;
    ppid: number;
    user: string;
    isOwnUser: boolean;
    cpuPercent: number;
    memoryBytes: number;
    name: string;
    command: string;
    appPath: string | null;
    appName: string | null;
}

function extractAppPath(command: string): string | null {
    const match = command.match(/^(.*?\.app)\//);
    return match ? match[1] : null;
}

function appNameFromPath(appPath: string): string {
    const tail = appPath.split('/').filter(Boolean).pop() ?? appPath;
    return tail.replace(/\.app$/, '');
}

export interface KillResult {
    success: boolean;
    error?: string;
    code?: string;
}

export interface SystemMetrics {
    timestamp: number;
    cpu: {
        percent: number;
        cores: number;
        loadAverage: number[];
    };
    memory: {
        totalBytes: number;
        usedBytes: number;
        freeBytes: number;
        percent: number;
    };
    disk: {
        mount: string;
        totalBytes: number;
        usedBytes: number;
        freeBytes: number;
        percent: number;
    };
    network: {
        rxBytes: number;
        txBytes: number;
        rxBytesPerSecond: number;
        txBytesPerSecond: number;
    };
    project: {
        pid: number;
        processCount: number;
        cpuPercent: number;
        memoryPercent: number;
        memoryBytes: number;
        processes: Array<{
            pid: number;
            cpuPercent: number;
            memoryBytes: number;
            name: string;
            role: string;
        }>;
    };
}

const toNumber = (value: string | undefined) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

const getCpuSnapshot = (): CpuSnapshot => {
    return os.cpus().reduce(
        (snapshot, cpu) => {
            const total = Object.values(cpu.times).reduce((sum, value) => sum + value, 0);
            return {
                idle: snapshot.idle + cpu.times.idle,
                total: snapshot.total + total
            };
        },
        { idle: 0, total: 0 }
    );
};

export class SystemMonitor {
    private previousCpu = getCpuSnapshot();
    private previousNetwork: NetworkSnapshot | null = null;
    private projectRoot = (() => {
        const exe = process.execPath;
        const appMatch = exe.match(/^(.*?\.app)\//);
        if (appMatch) {
            return appMatch[1];
        }
        return process.cwd();
    })();
    private appName = this.projectRoot.split('/').filter(Boolean).pop()?.replace(/\.app$/, '') ?? 'app';

    async getMetrics(): Promise<SystemMetrics> {
        const [disk, network, project] = await Promise.all([
            this.getDiskMetrics(),
            this.getNetworkMetrics(),
            this.getProjectMetrics()
        ]);

        return {
            timestamp: Date.now(),
            cpu: this.getCpuMetrics(),
            memory: this.getMemoryMetrics(),
            disk,
            network,
            project
        };
    }

    private getCpuMetrics() {
        const current = getCpuSnapshot();
        const idleDelta = current.idle - this.previousCpu.idle;
        const totalDelta = current.total - this.previousCpu.total;
        this.previousCpu = current;

        const percent = totalDelta > 0 ? ((totalDelta - idleDelta) / totalDelta) * 100 : 0;

        return {
            percent: Math.min(Math.max(percent, 0), 100),
            cores: os.cpus().length,
            loadAverage: os.loadavg()
        };
    }

    private getMemoryMetrics() {
        const totalBytes = os.totalmem();
        const freeBytes = os.freemem();
        const usedBytes = totalBytes - freeBytes;

        return {
            totalBytes,
            usedBytes,
            freeBytes,
            percent: totalBytes > 0 ? (usedBytes / totalBytes) * 100 : 0
        };
    }

    private async getDiskMetrics() {
        const target = existsSync('/System/Volumes/Data') ? '/System/Volumes/Data' : '/';
        try {
            const { stdout } = await execFileAsync('df', ['-k', target], { env: POSIX_ENV });
            const line = stdout.trim().split('\n')[1];
            const parts = line?.trim().split(/\s+/) ?? [];
            const totalBytes = toNumber(parts[1]) * 1024;
            const usedBytes = toNumber(parts[2]) * 1024;
            const freeBytes = toNumber(parts[3]) * 1024;

            return {
                mount: '/',
                totalBytes,
                usedBytes,
                freeBytes,
                percent: totalBytes > 0 ? (usedBytes / totalBytes) * 100 : 0
            };
        } catch (error) {
            console.error('[SystemMonitor] df failed:', error);
            return {
                mount: '/',
                totalBytes: 0,
                usedBytes: 0,
                freeBytes: 0,
                percent: 0
            };
        }
    }

    private async getNetworkMetrics() {
        const current = await this.readNetworkTotals();
        const previous = this.previousNetwork;
        this.previousNetwork = current;

        if (!previous) {
            return {
                rxBytes: current.rxBytes,
                txBytes: current.txBytes,
                rxBytesPerSecond: 0,
                txBytesPerSecond: 0
            };
        }

        const elapsedSeconds = Math.max((current.timestamp - previous.timestamp) / 1000, 1);

        return {
            rxBytes: current.rxBytes,
            txBytes: current.txBytes,
            rxBytesPerSecond: Math.max((current.rxBytes - previous.rxBytes) / elapsedSeconds, 0),
            txBytesPerSecond: Math.max((current.txBytes - previous.txBytes) / elapsedSeconds, 0)
        };
    }

    private async readNetworkTotals(): Promise<NetworkSnapshot> {
        try {
            const { stdout } = await execFileAsync('netstat', ['-ibn'], { env: POSIX_ENV });
            const totals = stdout
                .trim()
                .split('\n')
                .slice(1)
                .reduce(
                    (sum, line) => {
                        const parts = line.trim().split(/\s+/);
                        const name = parts[0] ?? '';
                        const network = parts[2] ?? '';

                        if (!network.startsWith('<Link#') || name === 'lo0' || name.endsWith('*')) {
                            return sum;
                        }

                        return {
                            rxBytes: sum.rxBytes + toNumber(parts[6]),
                            txBytes: sum.txBytes + toNumber(parts[9])
                        };
                    },
                    { rxBytes: 0, txBytes: 0 }
                );

            return {
                ...totals,
                timestamp: Date.now()
            };
        } catch (error) {
            console.error('[SystemMonitor] netstat failed:', error);
            return {
                rxBytes: 0,
                txBytes: 0,
                timestamp: Date.now()
            };
        }
    }

    private async getProjectMetrics() {
        const processes = await this.getProcessList();
        const childrenByParent = new Map<number, ProcessInfo[]>();

        for (const item of processes) {
            const children = childrenByParent.get(item.ppid) ?? [];
            children.push(item);
            childrenByParent.set(item.ppid, children);
        }

        const projectProcesses: ProcessInfo[] = [];
        const seen = new Set<number>();
        const visit = (pid: number) => {
            if (seen.has(pid)) {
                return;
            }

            seen.add(pid);
            const processInfo = processes.find((item) => item.pid === pid);
            if (processInfo) {
                projectProcesses.push(processInfo);
            }

            for (const child of childrenByParent.get(pid) ?? []) {
                visit(child.pid);
            }
        };

        visit(process.pid);

        for (const item of processes) {
            if (this.isProjectProcess(item)) {
                visit(item.pid);
            }
        }

        const measuredProcesses = projectProcesses
            .filter((item) => !this.isCollectorProcess(item))
            .filter((item, index, source) => source.findIndex((match) => match.pid === item.pid) === index);
        const cpuPercent = measuredProcesses.reduce((sum, item) => sum + item.cpuPercent, 0);
        const memoryBytes = measuredProcesses.reduce((sum, item) => sum + item.memoryBytes, 0);
        const totalMemory = os.totalmem();

        return {
            pid: process.pid,
            processCount: measuredProcesses.length,
            cpuPercent,
            memoryPercent: totalMemory > 0 ? (memoryBytes / totalMemory) * 100 : 0,
            memoryBytes,
            processes: measuredProcesses
                .sort((left, right) => right.memoryBytes - left.memoryBytes)
                .slice(0, 8)
                .map((item) => ({
                    pid: item.pid,
                    cpuPercent: item.cpuPercent,
                    memoryBytes: item.memoryBytes,
                    name: item.name,
                    role: item.role
                }))
        };
    }

    private isProjectProcess(item: ProcessInfo) {
        const processText = item.command.toLowerCase();
        const root = this.projectRoot.toLowerCase();
        const appSupportPath = `/application support/${this.appName.toLowerCase()}`;
        const projectToolPaths = [
            `${root}/node_modules/.pnpm/electron`,
            `${root}/node_modules/.bin/electron`,
            `${root}/node_modules/.pnpm/vite`,
            `${root}/node_modules/.bin/vite`
        ];

        const isPackaged = root.endsWith('.app');

        return (
            item.pid === process.pid ||
            (isPackaged && processText.includes(root)) ||
            processText.includes(`--app-path=${root}`) ||
            processText.includes(appSupportPath) ||
            projectToolPaths.some((toolPath) => processText.includes(toolPath))
        );
    }

    private isCollectorProcess(item: ProcessInfo) {
        const processText = `${item.name} ${item.command}`.toLowerCase();

        return (
            item.ppid === process.pid &&
            (processText.includes('ps -axo pid,ppid,%cpu,rss,comm,args') ||
                processText.includes('netstat') ||
                processText.includes('df -k /'))
        );
    }

    private async getProcessList(): Promise<ProcessInfo[]> {
        try {
            const { stdout } = await execFileAsync('ps', ['-axo', 'pid,ppid,user,%cpu,rss,comm,args'], { env: POSIX_ENV });
            const lines = stdout.trim().split('\n');

            const parsed = lines
                .slice(1)
                .map((line) => {
                    const match = line.match(/^\s*(\d+)\s+(\d+)\s+(\S+)\s+([\d.]+)\s+(\d+)\s+(\S+)\s+(.*)$/);

                    if (!match) {
                        return null;
                    }

                    const commandPath = match[6] ?? '';
                    const command = match[7] ?? commandPath;
                    const name = commandPath.split('/').filter(Boolean).pop() ?? command.split(/\s+/)[0] ?? 'process';

                    return {
                        pid: toNumber(match[1]),
                        ppid: toNumber(match[2]),
                        user: match[3] ?? '',
                        cpuPercent: toNumber(match[4]),
                        memoryBytes: toNumber(match[5]) * 1024,
                        name,
                        command,
                        role: this.getProcessRole(name, command)
                    };
                })
                .filter((item): item is ProcessInfo => Boolean(item));

            return parsed;
        } catch (error) {
            console.error('[SystemMonitor] ps failed:', error);
            return [];
        }
    }

    async listAllProcesses(): Promise<ListedProcess[]> {
        const processes = await this.getProcessList();
        const currentUser = os.userInfo().username;

        return processes.map((item) => {
            const appPath = extractAppPath(item.command);
            return {
                pid: item.pid,
                ppid: item.ppid,
                user: item.user,
                isOwnUser: item.user === currentUser,
                cpuPercent: item.cpuPercent,
                memoryBytes: item.memoryBytes,
                name: item.name,
                command: item.command,
                appPath,
                appName: appPath ? appNameFromPath(appPath) : null
            };
        });
    }

    killProcess(pid: number, signal: NodeJS.Signals | number = 'SIGTERM'): KillResult {
        if (!Number.isInteger(pid) || pid <= 1) {
            return { success: false, error: 'Invalid PID', code: 'EINVAL' };
        }

        try {
            process.kill(pid, signal);
            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: error?.message ?? String(error),
                code: error?.code
            };
        }
    }

    private getProcessRole(name: string, command: string) {
        const processText = `${name} ${command}`.toLowerCase();

        if (processText.includes('--type=renderer')) return 'Renderer';
        if (processText.includes('--type=gpu-process')) return 'GPU';
        if (processText.includes('networkservice')) return 'Network';
        if (processText.includes('vite')) return 'Dev server';
        if (processText.includes('electron/cli')) return 'Electron CLI';
        if (processText.includes('electron.app/contents/macos/electron')) return 'Main';
        if (processText.includes('node')) return 'Node';

        return 'Helper';
    }
}
