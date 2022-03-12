import fs from 'fs';
import path from 'path';
import { normalizePath } from 'vite';

/**
 * 文件/目录是否存在
 * @param filePath 文件路径
 * @returns {Promise<boolean>}
 */
const exists = async (filePath) =>
  await fs.promises
    .access(filePath)
    .then(() => true)
    .catch((_) => false);

export default function vitePluginRewriteImport(options = {}) {
  const { spareDirName = '', prefix = '' } = options;

  const newFilename = (filename) => {
    const prefixFilename = `${prefix}${filename}`;

    if (!spareDirName) return prefixFilename;

    return `${spareDirName}/${prefixFilename}`;
  };

  let root;

  return {
    name: 'vite-plugin-rewrite-import',

    configResolved(config) {
      root = normalizePath(config.root);
    },

    async resolveId(importee, importer, resolveOptions) {
      if (!importer) return null;

      const filename = path.basename(importee);

      const updatedId = normalizePath(importee.replace(filename, newFilename(filename)));

      const filePath = normalizePath(updatedId.startsWith(root) ? updatedId : path.join(root, updatedId));

      if (await exists(filePath)) {
        return this.resolve(updatedId, importer, Object.assign({ skipSelf: true }, resolveOptions)).then(
          (resolved) => resolved || { id: updatedId },
        );
      }

      return null;
    },
  };
}
