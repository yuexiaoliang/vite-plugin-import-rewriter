import path from 'path';

import { defineConfig } from 'vite';

import rewriter from 'vite-plugin-import-rewriter';

export default defineConfig({
  plugins: [
    rewriter({
      start: 'countrys/china-',
      sign: 'rewriter-prefix',

      methods: {
        toJS: (id: string) => {
          return id + '-js.js';
        },

        toChina: (id: string) => {
          const basename = path.basename(id);
          return id.replace(basename, 'china/' + basename);
        }
      },

      virtualModule: `
        export default (logs, path) => {
          logs.push(
          \`<div class="box"><p>import log from <span>'\${path}'</span></p><p>this is <span>vite.config<b>.ts</b></span></p></div>\`
          );
        };
      `
    })
  ]
});
