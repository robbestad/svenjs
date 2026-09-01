import { applyRef, createDom, isSvgTag, patchProps, VOID } from "./dom";
import { freezeState, isDev } from "./freeze";
import { normalizeRender } from "./h";
import { FRAGMENT, SPEC, TEXT, type ComponentSpec, type Instance, type VNode } from "./types";

const queue = new Set<Instance>();
let scheduled = false;
let flushing = false;
let sync = false;

function callHook(inst: Instance, modern: string, legacy: string) {
  const fn = inst[modern] || inst[legacy];
  if (typeof fn === "function") fn.call(inst);
}

export function isSpec(value: unknown): value is ComponentSpec {
  return Boolean(value && typeof value === "object" && (value as any)[SPEC]);
}

export function makeInstance(spec: ComponentSpec, props: Record<string, any>): Instance {
  const inst = {
    type: spec,
    props: props ?? {},
    state: undefined as any,
    _vnode: null,
    _parent: null,
    _mounted: false,
    _destroyed: false,
    _rendering: false,
  } as Instance;

  for (const key of Object.keys(spec)) {
    if (key === "initialState" || key === "props") continue;
    const val = spec[key];
    (inst as any)[key] = typeof val === "function" ? val.bind(inst) : val;
  }

  inst.setState = (next) => setState(inst, next);
  inst.state = freezeState(spec.initialState !== undefined ? spec.initialState : {});
  return inst;
}

export function setState(inst: Instance, next: unknown) {
  if (inst._destroyed) return;
  const raw = typeof next === "function" ? (next as (s: unknown) => unknown)(inst.state) : next;
  inst.state = freezeState(raw);
  if (inst._rendering) {
    if (isDev()) console.warn("SvenJS: setState during render; update will flush after");
  }
  schedule(inst);
}

export function schedule(inst: Instance) {
  if (inst._destroyed) return;
  queue.add(inst);
  if (sync || flushing) return;
  if (!scheduled) {
    scheduled = true;
    queueMicrotask(flush);
  }
}

export function flush() {
  scheduled = false;
  flushing = true;
  const list = [...queue];
  queue.clear();
  for (const inst of list) {
    if (!inst._destroyed && inst._mounted) updateInstance(inst);
  }
  flushing = false;
  if (queue.size) {
    scheduled = true;
    queueMicrotask(flush);
  }
}

export function flushSync(fn?: () => void) {
  const was = sync;
  sync = true;
  try {
    fn?.();
    flush();
  } finally {
    sync = was;
  }
}

function collectDom(vnode: VNode | null | undefined): Node[] {
  if (!vnode) return [];
  if (isSpec(vnode.type) && vnode._instance?._vnode) return collectDom(vnode._instance._vnode);
  if (vnode.type === FRAGMENT) {
    const out: Node[] = [];
    if (vnode._dom) out.push(vnode._dom);
    for (const c of vnode.children) out.push(...collectDom(c));
    if (vnode._end) out.push(vnode._end);
    return out;
  }
  return vnode._dom ? [vnode._dom] : [];
}

function warnKeys(children: VNode[]) {
  if (!isDev() || children.length < 2) return;
  const keys = children.map((c) => c.key);
  const some = keys.some((k) => k != null);
  const all = keys.every((k) => k != null);
  if (some && !all) {
    console.warn("SvenJS: some list children have keys, some do not");
  }
  if (all) {
    const seen = new Set<string | number>();
    for (const k of keys) {
      if (k == null) continue;
      if (seen.has(k)) console.warn(`SvenJS: duplicate key "${String(k)}"`);
      seen.add(k);
    }
  }
}

function mount(vnode: VNode, parent: Node, anchor: Node | null, svg = false) {
  if (vnode.type === TEXT) {
    const el = document.createTextNode(String(vnode.props.nodeValue ?? ""));
    vnode._dom = el;
    parent.insertBefore(el, anchor);
    return;
  }

  if (vnode.type === FRAGMENT) {
    const start = document.createComment("sven");
    const end = document.createComment("/sven");
    vnode._dom = start;
    vnode._end = end;
    parent.insertBefore(start, anchor);
    parent.insertBefore(end, anchor);
    warnKeys(vnode.children);
    for (const child of vnode.children) mount(child, parent, end, svg);
    return;
  }

  if (isSpec(vnode.type)) {
    mountComponent(vnode, parent, anchor, svg);
    return;
  }

  const tag = vnode.type as string;
  const childSvg = svg || tag === "svg" || isSvgTag(tag);
  const el = createDom(tag, childSvg);
  vnode._dom = el;
  patchProps(el, {}, vnode.props);
  warnKeys(vnode.children);
  for (const child of vnode.children) mount(child, el, null, childSvg);
  parent.insertBefore(el, anchor);
  applyRef(vnode.props, el);
}

