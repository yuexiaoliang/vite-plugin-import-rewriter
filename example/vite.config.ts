import { defineConfig } from 'vite';
import reweiter from 'vite-plugin-import-rewriter';

export default defineConfig({
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
  },
  plugins: [
    reweiter({
      front: 'china/' // result: china/log.ts
      // front: 'countrys/china-' // result: countrys/china-log.ts
    })
  ]
});
