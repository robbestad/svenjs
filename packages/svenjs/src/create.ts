import { SPEC, type Component, type ComponentOptions, type SvenComponent } from "./types";

type NoInferMethods<T> = [T][T extends any ? 0 : never];

// Infer methods from the spec itself; its ThisType marker must not infer M.
export function create<P = any, S = any, M extends object = Record<string, any>>(
  spec: ComponentOptions<P, S> & M & Record<string, any> & ThisType<Component<P, S> & NoInferMethods<M> & Record<string, any>>,
): SvenComponent<P, S, M> {
  if (typeof spec.render !== "function") {
    throw new Error("SvenJS: create() requires a render() method");
  }
  (spec as any)[SPEC] = true;
  return spec as SvenComponent<P, S, M>;
}
