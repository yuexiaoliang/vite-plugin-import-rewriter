export default (logs, path) => {
  logs.push(
    `<div class="box"><p>import log from <span>'${path}'</span></p><p>this is <span>log-js<b class='blue'>.js</b></span></p></div>`
  );
};
