import { createRequire } from "node:module";
import { createReadStream, existsSync, readFileSync } from "node:fs";
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
  async function bundle(prod: boolean) {
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
      minify: prod,
      platform: "browser",
      target: "es2022",
      define: {
        "import.meta.env.DEV": prod ? "false" : "true",
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
        const code = await bundle(false);
        res.setHeader("Content-Type", "application/javascript; charset=utf-8");
        res.setHeader("Cache-Control", "no-cache");
        res.end(code);
      });
    },
    async generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "playground-svenjs.js",
        source: await bundle(true),
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
        let pathname = url.pathname;
        if (pathname !== "/" && pathname.endsWith("/")) pathname = pathname.slice(0, -1);
        if (pathname !== "/" && !pathname.split("/").pop()?.includes(".")) {
          const index = resolve(root, "dist", pathname.slice(1), "index.html");
          if (existsSync(index)) req.url = `${pathname}/index.html${url.search}`;
        }
        next();
      });
      return () => {
        server.middlewares.use((req, res, next) => {
          if (res.headersSent) return next();
          const url = new URL(req.url ?? "/", "http://localhost");
          let pathname = url.pathname;
          if (pathname !== "/" && pathname.endsWith("/")) pathname = pathname.slice(0, -1);
          const page =
            pathname === "/"
              ? resolve(root, "dist", "index.html")
              : resolve(root, "dist", pathname.slice(1), "index.html");
          const direct = pathname === "/" ? page : resolve(root, "dist", pathname.slice(1));
          const file = existsSync(page) ? page : existsSync(direct) ? direct : null;
          if (file) {
            res.statusCode = 200;
            if (file.endsWith(".html")) res.setHeader("Content-Type", "text/html; charset=utf-8");
            createReadStream(file).pipe(res);
            return;
          }
          const dest = resolve(root, "dist", "404.html");
          if (!existsSync(dest)) return next();
          res.statusCode = 404;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          createReadStream(dest).pipe(res);
        });
      };
    },
  };
}

export default defineConfig(({ isSsrBuild, isPreview, command, mode }) => ({
  appType: isPreview || (command === "serve" && mode === "production") ? "mpa" : "spa",
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
    target: "es2022",
    chunkSizeWarningLimit: 800,
    copyPublicDir: !isSsrBuild,
  },
}));
