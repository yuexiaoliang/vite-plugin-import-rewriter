import { Plugin } from 'vite';

interface Options {
    /**
     * 文件名前边要添加的
     */
    front?: string;
}
declare type TExtensions = string[] | undefined;
declare function vitePluginRewriteImport(options?: Options): Plugin;

export { Options, TExtensions, vitePluginRewriteImport as default };
