import path from 'path';

import { normalizePath } from 'vite';
import qs from 'qs';

import { Options, TExtensions, Methods } from './index';
import { resolveFrom, exists } from './utils';

interface Config {
  root: string;
  extensions?: TExtensions;
  options: Options;
}

export default async function getUpdatedId(
  id: string,
  config: Config
): Promise<string> {
  const root = normalizePath(config.root);

  const { start = 'rewriter', sign, methods } = config.options;
  console.log(`🚀 => start`, start);

  const extensions = config.extensions;

  let _id: string = id;

  // 如果指定了 sign
  if (sign) {
    // 但是路径中不包含该标记，则不处理
    if (!isIDIncludeSign(id, sign)) return id;

    const methodName = getSignMethod(id, sign);
    // 如果路径中包含该标记，但是没有指定方法，则不处理
    const deletedId = delSign(id, sign);

    _id = getNewIDByMethod(deletedId, methodName, methods);
  }

  let basename = getIDBasename(_id, start);
  let newID = resolveNewID(basename, root, extensions);

  if (!newID) return _id;

  return (await exists(newID)) ? newID : _id;
}

function getNewIDByMethod(
  id: string,
  methodName: string,
  methods: Methods | undefined
) {
  if (!methodName || !methods) return id;

  const method = methods?.[methodName];

  return method(id);
}

function getIDSearch(id: string) {
  return qs.parse(id.split('?')[1]);
}

function getIDSearchKeys(id: string) {
  return Object.keys(getIDSearch(id));
}

function getSignMethod(id: string, sign: string) {
  return getIDSearch(id)[sign] as string;
}

function delSign(id: string, sign: string) {
  const search = getIDSearch(id);
  delete search[sign];

  const keys = Object.keys(search);

  if (keys.length === 0) return id.split('?')[0];

  let result = id.split('?')[0] + '?';

  keys.forEach((key, index) => {
    const val = search[key];

    if (index > 0) result += '&';

    result += val ? `${key}=${val}` : `${key}`;
  });

  return result;
}

function isIDIncludeSign(id: string, sign: string) {
  const searchKeys = getIDSearchKeys(id);
  return searchKeys.includes(sign);
}

function getIDBasename(id: string, start?: string) {
  if (!start) return id;

  const basename = path.basename(id);
  return normalizePath(id.replace(basename, `${start}${basename}`));
}

function resolveNewID(basename: string, root: string, extensions: TExtensions) {
  let filePath;
  try {
    const _path = basename.startsWith(root)
      ? basename
      : path.join(root, basename);

    filePath = normalizePath(
      resolveFrom(_path, path.dirname(_path), extensions)
    );
  } catch (error) {}

  return filePath;
}
