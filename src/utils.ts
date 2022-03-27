import fs from 'fs';
import resolve from 'resolve';

export const DEFAULT_EXTENSIONS = [
  '.mjs',
  '.js',
  '.ts',
  '.jsx',
  '.tsx',
  '.json'
];

export const resolveFrom = (
  id: string,
  basedir: string,
  extensions?: string[]
): string => {
  return resolve.sync(id, {
    basedir,
    extensions: extensions || DEFAULT_EXTENSIONS
  });
};

/**
 * 文件/目录是否存在
 * @param filePath 文件路径
 * @returns {Promise<boolean>}
 */
export const exists = async (filePath: string) =>
  await fs.promises
    .access(filePath)
    .then(() => true)
    .catch((_) => false);
