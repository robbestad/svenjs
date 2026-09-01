import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import MarkdownIt from "markdown-it";

const root = fileURLToPath(new URL(".", import.meta.url));
const svenjsEntry = resolve(root, "../../packages/svenjs/src/index.ts");
const require = createRequire(import.meta.url);

function compiledDocs(): Plugin {
  const md = new MarkdownIt({ html: false, linkify: true, typographer: true });
  return {
    name: "compiled-svenjs-docs",
    enforce: "pre",
    load(id) {
      const query = id.indexOf("?sven-doc");
      if (query === -1 || !id.slice(0, query).endsWith(".md")) return;
      const file = id.slice(0, query);
      const raw = readFileSync(file, "utf8");
      const end = raw.startsWith("---") ? raw.indexOf("\n---", 3) : -1;
      const frontmatter: Record<string, string> = {};
      let body = raw;
      if (end !== -1) {
        for (const line of raw.slice(3, end).trim().split("\n")) {
          const colon = line.indexOf(":");
          if (colon !== -1) frontmatter[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
        }
        body = raw.slice(end + 4).replace(/^\s+/, "");
      }
      const slug = basename(file, ".md");
      const title = frontmatter.title ?? slug;
      return `export default ${JSON.stringify({
        slug,
        title,
        nav: frontmatter.nav ?? title,
        description: frontmatter.description ?? `Learn ${title} in SvenJS 3.`,
        order: Number(frontmatter.order ?? 99),
        html: md.render(body),
      })}`;
    },
  };
}

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
      define: {
        "import.meta.env.DEV": "true",
      },
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

function previewRouteIndexes(): Plugin {
  return {
    name: "preview-route-indexes",
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = new URL(req.url ?? "/", "http://localhost");
        const pathname = url.pathname;
        if (pathname !== "/" && !pathname.endsWith("/") && !pathname.split("/").pop()?.includes(".")) {
          const index = resolve(root, "dist", pathname.slice(1), "index.html");
          if (existsSync(index)) req.url = `${pathname}/${url.search}`;
        }
        next();
      });
    },
  };
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: isSsrBuild ? [compiledDocs()] : [compiledDocs(), playgroundRuntime(), previewRouteIndexes()],
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
    copyPublicDir: !isSsrBuild,
  },
}));
