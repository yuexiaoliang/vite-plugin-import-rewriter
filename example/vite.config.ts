import path from 'path';

import { defineConfig } from 'vite';

import rewriter from 'vite-plugin-import-rewriter';

function getNewID(id: string, newID) {
  const basename = path.basename(id);
  return id.replace(basename, newID)
}

export default defineConfig({
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json']
  },
  plugins: [
    rewriter({
      start: 'countrys/china-',
      sign: 'rewriter-prefix',

      methods: {
        toJS: (id: string) => {
          return id + '.js';
        },

        toChina: (id: string) => {
          return getNewID(id, 'china/log');
        }
      }
    })
  ]
});
