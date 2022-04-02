import { ResolvedConfig, Plugin } from 'vite';

import getResolveId from './getResolveId';
import { DEFAULT_OPTIONS } from './consts';

import type { Extensions, UserOptions } from './types';
import type {
  PluginContext,
  ResolveIdResult,
  CustomPluginOptions
} from 'rollup';

export default function vitePluginRewriteImport(options: UserOptions = {}): Plugin {
  let root: string;
  let extensions: Extensions;

  return {
    name: 'vite-plugin-rewrite-import',
    enforce: 'pre',

    configResolved(config: ResolvedConfig): void | Promise<void> {
      root = config.root;
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

      const resolveId = await getResolveId(id, {
        root,
        extensions,
        ...options
      });

      const resolved = await this.resolve(
        resolveId,
        importer,
        Object.assign({ skipSelf: true }, resolveIdOptions)
      );

      return resolved || { id: resolveId };
    },

    // @ts-ignore
    load(this: PluginContext, id: string) {
      const { start = DEFAULT_OPTIONS.start, virtualModule } = options;
      if (id === `@${start}-virtual-module`) {
        return virtualModule;
      }
    }
  };
}
