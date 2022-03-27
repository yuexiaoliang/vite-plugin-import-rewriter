// src/index.ts
import { normalizePath as normalizePath2 } from "vite";

// src/getUpdatedId.ts
import path from "path";
import { normalizePath } from "vite";

// src/utils.ts
import fs from "fs";
import resolve from "resolve";
var DEFAULT_EXTENSIONS = [
  ".mjs",
  ".js",
  ".ts",
  ".jsx",
  ".tsx",
  ".json"
];
var resolveFrom = (id, basedir, extensions) => {
  return resolve.sync(id, {
    basedir,
    extensions: extensions || DEFAULT_EXTENSIONS
  });
};
var exists = async (filePath) => await fs.promises.access(filePath).then(() => true).catch((_) => false);

// src/getUpdatedId.ts
async function getUpdatedId(id, config) {
  const { front = "" } = config.options;
  const root = normalizePath(config.root);
  const basename = path.basename(id);
  let newBasename = normalizePath(id.replace(basename, `${front}${basename}`));
  let filePath;
  try {
    const _path = newBasename.startsWith(root) ? newBasename : path.join(root, newBasename);
    filePath = normalizePath(resolveFrom(_path, path.dirname(_path), config.extensions));
  } catch (error) {
  }
  if (!filePath)
    return id;
  return await exists(filePath) ? filePath : id;
}

// src/index.ts
function vitePluginRewriteImport(options = {}) {
  let root;
  let extensions;
  return {
    name: "vite-plugin-rewrite-import",
    enforce: "pre",
    configResolved(config) {
      root = normalizePath2(config.root);
      extensions = config.resolve.extensions;
    },
    async resolveId(id, importer, resolveIdOptions) {
      if (!importer)
        return null;
      const updatedId = await getUpdatedId(id, {
        options,
        root,
        extensions
      });
      const resolved = await this.resolve(updatedId, importer, Object.assign({ skipSelf: true }, resolveIdOptions));
      return resolved || { id: updatedId };
    }
  };
}
export {
  vitePluginRewriteImport as default
};
