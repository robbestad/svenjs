import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "Svenjs",
      formats: ["es", "iife"],
      fileName: (format) => (format === "es" ? "svenjs.js" : "svenjs.iife.js"),
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
});
