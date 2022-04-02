import path from 'path';
import resolve from 'resolve';
import { normalizePath } from 'vite';
import qs from 'qs';

import { DEFAULT_EXTENSIONS } from './consts';
import { Extensions, Methods } from './types';

export const resolvePath = (_path: string, extensions?: Extensions): string => {
  try {
    return resolve.sync(_path, {
      basedir: path.dirname(_path),
      extensions: extensions || DEFAULT_EXTENSIONS
    });
  } catch (error) {
    return '';
  }
};

/**
 * 文件
 * @param filePath 文件路径
 */
export const isExistsFile = (_path: string, extensions?: Extensions) => {
  return !!resolvePath(_path, extensions);
};

export function getNewIdByMethod(
  id: string,
  methodName: string,
  methods: Methods | undefined
) {
  if (!methodName || !methods) return id;

  const method = methods?.[methodName];

  return method(id);
}

export function getSignMethod(id: string, sign: string) {
  return getIdSearch(id)[sign] as string;
}

export function delSign(id: string, sign: string) {
  const search = getIdSearch(id);
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

export function isIdIncludeSign(id: string, sign: string) {
  const searchKeys = getIdSearchKeys(id);
  return searchKeys.includes(sign);
}

export function getIdBasename(id: string, start?: string) {
  if (!start) return id;

  const basename = path.basename(id);
  return normalizePath(id.replace(basename, `${start}${basename}`));
}

export function getResolvePath(
  basename: string,
  root: string,
  extensions: Extensions
) {
  const _path = basename.startsWith(root)
    ? basename
    : path.join(root, basename);

  return normalizePath(resolvePath(_path, extensions));
}

function getIdSearch(id: string) {
  return qs.parse(id.split('?')[1]);
}

function getIdSearchKeys(id: string) {
  return Object.keys(getIdSearch(id));
}