#!/usr/bin/env node
import os from 'os';
import fs from 'fs';

function ignoreErr(code: () => void) {
    try {
        code();
    } catch (e) { }
}

// call requireUserStr() to init
let userStr: string = '',            // user@host
    userLine: string = '---',        // ---------
    user: string = 'unknown-user',
    host: string = 'unknown-host'

function requireUserStr() {
    if (!userStr) {
        ignoreErr(() => {
            user = os.userInfo().username;
        })
        ignoreErr(() => {
            host = os.hostname();
        })
        userStr = user + '@' + host;
        userLine = "-".repeat(userStr.length);
    }
}

// call requireDistroStr() to init
let distroStr: string = '',
    distroStrFull: string = '',     // OS: Windows 11 Pro for Workstations x64
    distro: string = 'Unknown OS',
    distroArch: string = ''

function requireDistroStr() {
    if (!distroStr) {
        ignoreErr(() => {
            let platform = os.platform();
            if (platform == 'linux') {
                distro = 'Linux';
                ignoreErr(() => {
                    distro = fs.readFileSync('/etc/os-release', 'utf8').match(/PRETTY_NAME=(.*)/)![1].trim().replace(/["']/g, '');
                })
            } else if (platform == 'win32') {
                distro = os.version();
            } else if (platform == 'darwin') {
                distro = 'macOS';
            } else if (platform == 'android') {
                distro = 'Android';
            } else {
                distro = platform;
            }
        })
        ignoreErr(() => {
            distroArch = os.arch();
        })
        distroStr = distro + ' ' + distroArch;
        distroStrFull = 'OS: ' + distroStr;
    }
}

// call requireKernStr() to init
let kernStr: string = '',
    kern: string = '-.-.-'


function requireKernStr() {
    if (!kernStr) {
        ignoreErr(() => {
            kern = os.release();
        })
        kernStr = 'Kernel: ' + kern;
    }
}

// call requireNodedStr() to init
let nodeStr: string = '',
    node: string = 'TS/JS Engine'


function requireNodeStr() {
    if (!nodeStr) {
        ignoreErr(() => {
            node = 'Node.JS (' + process.version.slice(1) + ')'; // slice: remove 'v' in 'vX.Y.Z'
        })
        nodeStr = 'Engine: ' + node;
    }
}

// call requireUptimeStr() to init
let uptimeStr: string = '',
    uptime: string = '? day, ? hour, ? min',
    uptimeCache: number = 0


function requireUptimeStr() {
    if (uptimeCache != os.uptime()) {
        ignoreErr(() => {
            let uptimeCache = os.uptime();
            let days = Math.floor(uptimeCache / (24 * 60 * 60));
            let hours = Math.floor((uptimeCache % (24 * 60 * 60)) / (60 * 60));
            let minutes = Math.floor((uptimeCache % (60 * 60)) / 60);
            let uptimeFormat = (days: number, hours: number, minutes: number): string => {
                const dayStr = days === 1 ? `${days} day` : `${days} days`;
                const hourStr = hours === 1 ? `${hours} hour` : `${hours} hours`;
                const minuteStr = minutes === 1 ? `${minutes} min` : `${minutes} mins`;
            
                const parts = [];
                if (days > 0) parts.push(dayStr);
                if (hours > 0) parts.push(hourStr);
                if (minutes > 0) parts.push(minuteStr);
            
                return parts.join(', ');
            };
            uptime = uptimeFormat(days, hours, minutes);
        })
        uptimeStr = 'Uptime: ' + uptime;
    }
}

// call requireProcStr() to init
let procStr: string = '',
    proc: string = 'Common CPU',
    procCache: os.CpuInfo[]

function requireProcStr() {
    if (procCache != os.cpus()) {
        ignoreErr(() => {
            let procCache = os.cpus();
            let model = procCache[0].model.replace(/ *\((R|TM|C)\)/g, '');;
            let freq = (procCache[0].speed / 1000).toFixed(2);
            let thrs = procCache.length; // logical cores(threads)
            proc = `${model} (${thrs}) @ ${freq}GHz`
        })
        procStr = 'CPU: ' + proc;
    }
}

// call requireMemoryStr() to init
let memoryStr: string = '',
    memory: string = '? GiB',
    memT: number,
    memF: number

function requireMemoryStr() {
    if ((memF != os.freemem()) || (memT != os.totalmem())) {
        ignoreErr(() => {
            /*
                memX: in Bytes
                memXY: in MiB / GiB

                X: T=Total F=Free U=Used
                Y: M=MiB G=GiB A=Auto
            */
            let memUA, memTA;

            memT = os.totalmem();
            memF = os.freemem();
            let memU = memT - memF;

            let memUM = memU / (1024 ** 2);
            let memUG = memU / (1024 ** 3);
            if (memUG >= 1) {
                memUA = `${memUG.toFixed(1)} GiB`;
            } else {
                memUA = `${memUM.toFixed(1)} MiB`;
            }
            let memTM = memT / (1024 ** 2);
            let memTG = memT / (1024 ** 3);
            if (memTG >= 1) {
                memTA = `${(Math.ceil(memTG * 10) / 10).toFixed(1)} GiB`;
            } else {
                memTA = `${memTM.toFixed(1)} MiB`;
            }
            memory = memUA + ' / ' + memTA
        })
        memoryStr = 'Memory: ' + memory;
    }
}

function fetch() {
    requireDistroStr();
    requireUserStr();
    requireKernStr();
    requireNodeStr();
    requireUptimeStr();
    requireProcStr();
    requireMemoryStr();
    let newline = '\n';
    return (
        userStr + newline +
        userLine + newline +
        distroStrFull + newline +
        kernStr + newline +
        nodeStr + newline +
        uptimeStr + newline +
        procStr + newline +
        memoryStr
    );
}

if (require.main === module) {
    console.log(fetch());
}

export {
    requireUserStr, userStr, userLine,
    requireDistroStr, distroStrFull,
    requireKernStr, kernStr,
    requireNodeStr, nodeStr,
    requireUptimeStr, uptimeStr,
    requireProcStr, procStr,
    requireMemoryStr, memoryStr,
    fetch
}
