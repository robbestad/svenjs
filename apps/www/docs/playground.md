---
title: Playground guide
nav: Playground
description: Use the SvenJS playground to edit, preview, share, copy, and download a one-file application.
order: 5
---

The [playground](/play/) runs your script against a local IIFE build in a sandboxed iframe.

The playground opens the small **Click** example. Mission Control is in the example list when you want the larger demo. The editor edits **application source** inside an HTML wrapper — it is not a full HTML/CSS IDE.

Preview uses the development runtime (key warnings and freeze checks). **Copy HTML** / **Download .html** embed the production runtime, current editor text, shared preview CSS, and the SvenJS credit chip. Open that file from disk: no npm, build step, network, or API key. A CDN starter still needs the network; the exported file does not.

**Copy HTML** and **Download .html** embed the current SvenJS runtime, application source, and styles directly in one file. Open that file from disk: no npm, build step, network, or API key.

Built-in examples share a short example identifier. Edited source is compressed into the URL hash. Nothing is uploaded.

The iframe cannot see the parent page and deliberately has no persistent storage origin. Downloaded files can keep device-local preferences when the browser permits `localStorage`. Do not paste secrets into the editor.

Mission Control demonstrates the small runtime core. Its routing, synthetic data source, keyboard controls, and persistence are ordinary application code—not built-in SvenJS platform features.
