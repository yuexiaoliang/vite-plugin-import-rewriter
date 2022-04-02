import { DEFAULT_OPTIONS } from './consts';
import type { Options } from './types';
import {
  isExistsFile,
  isIdIncludeSign,
  getSignMethod,
  delSign,
  getNewIdByMethod,
  getIdBasename,
  getResolvePath
} from './utils';

export default function getResolveId(id: string, options: Options) {
  const { start = DEFAULT_OPTIONS.start, sign, methods, root } = options;

  const extensions = options.extensions;

  let resolveID: string = id;

  // 如果指定了 sign
  if (sign) {
    // 但是路径中不包含该标记，则不处理
    if (!isIdIncludeSign(id, sign)) return id;

    const methodName = getSignMethod(id, sign);
    // 如果路径中包含该标记，但是没有指定方法，则不处理
    const deletedId = delSign(id, sign);

    resolveID = getNewIdByMethod(deletedId, methodName, methods);
  }

  let basename = getIdBasename(resolveID, start);
  let newResolveID = getResolvePath(basename, root, extensions);

  // 如果找到了重写后模块的路径，则返回这个路径
  if (newResolveID && isExistsFile(newResolveID)) return newResolveID;

  // 如果原始路径的模块存在，则返回原始路径
  if (isExistsFile(getResolvePath(resolveID, root, extensions)))
    return resolveID;

  return `@${start}-virtual-module`;
}
