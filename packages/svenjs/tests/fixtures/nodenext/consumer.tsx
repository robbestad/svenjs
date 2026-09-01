import Svenjs, {
  Fragment,
  create,
  createStore,
  h,
  html,
  hydrate,
  renderToString,
  type VNode,
} from "svenjs";
import { jsx } from "svenjs/jsx-runtime";
import { jsxDEV } from "svenjs/jsx-dev-runtime";

const Greeting = create<{ name: string }, { count: number }>({
  initialState: { count: 0 },
  render() {
    return <p>{this.props.name}: {this.state.count}</p>;
  },
});

const store = createStore({ state: { ready: true } });
const jsxTree: VNode = <Greeting name="Sven" />;
const hTree = h("div", null, jsxTree);
const templateTree = html`<strong>ready</strong>`;

renderToString(hTree);
store.get();
void [Svenjs, Fragment, hydrate, jsx, jsxDEV, templateTree];
