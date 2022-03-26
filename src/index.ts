import path from 'path';

import {
  normalizePath,
  ResolvedConfig,
  Plugin
} from 'vite';

import {
  PluginContext,
  ResolveIdResult,
  CustomPluginOptions
} from 'rollup';

import { exists } from './utils';

interface Options {
  /**
   * 文件名前边要添加的
   */
  front?: string;
}

export default function vitePluginRewriteImport(options: Options = {}): Plugin {
  const { front = '' } = options;

  const newFile = (filename: string) =>  `${front}${filename}`;

  let root: string;

  return {
    name: 'vite-plugin-rewrite-import',

    enforce: 'pre',

    configResolved(config: ResolvedConfig): void | Promise<void> {
      root = normalizePath(config.root);
    },

    async resolveId(
      this: PluginContext,
      importee: string,
      importer: string | undefined,
      resolveIdOptions: {
        custom?: CustomPluginOptions;
        ssr?: boolean;
      }
    ): Promise<ResolveIdResult> {
      if (!importer) return null;

      const filename = path.basename(importee);

      const updatedId = normalizePath(
        importee.replace(filename, newFile(filename))
      );

      const filePath = normalizePath(
        updatedId.startsWith(root) ? updatedId : path.join(root, updatedId)
      );

      if (await exists(filePath)) {
        const resolved = await this.resolve(
          updatedId,
          importer,
          Object.assign({ skipSelf: true }, resolveIdOptions)
        );

        return resolved || { id: updatedId };
      }

      return null;
    }
  };
}
