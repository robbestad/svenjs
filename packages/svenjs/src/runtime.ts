import { applyRef, createDom, patchProps, styleText, SVG_NS, validAttributeName, VOID } from "./dom";
import { freezeState } from "./freeze";
import { normalizeRender } from "./h";
import { FRAGMENT, SPEC, TEXT, type ComponentSpec, type Instance, type Observable, type VNode } from "./types";

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
    _dirty: false,
    _placeholder: null,
    _svg: false,
    _unsubs: null,
  } as Instance;

  for (const key of Object.keys(spec)) {
    if (key === "initialState" || key === "props") continue;
    const val = spec[key];
    (inst as any)[key] = typeof val === "function" ? val.bind(inst) : val;
  }

  inst.setState = (next) => setState(inst, next);
  inst.observe = (store) => observe(inst, store);
  const initial = typeof spec.initialState === "function" ? spec.initialState(props) : spec.initialState;
  const state = initial !== undefined ? initial : {};
  inst.state = import.meta.env.DEV ? freezeState(state) : state;
  return inst;
}

function observe(inst: Instance, store: Observable) {
  const off = store.subscribe(() => schedule(inst));
  (inst._unsubs ??= []).push(off);
  return off;
}

function shallowEqual(a: Record<string, unknown>, b: Record<string, unknown>) {
  if (a === b) return true;
  let n = 0;
  for (const k in a) {
    if (!Object.is(a[k], b[k])) return false;
    n++;
  }
  for (const k in b) n--;
  return n === 0;
}

export function setState(inst: Instance, next: unknown) {
  if (inst._destroyed) return;
  const raw = typeof next === "function" ? (next as (s: unknown) => unknown)(inst.state) : next;
  if (Object.is(raw, inst.state)) return;
  inst.state = import.meta.env.DEV ? freezeState(raw) : raw;
  if (import.meta.env.DEV && inst._rendering) console.warn("SvenJS: setState during render; update will flush after");
  schedule(inst);
}

export function schedule(inst: Instance) {
  if (inst._destroyed) return;
  inst._dirty = true;
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
  let failed = false;
  let failure: unknown;
  try {
    const list = [...queue];
    queue.clear();
    for (const inst of list) {
      if (inst._destroyed || !inst._mounted) continue;
      try {
        updateInstance(inst);
      } catch (error) {
        if (!failed) failure = error;
        failed = true;
      }
    }
  } finally {
    flushing = false;
    if (queue.size && !scheduled) {
      scheduled = true;
      queueMicrotask(flush);
    }
  }
  if (failed) throw failure;
}

export function flushSync(fn?: () => void) {
  const was = sync;
  sync = true;
  let failed = false;
  let failure: unknown;
  try {
    try {
      fn?.();
    } catch (error) {
      failed = true;
      failure = error;
    }
    try {
      flush();
    } catch (error) {
      if (!failed) failure = error;
      failed = true;
    }
  } finally {
    sync = was;
  }
  if (failed) throw failure;
}

function collectDom(vnode: VNode | null | undefined): Node[] {
  if (!vnode) return [];
  if (isSpec(vnode.type) && vnode._instance) {
    if (vnode._instance._vnode) return collectDom(vnode._instance._vnode);
    return vnode._instance._placeholder ? [vnode._instance._placeholder] : [];
  }
  if (vnode.type === FRAGMENT) {
    const out: Node[] = [];
    if (vnode._dom) out.push(vnode._dom);
    for (const c of vnode.children) out.push(...collectDom(c));
    if (vnode._end) out.push(vnode._end);
    return out;
  }
  return vnode._dom ? [vnode._dom] : [];
}

function renderInstance(inst: Instance): VNode | null {
  inst._rendering = true;
  try {
    return normalizeRender(inst.render());
  } finally {
    inst._rendering = false;
  }
}

function warnKeys(children: VNode[]) {
  if (children.length < 2) return;
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
    const start = document.createComment("");
    const end = document.createComment("");
    vnode._dom = start;
    vnode._end = end;
    parent.insertBefore(start, anchor);
    parent.insertBefore(end, anchor);
    if (import.meta.env.DEV) warnKeys(vnode.children);
    for (const child of vnode.children) mount(child, parent, end, svg);
    return;
  }

  if (isSpec(vnode.type)) {
    mountComponent(vnode, parent, anchor, svg);
    return;
  }

  const tag = vnode.type as string;
  const elementSvg = svg || tag === "svg";
  const childSvg = elementSvg && tag !== "foreignObject";
  const el = createDom(tag, elementSvg);
  vnode._dom = el;
  patchProps(el, {}, vnode.props);
  if (import.meta.env.DEV) warnKeys(vnode.children);
  for (const child of vnode.children) mount(child, el, null, childSvg);
  if (tag === "select" && vnode.props.value != null) (el as HTMLSelectElement).value = String(vnode.props.value);
  parent.insertBefore(el, anchor);
  applyRef(vnode.props, el);
}

