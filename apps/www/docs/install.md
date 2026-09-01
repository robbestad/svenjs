---
title: Install
nav: Install
order: 1
---

SvenJS 3 is a single ESM package. Use it with Vite (this site does) or any bundler that understands the automatic JSX runtime.

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