function mountComponent(vnode: VNode, parent: Node, anchor: Node | null, svg = false) {
  const spec = vnode.type as ComponentSpec;
  const inst = makeInstance(spec, vnode.props);
  vnode._instance = inst;
  inst._parent = parent;
  callHook(inst, "onBeforeMount", "_beforeMount");
  inst._rendering = true;
  const rendered = normalizeRender(inst.render());
  inst._rendering = false;
  inst._vnode = rendered;
  if (rendered) mount(rendered, parent, anchor, svg);
  inst._mounted = true;
  vnode._dom = rendered?._dom ?? null;
  vnode._end = rendered?._end ?? null;
  callHook(inst, "onMount", "_didMount");
}

function unmount(vnode: VNode | null | undefined, removeDom = true) {
  if (!vnode) return;

  if (isSpec(vnode.type)) {
    const inst = vnode._instance;
    if (inst) {
      inst._destroyed = true;
      inst._mounted = false;
      callHook(inst, "onDestroy", "_willUnmount");
      unmount(inst._vnode, removeDom);
      inst._vnode = null;
    }
    return;
  }

  if (vnode.type === TEXT) {
    if (removeDom) vnode._dom?.parentNode?.removeChild(vnode._dom);
    return;
  }

  if (vnode.type === FRAGMENT) {
    for (const c of vnode.children) unmount(c, removeDom);
    if (removeDom) {
      vnode._dom?.parentNode?.removeChild(vnode._dom);
      vnode._end?.parentNode?.removeChild(vnode._end);
    }
    return;
  }

  applyRef(vnode.props, null);
  for (const c of vnode.children) unmount(c, false);
  if (removeDom) vnode._dom?.parentNode?.removeChild(vnode._dom);
}

function patch(parent: Node, oldV: VNode | null | undefined, newV: VNode | null | undefined, svg = false) {
  if (oldV === newV) return;
  if (!newV) {
    unmount(oldV);
    return;
  }
  if (!oldV) {
    mount(newV, parent, null, svg);
    return;
  }
  if (oldV.type !== newV.type) {
    const anchor = collectDom(oldV).pop()?.nextSibling ?? null;
    mount(newV, parent, anchor, svg);
    unmount(oldV);
    return;
  }

  if (newV.type === TEXT) {
    newV._dom = oldV._dom;
    if (oldV.props.nodeValue !== newV.props.nodeValue) {
      (newV._dom as Text).nodeValue = String(newV.props.nodeValue ?? "");
    }
    return;
  }

  if (newV.type === FRAGMENT) {
    newV._dom = oldV._dom;
    newV._end = oldV._end;
    patchChildren(parent, oldV.children, newV.children, svg);
    return;
  }

  if (isSpec(newV.type)) {
    patchComponent(oldV, newV, svg);
    return;
  }

  const el = oldV._dom as Element;
  newV._dom = el;
  const childSvg = svg || newV.type === "svg" || isSvgTag(newV.type as string);
  patchProps(el, oldV.props, newV.props);
  patchChildren(el, oldV.children, newV.children, childSvg);
}

function patchComponent(oldV: VNode, newV: VNode, svg = false) {
  const inst = oldV._instance!;
  newV._instance = inst;
  inst.props = newV.props ?? {};
  inst._rendering = true;
  const rendered = normalizeRender(inst.render());
  inst._rendering = false;
  patch(inst._parent!, inst._vnode, rendered, svg);
  inst._vnode = rendered;
  newV._dom = rendered?._dom ?? null;
  newV._end = rendered?._end ?? null;
  if (inst._mounted) callHook(inst, "onUpdate", "_didUpdate");
}