function mountComponent(vnode: VNode, parent: Node, anchor: Node | null, svg = false) {
  const spec = vnode.type as ComponentSpec;
  const inst = makeInstance(spec, vnode.props);
  vnode._instance = inst;
  inst._parent = parent;
  inst._svg = svg;
  callHook(inst, "onBeforeMount", "_beforeMount");
  const rendered = renderInstance(inst);
  inst._vnode = rendered;
  if (rendered) {
    mount(rendered, parent, anchor, svg);
  } else {
    inst._placeholder = document.createComment("");
    parent.insertBefore(inst._placeholder, anchor);
  }
  inst._mounted = true;
  vnode._dom = rendered?._dom ?? inst._placeholder;
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
      if (inst._unsubs) {
        for (const off of inst._unsubs) off();
        inst._unsubs = null;
      }
      callHook(inst, "onDestroy", "_willUnmount");
      unmount(inst._vnode, removeDom);
      if (removeDom) inst._placeholder?.parentNode?.removeChild(inst._placeholder);
      inst._vnode = null;
      inst._placeholder = null;
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
    unmount(oldV);
    mount(newV, parent, anchor, svg);
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
    patchChildren(parent, oldV.children, newV.children, svg, newV._end ?? null);
    return;
  }

  if (isSpec(newV.type)) {
    patchComponent(oldV, newV, svg);
    return;
  }

  const el = oldV._dom as Element;
  newV._dom = el;
  const elementSvg = svg || newV.type === "svg";
  const childSvg = elementSvg && newV.type !== "foreignObject";
  patchProps(el, oldV.props, newV.props);
  patchChildren(el, oldV.children, newV.children, childSvg);
  if (newV.type === "select" && newV.props.value != null) {
    (el as HTMLSelectElement).value = String(newV.props.value);
  }
  if (oldV.props.ref !== newV.props.ref) {
    applyRef(oldV.props, null);
    applyRef(newV.props, el);
  }
}

function patchRendered(inst: Instance, rendered: VNode | null, svg: boolean) {
  const old = inst._vnode;
  const parent = inst._parent!;
  if (!old && rendered) {
    mount(rendered, parent, inst._placeholder, svg);
    inst._placeholder?.parentNode?.removeChild(inst._placeholder);
    inst._placeholder = null;
  } else if (old && !rendered) {
    const anchor = collectDom(old).pop()?.nextSibling ?? null;
    unmount(old);
    inst._placeholder = document.createComment("");
    parent.insertBefore(inst._placeholder, anchor);
  } else if (old && rendered) {
    patch(parent, old, rendered, svg);
  }
  inst._vnode = rendered;
}

function assignBoundary(vnode: VNode, inst: Instance) {
  const rendered = inst._vnode;
  vnode._dom = rendered?._dom ?? inst._placeholder;
  vnode._end = rendered?._end ?? null;
}

function patchComponent(oldV: VNode, newV: VNode, svg = false) {
  const inst = oldV._instance!;
  newV._instance = inst;
  const nextProps = newV.props ?? {};
  const skip = !inst._dirty && shallowEqual(inst.props, nextProps);
  inst.props = nextProps;
  inst._svg = svg;
  if (skip) {
    assignBoundary(newV, inst);
    return;
  }
  inst._dirty = false;
  const rendered = renderInstance(inst);
  patchRendered(inst, rendered, svg);
  assignBoundary(newV, inst);
  if (inst._mounted) callHook(inst, "onUpdate", "_didUpdate");
}

function updateInstance(inst: Instance) {
  if (inst._destroyed || !inst._parent || !inst._dirty) return;
  inst._dirty = false;
  const rendered = renderInstance(inst);
  patchRendered(inst, rendered, inst._svg);
  if (inst._mounted) callHook(inst, "onUpdate", "_didUpdate");
}

function patchChildren(parent: Node, oldCh: VNode[], newCh: VNode[], svg = false, boundary: Node | null = null) {
  const oldList = oldCh.filter(Boolean);
  const newList = newCh.filter(Boolean);
  if (import.meta.env.DEV) warnKeys(newList);

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
      mount(n, parent, boundary, svg);
    }
  }

  for (const o of oldList) {
    if (!used.has(o)) unmount(o);
  }

  let next = boundary;
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

function asRootVNode(spec: ComponentSpec | VNode): VNode {
  if (isSpec(spec)) return { type: spec, props: {}, children: [], key: undefined };
  return spec;
}

