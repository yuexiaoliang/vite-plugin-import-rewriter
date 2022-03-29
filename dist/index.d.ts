import { Plugin } from 'vite';

declare type Methods = {
    [key: string]: (id: string) => string;
};
interface Options {
    /**
     * 文件名前边要添加的
     */
    start?: string;
    /**
     * 规定标记
     * 只有路径参数中包含该标记的文件才会被处理
     */
    sign?: string;
    methods?: Methods;
}
declare type TExtensions = string[] | undefined;
declare function vitePluginRewriteImport(options?: Options): Plugin;

export { Methods, Options, TExtensions, vitePluginRewriteImport as default };
