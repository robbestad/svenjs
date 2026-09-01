# SvenJS 3

A tiny JavaScript framework for composable web apps. One HTML file, a button, state. No npm required.

`html\`...\`` tagged templates in a script tag, or JSX if you already have Vite.

```bash
pnpm install
pnpm dev
```

```jsx
import { create, render } from "svenjs";

const App = create({
  initialState: { clicks: 0 },
  render() {
    return (
      <button onClick={() => this.setState({ clicks: this.state.clicks + 1 })}>
        {this.state.clicks}
      </button>
    );
  },
});

render(App, document.getElementById("app"));
```

## Packages

- `packages/svenjs` — runtime (`create`, `render`, `hydrate`, `renderToString`, state, JSX)
- `apps/www` — docs, demos, and live playground (dogfoods the runtime)

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Playground + docs at http://localhost:5173 |
| `pnpm test` | Runtime tests (Vitest) |
| `pnpm test:e2e` | Playwright smoke tests for the site |
| `pnpm build` | Library + site |
| `pnpm --filter svenjs size` | Raw + gzip size of the ESM and script-tag builds |

The site build prerenders every public route and generates canonical, social, sitemap, and robots metadata. Set `VITE_SITE_ORIGIN=https://your-domain.example` when deploying under a domain other than `https://svenjs.vercel.app`.

The flagship [Mission Control](https://svenjs.vercel.app/demo/mission-control/) demo runs 100 synthetic units through shared state, keyed sorting, SVG telemetry, lifecycle cleanup, local preferences, and the offline one-file export.

## tsconfig

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "svenjs"
  }
}
```

See [Heritage](apps/www/src/pages/heritage.tsx) for 2.x → 3.x. 2.0.2 is not drop-in compatible.

## License

ISC
