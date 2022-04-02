var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

// src/consts.ts
var DEFAULT_EXTENSIONS = [
  ".mjs",
  ".js",
  ".ts",
  ".jsx",
  ".tsx",
  ".json"
];
var DEFAULT_OPTIONS = {
  start: "rewriter"
};

// src/utils.ts
import path from "path";
import resolve from "resolve";
import { normalizePath } from "vite";
import qs from "qs";
var resolvePath = (_path, extensions) => {
  try {
    return resolve.sync(_path, {
      basedir: path.dirname(_path),
      extensions: extensions || DEFAULT_EXTENSIONS
    });
  } catch (error) {
    return "";
  }
};
var isExistsFile = (_path, extensions) => {
  return !!resolvePath(_path, extensions);
};
function getNewIdByMethod(id, methodName, methods) {
  if (!methodName || !methods)
    return id;
  const method = methods == null ? void 0 : methods[methodName];
  return method(id);
}
function getSignMethod(id, sign) {
  return getIdSearch(id)[sign];
}
function delSign(id, sign) {
  const search = getIdSearch(id);
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
function isIdIncludeSign(id, sign) {
  const searchKeys = getIdSearchKeys(id);
  return searchKeys.includes(sign);
}
function getIdBasename(id, start) {
  if (!start)
    return id;
  const basename = path.basename(id);
  return normalizePath(id.replace(basename, `${start}${basename}`));
}
function getResolvePath(basename, root, extensions) {
  const _path = basename.startsWith(root) ? basename : path.join(root, basename);
  return normalizePath(resolvePath(_path, extensions));
}
function getIdSearch(id) {
  return qs.parse(id.split("?")[1]);
}
function getIdSearchKeys(id) {
  return Object.keys(getIdSearch(id));
}

// src/getResolveId.ts
function getResolveId(id, options) {
  const { start = DEFAULT_OPTIONS.start, sign, methods, root } = options;
  const extensions = options.extensions;
  let resolveID = id;
  if (sign) {
    if (!isIdIncludeSign(id, sign))
      return id;
    const methodName = getSignMethod(id, sign);
    const deletedId = delSign(id, sign);
    resolveID = getNewIdByMethod(deletedId, methodName, methods);
  }
  let basename = getIdBasename(resolveID, start);
  let newResolveID = getResolvePath(basename, root, extensions);
  if (newResolveID && isExistsFile(newResolveID))
    return newResolveID;
  if (isExistsFile(getResolvePath(resolveID, root, extensions)))
    return resolveID;
  return `@${start}-virtual-module`;
}

// src/index.ts
function vitePluginRewriteImport(options = {}) {
  let root;
  let extensions;
  return {
    name: "vite-plugin-rewrite-import",
    enforce: "pre",
    configResolved(config) {
      root = config.root;
      extensions = config.resolve.extensions;
    },
    async resolveId(id, importer, resolveIdOptions) {
      if (!importer)
        return null;
      const resolveId = await getResolveId(id, __spreadValues({
        root,
        extensions
      }, options));
      const resolved = await this.resolve(resolveId, importer, Object.assign({ skipSelf: true }, resolveIdOptions));
      return resolved || { id: resolveId };
    },
    load(id) {
      const { start = DEFAULT_OPTIONS.start, virtualModule } = options;
      if (id === `@${start}-virtual-module`) {
        return virtualModule;
      }
    }
  };
}
export {
  vitePluginRewriteImport as default
};
