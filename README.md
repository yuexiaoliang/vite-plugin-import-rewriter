# vite-plugin-import-rewriter

`vite` 重写 `import` 的插件。

## 使用

```js
import rewriter from 'vite-plugin-import-rewriter';

export default defineConfig({
  plugins: [
    rewriter({
      front: 'china/'
    })
  ]
});
```

每个模块导入都会在文件名前边拼接 `front` 设置的值 `china/`，然后才去查找模块，查找到则导入找到的模块，找不到则导入原模块。

## options

- **front**
  文件名前边要添加的

```js
// options
import rewriter from 'vite-plugin-import-rewriter';

export default defineConfig({
  plugins: [
    rewriter({
      front: 'china/'
    })
  ]
});

// old
import log from './log';
// new
import log from './china/log';
```

or

```js
// options
import rewriter from 'vite-plugin-import-rewriter';

export default defineConfig({
  plugins: [
    rewriter({
      front: 'country/china-'
    })
  ]
});

// old
import log from './log';
// new
import log from './country/china-log';
```

## TODO

### 配置后缀

配置指定标记的 `import` 才会经过插件重写

```js
// config
import rewriter from 'vite-plugin-import-rewriter';

export default defineConfig({
  plugins: [
    rewriter({
      mark: 'rewrite',
      front: 'country/china-'
    })
  ]
});

// 会经过插件处理

// old
import log from './log?rewrite';
import err from './err'; // 不会经过插件处理

// new
import log from './country/china-log';
import err from './err';
```

### 重写方法配置

通过自定义的方法进行重写

```js
// config
import rewriter from 'vite-plugin-import-rewriter';
import path from 'path';

export default defineConfig({
  plugins: [
    rewriter({
      methods: {
        rewriterVueComponent({ importee }) {
          if (!importee.endsWith('.vue')) return importee;

          const filename = path.basename(importee);
          return importee.replace(filename, `country/China${filename}`);
        }
      }
    })
  ]
});

// old
import Home from './Home.vue?rewrite=rewriterVueComponent'; // 会经过 isVueComponent 处理
import log from '.log'; // 不会经过插件处理

// new
import Home from './country/ChinaHome.vue'; // 会经过 isVueComponent 处理
import log from '.log'
```

### 只限于指定配置的环境中使用

有一些模块，只能在特定模式下使用，也就是说可能不存在默认模块，这种情况下就会出现导入错误，应解决这个问题。
