import { FRAGMENT, TEXT, type Key, type Props, type VNode } from "./types";

const EMPTY_CHILDREN: VNode[] = [];

export function vnode(
  type: VNode["type"],
  props: Props | null | undefined,
  children: VNode[],
  key?: Key,
): VNode {
  return { type, props: props ?? {}, children, key };
}

export function textVNode(value: string): VNode {
  return vnode(TEXT, { nodeValue: value }, EMPTY_CHILDREN, undefined);
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
  return out.length ? out : EMPTY_CHILDREN;
}

export function childVNodes(fromProps: unknown): VNode[] {
  if (fromProps === undefined) return EMPTY_CHILDREN;
  if (Array.isArray(fromProps)) return fromProps.length ? flatten(fromProps) : EMPTY_CHILDREN;
  const n = normalizeChild(fromProps);
  return n ? [n] : EMPTY_CHILDREN;
}

export function h(type: VNode["type"], props: Props | null | undefined, ...kids: unknown[]): VNode {
  const key = props?.key as Key | undefined;
  if (kids.length) {
    const p = props ? { ...props, children: kids.length === 1 ? kids[0] : kids } : { children: kids.length === 1 ? kids[0] : kids };
    return vnode(type, p, flatten(kids), key);
  }
  return vnode(type, props ?? {}, childVNodes(props?.children), key);
}

export function normalizeRender(output: unknown): VNode | null {
  if (Array.isArray(output)) return vnode(FRAGMENT, {}, flatten(output), undefined);
  return normalizeChild(output);
}
