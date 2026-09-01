import { create } from "svenjs";
import { ComposeDemo } from "../demos/compose/compose";
import { DemoNav } from "./demo-nav";

export const ComposePage = create({
  render() {
    return (
      <div>
        <h1 className="page-title">Composition</h1>
        <p className="page-lede">Parent renders children by name. Each child owns its own state.</p>
        <DemoNav current="compose" />
        <ComposeDemo />
      </div>
    );
  },
});
