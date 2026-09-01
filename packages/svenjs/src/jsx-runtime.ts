import { FRAGMENT } from "./types";
import { h } from "./h";
import type { VNode } from "./types";

export { FRAGMENT as Fragment };
export type { JSX } from "./types";

export function jsx(type: VNode["type"], props: Record<string, unknown> | null, key?: string | number): VNode {
  const p = props ? { ...props } : {};
  if (key !== undefined) p.key = key;
  return h(type, p);
}

export const jsxs = jsx;
export const jsxDEV = jsx;
