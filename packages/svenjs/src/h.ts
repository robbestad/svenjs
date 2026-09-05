import { FRAGMENT, TEXT, type Key, type Props, type VNode } from "./types";

export function vnode(
  type: VNode["type"],
  props: Props | null | undefined,
  children: VNode[],
  key?: Key,
): VNode {
  return { type, props: props ?? {}, children, key };
}

export function textVNode(value: string): VNode {
  return vnode(TEXT, { nodeValue: value }, [], undefined);
}

export function normalizeChild(child: unknown): VNode | null {
  if (child == null || child === false || child === true) return null;
  if (typeof child === "object" && "type" in (child as VNode)) {
    return child as VNode;
  }
  return textVNode(String(child));
}

export function flatten(list: unknown[], out: VNode[] = []): VNode[] {
  for (const item of list) {
    if (item == null || item === false || item === true) continue;
    if (Array.isArray(item)) flatten(item, out);
    else if (typeof item === "object" && "type" in (item as VNode)) out.push(item as VNode);
    else out.push(textVNode(String(item)));
  }
  return out;
}

export function childVNodes(fromProps: unknown): VNode[] {
  if (fromProps === undefined) return [];
  if (Array.isArray(fromProps)) return flatten(fromProps);
  const n = normalizeChild(fromProps);
  return n ? [n] : [];
}

export function h(type: VNode["type"], props: Props | null | undefined, ...kids: unknown[]): VNode {
  const p = props ? { ...props } : {};
  const key = p.key as Key | undefined;
  if (kids.length) {
    p.children = kids.length === 1 ? kids[0] : kids;
  }
  return vnode(type, p, kids.length ? flatten(kids) : childVNodes(p.children), key);
}

export function normalizeRender(output: unknown): VNode | null {
  if (Array.isArray(output)) return vnode(FRAGMENT, {}, flatten(output), undefined);
  return normalizeChild(output);
}

/** Copy a vnode tree without mount fields so cached `html` / reused `h` trees do not share `_dom`. */
export function adopt(node: VNode | null): VNode | null {
  if (!node) return null;
  const from = node.children;
  const n = from.length;
  let children = from;
  if (n) {
    children = [];
    for (let i = 0; i < n; i++) children[i] = adopt(from[i])!;
  }
  return vnode(node.type, node.props, children, node.key);
}
