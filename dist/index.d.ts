import { Plugin } from 'vite';

declare type Methods = {
    [key: string]: (id: string) => string;
};
interface UserOptions {
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
    virtualModule?: string;
}

declare function vitePluginRewriteImport(options?: UserOptions): Plugin;

export { vitePluginRewriteImport as default };
