# vite-plugin-import-rewriter

`vite` 重写 `import` 的插件。

## TODO

### 配置后缀

配置指定后缀的 `import` 才会经过插件重写地址

```js
// config
import rewriteImport from 'vite-plugin-reweite-import'
rewriteImport({
  mark: 'rewrite'
})


// 使用
import Header from '@/components/Header.vue?rewrite'; // 会经过插件处理
import Aside from '@/components/Aside.vue'; // 不会经过插件处理
```

### 重写方法配置

指定通过自定义的方法进行冲洗

```js
// config
import rewriteImport from 'vite-plugin-reweite-import';
rewriteImport({
  mark: 'rewrite',
  methods: {
    isVueComponent(args) {
      const { importee, importer, optiosn, config } = args;
      if (importee.endsWith('.vue')) return true;
      return false
    }
  }
});

// 使用
import Footer from '@/components/Footer?rewrite=isVueComponent'; // 会经过 isVueComponent 处理
import Header from '@/components/Header.vue?rewrite'; // 会经过插件处理
import Aside from '@/components/Aside.vue'; // 不会经过插件处理
```

### 兼容 Extensions

处理兼容 `resolve.extensions` 配置

## 使用

```js
import vitePluginRewriteImport from './vite-plugin-rewrite-import';

export default defineConfig({
  plugins: [
    {
      ...vitePluginRewriteImport({
        spareDirName: 'spare',
        prefix: 'fix'
      }),
      enforce: 'pre'
    }
  ]
});
```

之后的每个模块导入都会在相对路径中查找`./spare/fix{filename}`，查找到则导入找到的模块，找不到则导入原模块，效果如下：

```js
// 原来的
import Index from 'Index.vue';

// 新的
import Index from 'spare/fixIndex.vue';
```

### options

- **spareDirName**
  用于查找模块的备用目录名

```js
// 例如
// spareDirName = 'com'

// 原来的
import Index from 'Index.vue';

// 新的
import Index from 'com/Index.vue';
```

- **prefix**
  新模块的文件名前缀

```js
// 例如
// prefix = 'fix'

// 原来的
import Index from 'Index.vue';

// 新的
import Index from 'fixIndex.vue';
```
