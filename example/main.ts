// @ts-nocheck
import log1 from './src/log'; // ./src/log.ts
import log2 from './src/log?rewriter-prefix=toJS'; // ./src/log.js

import log3 from './src/log?rewriter-prefix'; // ./src/countrys/china-log.ts
import log4 from './src/log?rewriter-prefix=toChina'; // ./src/china/log.ts

import log5 from './src/not-module?rewriter-prefix'; // ./src/china/not-module.ts

import log6 from './src/not-module?rewriter-prefix=toChina'; // vite.config.ts ==> plugins.rewriter.virtualModule

const logs = [];
log1(logs, './src/log');
log2(logs, './src/log?rewriter-prefix=toJS');
log3(logs, './src/log?rewriter-prefix');
log4(logs, './src/log?rewriter-prefix=toChina');
log5(logs, './src/not-module?rewriter-prefix');
log6(logs, './src/not-module?rewriter-prefix=toChina');

const logContainer = document.querySelector('.logs');

logs.forEach((log) => {
  logContainer.innerHTML += log;
});
