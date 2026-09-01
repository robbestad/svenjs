import { SPEC, type ComponentSpec, type SvenComponent } from "./types";

export function create<P = any, S = any>(spec: ComponentSpec<P, S>): SvenComponent<P, S> {
  if (typeof spec.render !== "function") {
    throw new Error("SvenJS: create() requires a render() method");
  }
  (spec as any)[SPEC] = true;
  return spec as SvenComponent<P, S>;
}
