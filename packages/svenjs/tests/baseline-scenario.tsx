import { create, flushSync, render, unmountRoot } from "svenjs";

type Item = { id: number; t: string };

/** Fixed mount / same-order patch / reorder / remove scenario used for DOM-op baselines. */
export function runBaselineScenario(container: Element) {
  let setItems: ((items: Item[]) => void) | undefined;
  const App = create<{}, { items: Item[] }>({
    initialState: {
      items: [
        { id: 1, t: "a" },
        { id: 2, t: "b" },
        { id: 3, t: "c" },
      ],
    },
    onMount() {
      setItems = (items) => this.setState({ items });
    },
    render() {
      return (
        <ul>
          {this.state.items.map((item) => (
            <li key={item.id}>{item.t}</li>
          ))}
        </ul>
      );
    },
  });

  render(App, container);
  if (!setItems) throw new Error("baseline: missing instance");

  setItems([
    { id: 1, t: "a" },
    { id: 2, t: "B" },
    { id: 3, t: "c" },
  ]);
  flushSync();

  setItems([
    { id: 3, t: "c" },
    { id: 1, t: "a" },
    { id: 2, t: "B" },
  ]);
  flushSync();

  setItems([
    { id: 3, t: "c" },
    { id: 1, t: "a" },
  ]);
  flushSync();

  unmountRoot(container);
}
