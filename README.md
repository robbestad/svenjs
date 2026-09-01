# SvenJS 3

A tiny JavaScript framework for composable web apps. JSX, immutable state, keyed DOM patch. No compiler.

This is a rewrite of SvenJS 2: same `create` / `setState` mental model, TypeScript runtime, Vite playground.

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

- `packages/svenjs` — runtime (`create`, `render`, `createStore`, JSX runtime)
- `apps/www` — docs, demos, and live playground (dogfoods the runtime)

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Playground + docs at http://localhost:5173 |
| `pnpm test` | Runtime tests (Vitest) |
| `pnpm test:e2e` | Playwright smoke tests for the site |
| `pnpm build` | Library + site |
| `pnpm --filter svenjs size` | Gzip size of the ESM build |

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
