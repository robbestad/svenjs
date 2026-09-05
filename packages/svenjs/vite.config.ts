import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

const devBuild = process.env.SVEN_DEV === "1";

export default defineConfig(({ command }) => ({
  define:
    command === "build"
      ? {
          "import.meta.env.DEV": JSON.stringify(devBuild),
        }
      : undefined,
  build: {
    emptyOutDir: !devBuild,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "Svenjs",
      formats: ["es", "iife"],
      fileName: (format) => {
        if (devBuild) return format === "es" ? "svenjs.dev.js" : "svenjs.iife.dev.js";
        return format === "es" ? "svenjs.js" : "svenjs.iife.js";
      },
    },
    sourcemap: true,
    minify: "esbuild",
    target: "es2022",
    rollupOptions: {
      output: {
        exports: "named",
      },
    },
  },
  resolve: {
    alias: [
      { find: "svenjs/jsx-dev-runtime", replacement: resolve(__dirname, "src/jsx-dev-runtime.ts") },
      { find: "svenjs/jsx-runtime", replacement: resolve(__dirname, "src/jsx-runtime.ts") },
      { find: "svenjs", replacement: resolve(__dirname, "src/index.ts") },
    ],
  },
  test: {
    environment: "happy-dom",
  },
}));