function propsFromDom(el: Element): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  for (const attr of el.attributes) props[attr.name] = attr.value;
  return props;
}

function hydrateVNode(vnode: VNode, parent: Node, node: Node | null, svg = false): Node | null {
  if (vnode.type === TEXT) {
    if (node?.nodeType !== 3) {
      mount(vnode, parent, node, svg);
      return node;
    }
    vnode._dom = node;
    const value = String(vnode.props.nodeValue ?? "");
    if (node.nodeValue !== value) node.nodeValue = value;
    return node.nextSibling;
  }

  if (vnode.type === FRAGMENT) {
    const start = document.createComment("");
    parent.insertBefore(start, node);
    vnode._dom = start;
    let cursor = node;
    for (const child of vnode.children) cursor = hydrateVNode(child, parent, cursor, svg);
    const end = document.createComment("");
    parent.insertBefore(end, cursor);
    vnode._end = end;
    return cursor;
  }

  if (isSpec(vnode.type)) {
    const inst = makeInstance(vnode.type, vnode.props);
    vnode._instance = inst;
    inst._parent = parent;
    inst._svg = svg;
    callHook(inst, "onBeforeMount", "_beforeMount");
    const rendered = renderInstance(inst);
    inst._vnode = rendered;
    let cursor = node;
    if (rendered) {
      cursor = hydrateVNode(rendered, parent, node, svg);
    } else {
      inst._placeholder = document.createComment("");
      parent.insertBefore(inst._placeholder, node);
    }
    inst._mounted = true;
    vnode._dom = rendered?._dom ?? inst._placeholder;
    vnode._end = rendered?._end ?? null;
    callHook(inst, "onMount", "_didMount");
    return cursor;
  }

  const tag = vnode.type as string;
  const elementSvg = svg || tag === "svg";
  if (
    node?.nodeType !== 1 ||
    (node as Element).localName !== tag ||
    ((node as Element).namespaceURI === SVG_NS) !== elementSvg
  ) {
    mount(vnode, parent, node, svg);
    return node;
  }

  const el = node as Element;
  vnode._dom = el;
  const childSvg = elementSvg && tag !== "foreignObject";
  patchProps(el, propsFromDom(el), vnode.props);
  if (!vnode.props.dangerouslySetInnerHTML) {
    let cursor: Node | null = el.firstChild;
    for (const child of vnode.children) cursor = hydrateVNode(child, el, cursor, childSvg);
    while (cursor) {
      const next = cursor.nextSibling;
      el.removeChild(cursor);
      cursor = next;
    }
  }
  if (tag === "select" && vnode.props.value != null) (el as HTMLSelectElement).value = String(vnode.props.value);
  applyRef(vnode.props, el);
  return el.nextSibling;
}

export function render(spec: ComponentSpec | VNode, container: Element | null): string | void {
  if (!container) return "Error: No node to attach";

  const next = asRootVNode(spec);

  const prev = ROOTS.get(container);
  if (prev) patch(container, prev, next);
  else mount(next, container, null);
  ROOTS.set(container, next);
}

export function hydrate(spec: ComponentSpec | VNode, container: Element | null): string | void {
  if (!container) return "Error: No node to attach";
  if (ROOTS.has(container)) return render(spec, container);

  const next = asRootVNode(spec);
  let cursor = hydrateVNode(next, container, container.firstChild);
  while (cursor) {
    const following = cursor.nextSibling;
    container.removeChild(cursor);
    cursor = following;
  }
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
    if (!validAttributeName(name)) continue;
    if (name === "key" || name === "children" || name === "ref" || name === "dangerouslySetInnerHTML") continue;
    if (name[0] === "o" && name[1] === "n") continue;
    if (name === "className" || name === "class") {
      if (name === "class" && props.className) continue;
      const c = props.className ?? props.class;
      if (c) out += ` class="${escapeHtml(String(c))}"`;
      continue;
    }
    const val = props[name];
    if (name.startsWith("aria-") || name.startsWith("data-")) {
      if (val == null) continue;
      const text = val === true ? "true" : val === false ? "false" : String(val);
      out += ` ${name}="${escapeHtml(text)}"`;
      continue;
    }
    if (val == null || val === false || typeof val === "function") continue;
    if (name === "style") {
      const style = styleText(val);
      if (style) out += ` style="${escapeHtml(style)}"`;
      continue;
    }
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
    const rendered = renderInstance(inst);
    return stringify(rendered);
  }
  const tag = vnode.type as string;
  if (!validAttributeName(tag)) throw new TypeError("SvenJS: bad tag");
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
    const rendered = renderInstance(inst);
    return stringify(rendered);
  }
  return stringify(spec);
}
