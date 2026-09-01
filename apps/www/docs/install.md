---
title: Using a bundler
nav: Bundler
order: 10
---

Most people should start with [a page in one file](/docs/one-file). If you already have Vite, you can import SvenJS like any ESM package.

```bash
npm install svenjs
```

In `tsconfig.json` (or Vite's esbuild JSX settings):

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "svenjs"
  }
}
```

There is no separate `svenjsx` package. `svenjs/jsx-runtime` ships with the runtime.

A CDN / script-tag build is emitted as `svenjs.iife.js` for the original “drop it in a page” goal.
