import { createRequire } from "node:module";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";

const root = fileURLToPath(new URL(".", import.meta.url));
const svenjsEntry = resolve(root, "../../packages/svenjs/src/index.ts");
const require = createRequire(import.meta.url);

function playgroundRuntime(): Plugin {
  async function bundle() {
    const esbuild = require("esbuild") as typeof import("esbuild");
    const result = await esbuild.build({
      entryPoints: [svenjsEntry],
      bundle: true,
      format: "iife",
      globalName: "Svenjs",
      footer: {
        js: "globalThis.Svenjs=Object.assign(Svenjs.default||{},Svenjs);",
      },
      write: false,
      platform: "browser",
      target: "es2022",
    });
    return result.outputFiles[0].text;
  }

  return {
    name: "playground-svenjs",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0];
        if (url !== "/playground-svenjs.js") return next();
        const code = await bundle();
        res.setHeader("Content-Type", "application/javascript; charset=utf-8");
        res.setHeader("Cache-Control", "no-cache");
        res.end(code);
      });
    },
    async generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "playground-svenjs.js",
        source: await bundle(),
      });
    },
  };
}

export default defineConfig({
  plugins: [playgroundRuntime()],
  resolve: {
    alias: [
      {
        find: "svenjs/jsx-dev-runtime",
        replacement: resolve(root, "../../packages/svenjs/src/jsx-dev-runtime.ts"),
      },
      {
        find: "svenjs/jsx-runtime",
        replacement: resolve(root, "../../packages/svenjs/src/jsx-runtime.ts"),
      },
      {
        find: "svenjs",
        replacement: resolve(root, "../../packages/svenjs/src/index.ts"),
      },
    ],
  },
  optimizeDeps: {
    exclude: ["svenjs"],
  },
  server: {
    port: 5173,
  },
  build: {
    chunkSizeWarningLimit: 800,
  },
});
