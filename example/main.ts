import log from './src/log';

const msg = log();
const msgEle = document.querySelector('.msg') as HTMLElement;

msgEle.innerText = msg;
