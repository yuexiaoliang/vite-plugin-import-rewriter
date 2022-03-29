# vite-plugin-import-rewriter

重写 `import` 的 `vite` 插件。

## 使用

1. 安装

```bash
yarn add -D vite-plugin-import-rewriter

# or

npm install -D vite-plugin-import-rewriter
```

2. 使用

```js
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

```

## Options

### **start**

- Type: `string`

- Default: `rewriter`

  导入的文件名开始位置拼接的值，然后去查找拼接后的模块，查找到则导入找到的模块，找不到则导入原模块。

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

  如果配置了，只有指定标记的 `import` 才会经过插件重写，不指定则所有导入都会经过插件处理。

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

  通过自定义的方法进行重写

  ```js
  // vite.config.js
  import path from 'path';
  import { defineConfig } from 'vite';
  import rewriter from 'vite-plugin-import-rewriter';

  function getNewID(id: string, newID) {
    const basename = path.basename(id);
    return id.replace(basename, newID)
  }

  export default defineConfig({
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

  // ------------ //

  // index.js
  // old
  import log1 from './src/log';
  import log2 from './src/log?rewriter-prefix=toJS'
  import log3 from './src/log?rewriter-prefix';
  import log4 from './src/log?rewriter-prefix=toChina'


  // new
  import log1 from './src/log';
  import log2 from './src/log.js'
  import log3 from './src/countrys/china-log';
  import log4 from './src/china/log'
  ```

## TODO
### 只限于指定配置的环境中使用

有一些模块，只能在特定模式下使用，也就是说可能不存在默认模块，这种情况下就会出现导入错误。
