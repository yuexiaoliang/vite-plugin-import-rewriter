<h1 align="center">vite-plugin-import-rewriter</h1>

<p align="center">
  <a href="https://github.com/yuexiaoliang/vite-plugin-import-rewriter/blob/master/LICENSE">
    <img alt="GitHub" src="https://img.shields.io/github/license/yuexiaoliang/vite-plugin-import-rewriter?style=flat-square"/>
  </a>

  <a href="https://github.com/yuexiaoliang/vite-plugin-import-rewriter">
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/yuexiaoliang/vite-plugin-import-rewriter?style=flat-square"/>
  </a>
</p>

[简体中文](README_zh.md)

Rewriter the import based on conditions.

## Usage

1.Install the plugin

```bash
yarn add -D vite-plugin-import-rewriter

# or

npm install -D vite-plugin-import-rewriter
```

2. Configure the plugin

```js
import path from 'path';
import { defineConfig } from 'vite';
import rewriter from 'vite-plugin-import-rewriter';

function getNewID(id: string, newID) {
  const basename = path.basename(id);
  return id.replace(basename, newID);
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
          return id + '-js.js';
        },

        toChina: (id: string) => {
          return getNewID(id, 'china/log');
        }
      }
    })
  ]
});
```

## Options

### **start**

- Type: `string`

- Default: `rewriter`

  The value of the starting position of the file name to be imported, and then to look for the module after the Mosaic, find the module to be imported, find not to import the original module

  ```js
  // vite.config.js
  import rewriter from 'vite-plugin-import-rewriter';

  export default defineConfig({
    plugins: [
      rewriter({
        start: 'china/'
      })
    ]
  });

  // ------------ //

  // index.js
  // old
  import log from './log';
  // new
  import log from './china/log';
  ```

  or

  ```js
  // vite.config.js
  import rewriter from 'vite-plugin-import-rewriter';

  export default defineConfig({
    plugins: [
      rewriter({
        start: 'country/china-'
      })
    ]
  });

  // ------------ //

  // index.js
  // old
  import log from './log';
  // new
  import log from './country/china-log';
  ```

### **sign**

- Type: `string`

  If configured, only the 'import' of the specified tag will be overridden by the plug-in, otherwise all imports will be processed by the plug-in

  ```js
  // vite.config.js
  import rewriter from 'vite-plugin-import-rewriter';

  export default defineConfig({
    plugins: [
      rewriter({
        sign: 'rewrite',
        start: 'country/china-'
      })
    ]
  });

  // ------------ //

  // index.js
  // old
  import log from './log?rewrite'; // 会经过插件处理
  import err from './err'; // 不会经过插件处理

  // new
  import log from './country/china-log';
  import err from './err';
  ```

### **methods**

- Type: `{ [key: string]: (id: string) => string; }`

  Override with custom methods

  ```js
  // vite.config.js
  import path from 'path';
  import { defineConfig } from 'vite';
  import rewriter from 'vite-plugin-import-rewriter';

  function getNewID(id: string, newID) {
    const basename = path.basename(id);
    return id.replace(basename, newID);
  }

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
            return getNewID(id, 'china/log');
          }
        }
      })
    ]
  });

  // ------------ //

  // index.js
  // old
  import log1 from './src/log';
  import log2 from './src/log?rewriter-prefix=toJS';
  import log3 from './src/log?rewriter-prefix';
  import log4 from './src/log?rewriter-prefix=toChina';

  // new
  import log1 from './src/log';
  import log2 from './src/log.js';
  import log3 from './src/countrys/china-log';
  import log4 from './src/china/log';
  ```

### **virtualModule**

- Type: `string`

  Specify a virtual module to avoid errors if there is no default module.

  ```js
  // vite.config.js
  import path from 'path';
  import { defineConfig } from 'vite';
  import rewriter from 'vite-plugin-import-rewriter';

  export default defineConfig({
    plugins: [
      rewriter({
        start: 'countrys/china-',
        sign: 'rewriter-prefix',

        methods: {
          toChina: (id: string) => {
            const basename = path.basename(id);
            return id.replace(basename, 'china/' + basename);
          }
        },
        virtualModule: `
          export default (logs) => {
            logs.push('<p>this is <span>vite.config<b>.ts</b></span></p>');
          };
        `
      })
    ]
  });

  // ------------ //

  // index.js
  import log1 from './src/not-module?rewriter-prefix'; // ./src/china/not-module.ts
  import log2 from './src/not-module?rewriter-prefix=toChina'; // vite.config.ts ==> plugins.rewriter.virtualModule
  ```

## License

[License MIT](LICENSE)
