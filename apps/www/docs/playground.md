---
title: Playground
nav: Playground
order: 9
---

The [playground](/play) compiles what you type with Sucrase (`jsx` + TypeScript) and loads it in an iframe with `sandbox="allow-scripts"`.

Examples are written as real modules:

```jsx
import { create, render } from "svenjs";
```

Those imports are rewritten to the IIFE build before the iframe runs, so a unique-origin sandbox can still load the runtime (module scripts from `origin: null` are blocked by CORS).

Share links store a compressed copy of the source in the URL hash. Nothing is uploaded.

The iframe cannot see the parent page. Do not paste secrets into it anyway.
