// src/index.ts
import { normalizePath as normalizePath2 } from "vite";

// src/getUpdatedId.ts
import path from "path";
import { normalizePath } from "vite";
import qs from "qs";

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
  const root = normalizePath(config.root);
  const { start = "rewriter", sign, methods } = config.options;
  console.log(`\u{1F680} => start`, start);
  const extensions = config.extensions;
  let _id = id;
  if (sign) {
    if (!isIDIncludeSign(id, sign))
      return id;
    const methodName = getSignMethod(id, sign);
    const deletedId = delSign(id, sign);
    _id = getNewIDByMethod(deletedId, methodName, methods);
  }
  let basename = getIDBasename(_id, start);
  let newID = resolveNewID(basename, root, extensions);
  if (!newID)
    return _id;
  return await exists(newID) ? newID : _id;
}
function getNewIDByMethod(id, methodName, methods) {
  if (!methodName || !methods)
    return id;
  const method = methods == null ? void 0 : methods[methodName];
  return method(id);
}
function getIDSearch(id) {
  return qs.parse(id.split("?")[1]);
}
function getIDSearchKeys(id) {
  return Object.keys(getIDSearch(id));
}
function getSignMethod(id, sign) {
  return getIDSearch(id)[sign];
}
function delSign(id, sign) {
  const search = getIDSearch(id);
  delete search[sign];
  const keys = Object.keys(search);
  if (keys.length === 0)
    return id.split("?")[0];
  let result = id.split("?")[0] + "?";
  keys.forEach((key, index) => {
    const val = search[key];
    if (index > 0)
      result += "&";
    result += val ? `${key}=${val}` : `${key}`;
  });
  return result;
}
function isIDIncludeSign(id, sign) {
  const searchKeys = getIDSearchKeys(id);
  return searchKeys.includes(sign);
}
function getIDBasename(id, start) {
  if (!start)
    return id;
  const basename = path.basename(id);
  return normalizePath(id.replace(basename, `${start}${basename}`));
}
function resolveNewID(basename, root, extensions) {
  let filePath;
  try {
    const _path = basename.startsWith(root) ? basename : path.join(root, basename);
    filePath = normalizePath(resolveFrom(_path, path.dirname(_path), extensions));
  } catch (error) {
  }
  return filePath;
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
