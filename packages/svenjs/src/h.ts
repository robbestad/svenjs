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
  if (typeof child === "object" && child !== null && "type" in (child as VNode)) {
    return child as VNode;
  }
  return textVNode(String(child));
}

export function flatten(list: unknown[], out: VNode[] = []): VNode[] {
  for (const item of list) {
    if (item == null || item === false || item === true) continue;
    if (Array.isArray(item)) flatten(item, out);
    else {
      const n = normalizeChild(item);
      if (n) out.push(n);
    }
  }
  return out;
}

export function h(type: VNode["type"], props: Props | null | undefined, ...kids: unknown[]): VNode {
  const p = props ? { ...props } : {};
  const key = p.key as Key | undefined;
  const fromProps = p.children;
  const raw = kids.length ? kids : fromProps !== undefined ? [].concat(fromProps as never) : [];
  return vnode(type, p, flatten(raw), key);
}

export function normalizeRender(output: unknown): VNode | null {
  if (Array.isArray(output)) return h(FRAGMENT, {}, ...output);
  return normalizeChild(output);
}
