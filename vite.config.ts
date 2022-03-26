import { defineConfig } from 'vite';
import reweiter from './src/';

export default defineConfig({
  plugins: [
    reweiter({
      // front: 'china/' // result: china/log.ts
      front: 'countrys/china-' // result: countrys/china-log.ts
    })
  ]
});
