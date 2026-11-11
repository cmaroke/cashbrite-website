import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
// Trusted Node CLI only. Never import this loader from a public application route.
export function serverLoader(overrides = new Map(), environment = process.env, logger = console) {
  const cache = new Map();
  function load(relative) {
    const filename = path.resolve(relative);
    if (cache.has(filename)) return cache.get(filename).exports;
    const loaded = { exports: {} }; cache.set(filename, loaded);
    const resolve = (id) => {
      if (overrides.has(id)) return overrides.get(id);
      if (id === "server-only") return {}; // This loader itself runs only in trusted Node.
      if (id.startsWith("@/")) {
        const base = id.slice(2);
        return load(fs.existsSync(`${base}.ts`) ? `${base}.ts` : `${base}.tsx`);
      }
      return require(id);
    };
    const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    vm.runInNewContext(source, { exports: loaded.exports, module: loaded, require: resolve,
      Buffer, URL, Request, Response, setTimeout, clearTimeout, console: logger, process: { env: environment, cwd: () => process.cwd() } }, { filename });
    return loaded.exports;
  }
  return load;
}
