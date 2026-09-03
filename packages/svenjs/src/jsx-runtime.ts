import { childVNodes, vnode } from "./h";
import { FRAGMENT, type Key, type VNode } from "./types";

export { FRAGMENT as Fragment };
export type { JSX } from "./types";

export function jsx(type: VNode["type"], props: Record<string, unknown> | null, key?: string | number): VNode {
  const p = props ?? {};
  return vnode(type, p, childVNodes(p.children), key !== undefined ? key : (p.key as Key | undefined));
}

export const jsxs = jsx;
export const jsxDEV = jsx;
