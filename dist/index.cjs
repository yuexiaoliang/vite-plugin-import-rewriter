var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => vitePluginRewriteImport
});
module.exports = __toCommonJS(src_exports);
var import_vite2 = require("vite");

// src/getUpdatedId.ts
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");

// src/utils.ts
var import_fs = __toESM(require("fs"), 1);
var import_resolve = __toESM(require("resolve"), 1);
var DEFAULT_EXTENSIONS = [
  ".mjs",
  ".js",
  ".ts",
  ".jsx",
  ".tsx",
  ".json"
];
var resolveFrom = (id, basedir, extensions) => {
  return import_resolve.default.sync(id, {
    basedir,
    extensions: extensions || DEFAULT_EXTENSIONS
  });
};
var exists = async (filePath) => await import_fs.default.promises.access(filePath).then(() => true).catch((_) => false);

// src/getUpdatedId.ts
async function getUpdatedId(id, config) {
  const { front = "" } = config.options;
  const root = (0, import_vite.normalizePath)(config.root);
  const basename = import_path.default.basename(id);
  let newBasename = (0, import_vite.normalizePath)(id.replace(basename, `${front}${basename}`));
  let filePath;
  try {
    const _path = newBasename.startsWith(root) ? newBasename : import_path.default.join(root, newBasename);
    filePath = (0, import_vite.normalizePath)(resolveFrom(_path, import_path.default.dirname(_path), config.extensions));
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
      root = (0, import_vite2.normalizePath)(config.root);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
