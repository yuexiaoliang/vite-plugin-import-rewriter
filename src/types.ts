export type Methods = {
  [key: string]: (id: string) => string;
};

export type Extensions = string[] | undefined;

export interface UserOptions {
  /**
   * 文件名前边要添加的
   */
  start?: string;

  /**
   * 规定标记
   * 只有路径参数中包含该标记的文件才会被处理
   */
  sign?: string;

  // 自定义重写方法
  methods?: Methods;

  // 虚拟模块
  virtualModule?: string;
}

export interface Options extends UserOptions {
  root: string;
  extensions?: Extensions;
}