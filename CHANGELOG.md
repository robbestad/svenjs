# Changelog

All notable SvenJS changes, reconstructed from the Git history starting with the first commit.

This document broadly follows [Keep a Changelog](https://keepachangelog.com/). Dates and versions prefixed with `v` come from Git tags. The 0.3 series is documented in the historical README but has no dedicated Git tags. The early `v0.2`–`v0.4` tags are retained as historical references, although `package.json` still declared `0.0.1-alpha` at the time.

## [Unreleased]

### Fixed

- Fixed the Mission Control alert layout and maximum height.
- Cleaned up a variable declaration in the same demo.

## [3.2.0] – 2026-09-02

### Added

- `this.observe(store)` to update components from stores without a dummy `setState`; subscriptions are cleaned up automatically on unmount.
- Mission Control as a complete, tested demo with dedicated routes and code-split demo views.
- Self-hosted fonts and an improved production playground on the website.

### Changed

- The renderer skips child components with unchanged props, and keyed-list handling is improved.
- Controlled `<select>` values are supported during mount, updates, and hydration.
- State is cloned and frozen only in development; the store API now has stricter TypeScript types.
- Static pages are prerendered with JSON-LD, `lastmod`, and proper HTTP 404 responses.

### Fixed

- Boolean `aria-*` and `data-*` attributes are serialized correctly.
- Event-name handling and tag-name validation are more predictable.

## [3.1.0] – 2026-09-01

### Added

- `hydrate()` to attach SvenJS to server-rendered HTML.
- Support for `initialState` as a function of component props.
- Support for object-based `style` props, correctly namespaced SVG, and `foreignObject`.
- Statically prerendered pages, Open Graph metadata, and Vercel deployment configuration.
- Test coverage for advanced runtime behaviour, state, and NodeNext consumers.

### Changed

- Components can render `null` and switch between empty and populated output without losing their DOM position.
- Scheduled and synchronous updates handle failures and subsequently queued updates more robustly.
- Ref cleanup, JSX prop forwarding, and server rendering are improved.

### Operations

- Added npm publishing through GitHub Actions, pinned pnpm, and updated vulnerable `happy-dom` dependencies.

## [3.0.1] – 2026-09-01

### Added

- The `html` tagged-template API, including test coverage and package exports.
- A one-file example that runs directly in the browser, with dedicated documentation and playground support.
- Documentation for lists and small one-file applications.

### Changed

- Updated package description, README, website, and size reporting for the browser-first API.

## [3.0.0] – 2026-09-01

### Breaking changes

- SvenJS was rewritten from the legacy JavaScript/Webpack codebase into a TypeScript runtime and monorepo. The old source, build files, and standalone example projects were removed.

### Added

- A new virtual-DOM runtime with keyed DOM patching, components, lifecycle hooks, state, stores, JSX runtime support, and server rendering.
- Modern package exports for ESM, the JSX runtime, types, and a browser IIFE.
- A pnpm workspace with Vite builds, Vitest tests, and type checking.
- A documentation and playground app with click, composition, and Todo demos, plus end-to-end smoke tests.
- License and npm-ready distribution artifacts.

## [Unversioned changes] – 2015-12-04 to 2018-08-24

This period contains commits but no published version boundary in Git history.

### Added

- Improved component handling and deep state freezing.
- A browser example, modular UUID/copy utilities, and TodoMVC as an inline browser module.
- ESLint configuration and refreshed example applications.

### Changed

- Modernized the build setup for newer Webpack versions and updated npm build/distribution support.
- Repaired and extended composition plus the examples' JSX/Webpack setup.

### Fixed

- A bug that prevented child components from updating after a state change.

### Removed

- Time-travel functionality.

## [0.3.2] – 2015-12-03

### Added

- The `beforeMount` lifecycle method.

## [0.3.1] – 2015-12-01

### Added

- Composition: components can be imported and referenced by name in JSX.

## [0.3.0] – 2015-12-01

### Changed

- Renamed lifecycle methods to `didMount` and `didUpdate`.

## [v0.4] – 2015-07-26

### Added

- Further TodoMVC and time-travel examples, plus a production build.

### Changed

- Simplified and adjusted component creation, rendering, and lifecycle handling through multiple fixes.

## [v0.3] – 2015-07-25

### Added

- Click, component, and TodoMVC examples with local Webpack setups.
- An expanded component and rendering runtime, including state and lifecycle work.

## [v0.2] – 2015-07-24

### Added

- An early component runtime with rendering, state, lifecycle, store, and time-travel experiments.
- Early buildable component examples and render-to-HTML tests.

## [0.0.1-alpha] – 2015-07-12

### Added

- The first SvenJS code: rendering core, state persistence, UI updates, and package/Webpack configuration.
- Initial component examples plus Babel and lint scripts.
