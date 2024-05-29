# tsfetch
Command-line system information tool written in TypeScript.

## Install
```bash
# use -g if you want to install it as a command
npm i tsfetch-re
```

## Usage
- Run directly:
```bash
tsfetch
```

- ES Module:
```ts
import * as tsfetch from 'tsfetch-re';
console.log(tsfetch.fetch());
```

- Common JS:
```ts
const tsfetch = require('tsfetch-re');
console.log(tsfetch.fetch());
```

## Output
```
MBRjun@MBR-PC
-------------
OS: Windows 11 Pro for Workstations x64
Kernel: 10.0.22631
Engine: Node.JS (18.18.0)
Uptime: 1 day, 3 hours
CPU: 13th Gen Intel Core i5-13600KF (20) @ 3.49GHz
Memory: 17.6 GiB / 31.8 GiB
```
