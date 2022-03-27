import { normalizePath, ResolvedConfig, Plugin } from 'vite';

import { PluginContext, ResolveIdResult, CustomPluginOptions } from 'rollup';

import getUpdatedId from './getUpdatedId';

export interface Options {
  /**
   * 文件名前边要添加的
   */
  front?: string;
}

export type TExtensions = string[] | undefined;

export default function vitePluginRewriteImport(options: Options = {}): Plugin {
  let root: string;
  let extensions: TExtensions;

  return {
    name: 'vite-plugin-rewrite-import',
    enforce: 'pre',

    configResolved(config: ResolvedConfig): void | Promise<void> {
      root = normalizePath(config.root);
      extensions = config.resolve.extensions;
    },

    async resolveId(
      this: PluginContext,
      id: string,
      importer: string | undefined,
      resolveIdOptions: {
        custom?: CustomPluginOptions;
        ssr?: boolean;
      }
    ): Promise<ResolveIdResult> {
      if (!importer) return null;

      const updatedId = await getUpdatedId(id, {
        options,
        root,
        extensions
      });

      const resolved = await this.resolve(
        updatedId,
        importer,
        Object.assign({ skipSelf: true }, resolveIdOptions)
      );

      return resolved || { id: updatedId };
    }
  };
}
