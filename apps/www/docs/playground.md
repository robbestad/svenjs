---
title: Playground guide
nav: Playground
description: Use the SvenJS playground to edit, preview, share, copy, and download a one-file application.
order: 5
---

The [playground](/play/) runs your script against a local IIFE build in a sandboxed iframe.

Mission Control is the default example. Start its synthetic stream, sort or filter 100 keyed units while the SVG telemetry moves, then export the exact demo.

**Copy HTML** and **Download .html** embed the current SvenJS runtime, application source, and styles directly in one file. Open that file from disk: no npm, build step, network, or API key.

Built-in examples share a short example identifier. Edited source is compressed into the URL hash. Nothing is uploaded.

The iframe cannot see the parent page and deliberately has no persistent storage origin. Downloaded files can keep device-local preferences when the browser permits `localStorage`. Do not paste secrets into the editor.

Mission Control demonstrates the small runtime core. Its routing, synthetic data source, keyboard controls, and persistence are ordinary application code—not built-in SvenJS platform features.
