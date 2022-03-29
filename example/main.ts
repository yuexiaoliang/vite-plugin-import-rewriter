import log1 from './src/log'; // ./src/log.ts
import log2 from './src/log?rewriter-prefix=toJS' // ./src/log.js

import log3 from './src/log?rewriter-prefix'; // ./src/countrys/china-log.ts
import log4 from './src/log?rewriter-prefix=toChina' // ./src/china/log.ts

const logs = []
log1(logs)
log2(logs)
log3(logs)
log4(logs)

const logContainer = document.querySelector('.logs')

logs.forEach(log => {
  logContainer.innerHTML += log
})
