import fs from 'fs';

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