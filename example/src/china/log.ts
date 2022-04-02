export default (logs: string[], path: string) => {
  logs.push(`<div class="box"><p>import log from <span>'${path}'</span></p><p>this is <span>china/log<b>.ts</b></span></p></div>`);
};
