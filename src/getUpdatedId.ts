import path from 'path';

import { normalizePath } from 'vite';
import { Options, TExtensions } from './index';
import { resolveFrom, exists } from './utils';

interface Config {
  root: string;
  options: Options;
  extensions?: TExtensions;
}

export default async function getUpdatedId(
  id: string,
  config: Config
): Promise<string> {
  const { front = '' } = config.options;
  const root = normalizePath(config.root);

  const basename = path.basename(id);
  let newBasename = normalizePath(id.replace(basename, `${front}${basename}`));

  let filePath;

  try {
    const _path = newBasename.startsWith(root)
      ? newBasename
      : path.join(root, newBasename);

    filePath = normalizePath(resolveFrom(_path, path.dirname(_path), config.extensions));
  } catch (error) {}

  if (!filePath) return id;

  return (await exists(filePath)) ? filePath : id;
}
