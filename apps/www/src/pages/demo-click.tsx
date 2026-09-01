import { create } from "svenjs";
import { ClickDemo } from "../demos/click/click";
import { DemoNav } from "./demo-nav";

export const ClickPage = create({
  render() {
    return (
      <div>
        <h1 className="page-title">Click</h1>
        <p className="page-lede">The original example. A component, a number, a button.</p>
        <DemoNav current="click" />
        <div className="panel" style={{ maxWidth: "28rem" }}>
          <ClickDemo />
        </div>
      </div>
    );
  },
});