function updateInstance(inst: Instance) {
  if (inst._destroyed || !inst._parent) return;
  inst._rendering = true;
  const rendered = normalizeRender(inst.render());
  inst._rendering = false;
  patch(inst._parent, inst._vnode, rendered);
  inst._vnode = rendered;
  if (inst._mounted) callHook(inst, "onUpdate", "_didUpdate");
}

function patchChildren(parent: Node, oldCh: VNode[], newCh: VNode[], svg = false) {
  const oldList = oldCh.filter(Boolean);
  const newList = newCh.filter(Boolean);
  warnKeys(newList);

  const oldByKey = new Map<string | number, VNode>();
  for (const o of oldList) {
    if (o.key != null) oldByKey.set(o.key, o);
  }

  const used = new Set<VNode>();

  for (const n of newList) {
    let match: VNode | undefined;
    if (n.key != null) {
      const keyed = oldByKey.get(n.key);
      if (keyed && keyed.type === n.type) match = keyed;
    }
    if (!match) {
      match = oldList.find((o) => !used.has(o) && o.key == null && o.type === n.type);
    }
    if (match) {
      used.add(match);
      patch(parent, match, n, svg);
    } else {
      mount(n, parent, null, svg);
    }
  }

  for (const o of oldList) {
    if (!used.has(o)) unmount(o);
  }

  let next: Node | null = null;
  for (let i = newList.length - 1; i >= 0; i--) {
    const nodes = collectDom(newList[i]);
    if (!nodes.length) continue;
    const first = nodes[0];
    if (nodes[nodes.length - 1].nextSibling !== next) {
      for (const node of nodes) parent.insertBefore(node, next);
    }
    next = first;
  }
}

const ROOTS = new WeakMap<Element, VNode>();

export function render(spec: ComponentSpec | VNode, container: Element | null): string | void {
  if (!container) return "Error: No node to attach";

  let next: VNode;
  if (isSpec(spec)) {
    next = { type: spec, props: {}, children: [], key: undefined };
  } else {
    next = spec;
  }

  const prev = ROOTS.get(container);
  if (prev) patch(container, prev, next);
  else mount(next, container, null);
  ROOTS.set(container, next);
}

export function unmountRoot(container: Element) {
  const prev = ROOTS.get(container);
  if (prev) {
    unmount(prev);
    ROOTS.delete(container);
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function attrsToString(props: Record<string, any>): string {
  let out = "";
  for (const name in props) {
    if (name === "key" || name === "children" || name === "ref" || name === "dangerouslySetInnerHTML") continue;
    if (name[0] === "o" && name[1] === "n") continue;
    if (name === "className" || name === "class") {
      if (name === "class" && props.className) continue;
      const c = props.className ?? props.class;
      if (c) out += ` class="${escapeHtml(String(c))}"`;
      continue;
    }
    const val = props[name];
    if (val == null || val === false || typeof val === "function") continue;
    if (name === "htmlFor") {
      out += ` for="${escapeHtml(String(val))}"`;
      continue;
    }
    if (val === true) {
      out += ` ${name}`;
      continue;
    }
    out += ` ${name}="${escapeHtml(String(val))}"`;
  }
  return out;
}

function stringify(vnode: VNode | null): string {
  if (!vnode) return "";
  if (vnode.type === TEXT) return escapeHtml(String(vnode.props.nodeValue ?? ""));
  if (vnode.type === FRAGMENT) return vnode.children.map(stringify).join("");
  if (isSpec(vnode.type)) {
    const inst = makeInstance(vnode.type, vnode.props);
    callHook(inst, "onBeforeMount", "_beforeMount");
    inst._rendering = true;
    const rendered = normalizeRender(inst.render());
    inst._rendering = false;
    return stringify(rendered);
  }
  const tag = vnode.type as string;
  const inner = vnode.props.dangerouslySetInnerHTML?.__html;
  const open = `<${tag}${attrsToString(vnode.props)}>`;
  if (VOID.has(tag)) return open;
  const body = inner != null ? String(inner) : vnode.children.map(stringify).join("");
  return `${open}${body}</${tag}>`;
}

export function renderToString(spec: ComponentSpec | VNode): string {
  if (isSpec(spec)) {
    const inst = makeInstance(spec, {});
    callHook(inst, "onBeforeMount", "_beforeMount");
    inst._rendering = true;
    const rendered = normalizeRender(inst.render());
    inst._rendering = false;
    return stringify(rendered);
  }
  return stringify(spec);
}


