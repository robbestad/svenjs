import type { Props } from "./types";

const SVG_NS = "http://www.w3.org/2000/svg";
const SVG_TAGS = new Set([
  "svg",
  "path",
  "circle",
  "rect",
  "g",
  "line",
  "polyline",
  "polygon",
  "text",
  "defs",
  "clipPath",
  "use",
  "mask",
  "linearGradient",
  "radialGradient",
  "stop",
  "ellipse",
  "tspan",
  "foreignObject",
]);

const SKIP = new Set(["key", "children", "ref"]);

const LISTENER = "_svenL";

type ListenerMap = Map<string, EventListener>;

const EVENT_ALIASES: Record<string, string> = {
  ondoubleclick: "dblclick",
  ondblclick: "dblclick",
};

export function isSvgTag(tag: string): boolean {
  return SVG_TAGS.has(tag);
}

export function createDom(tag: string, svg: boolean): Element {
  if (svg || isSvgTag(tag)) return document.createElementNS(SVG_NS, tag);
  return document.createElement(tag);
}

function eventName(prop: string): string | null {
  if (prop.length < 3 || prop[0] !== "o" || prop[1] !== "n") return null;
  if (prop[2] !== prop[2].toUpperCase() && prop[2] !== prop[2].toLowerCase()) return null;
  const lower = prop.toLowerCase();
  if (EVENT_ALIASES[lower]) return EVENT_ALIASES[lower];
  if (lower.startsWith("on")) return lower.slice(2);
  return null;
}

function listeners(el: Element): ListenerMap {
  const node = el as Element & { [LISTENER]?: ListenerMap };
  if (!node[LISTENER]) node[LISTENER] = new Map();
  return node[LISTENER]!;
}

function classValue(props: Props): string {
  const v = props.className ?? props.class ?? "";
  return v == null ? "" : String(v);
}

function applyClass(el: Element, value: string) {
  if (el instanceof SVGElement) el.setAttribute("class", value);
  else (el as HTMLElement).className = value;
}

function applyStyle(el: Element, oldVal: unknown, newVal: unknown) {
  const style = (el as HTMLElement).style;
  if (style == null) {
    if (newVal == null) el.removeAttribute("style");
    else el.setAttribute("style", String(newVal));
    return;
  }
  if (!newVal) {
    if (typeof oldVal === "object" && oldVal) {
      for (const k of Object.keys(oldVal as object)) style.removeProperty(k);
    }
    el.removeAttribute("style");
    return;
  }
  if (typeof newVal === "string") {
    el.setAttribute("style", newVal);
    return;
  }
  if (typeof oldVal === "object" && oldVal) {
    for (const k of Object.keys(oldVal as object)) {
      if (!(newVal as Record<string, unknown>)[k]) style.removeProperty(k);
    }
  }
  Object.assign(style, newVal);
}

export function setProp(el: Element, name: string, oldVal: unknown, newVal: unknown, props?: Props) {
  if (SKIP.has(name) || name === "class" || name === "className") return;

  const ev = eventName(name);
  if (ev) {
    const map = listeners(el);
    const prev = map.get(ev);
    if (prev) el.removeEventListener(ev, prev);
    if (typeof newVal === "function") {
      el.addEventListener(ev, newVal as EventListener);
      map.set(ev, newVal as EventListener);
    } else {
      map.delete(ev);
    }
    return;
  }

  if (name === "style") {
    applyStyle(el, oldVal, newVal);
    return;
  }

  if (name === "dangerouslySetInnerHTML") {
    const html = (newVal as { __html?: string } | undefined)?.__html ?? "";
    if ((el as HTMLElement).innerHTML !== html) (el as HTMLElement).innerHTML = html;
    return;
  }

  if (name === "htmlFor" || name === "for") {
    (el as HTMLLabelElement).htmlFor = newVal == null ? "" : String(newVal);
    return;
  }

  if (name in el && name !== "list" && name !== "type" && name !== "size") {
    try {
      (el as any)[name] = newVal ?? "";
    } catch {
      /* readonly */
    }
  }

  if (newVal == null || newVal === false) {
    el.removeAttribute(name);
  } else if (newVal === true) {
    el.setAttribute(name, "");
  } else if (typeof newVal !== "function") {
    el.setAttribute(name, String(newVal));
  }
}

export function patchProps(el: Element, oldP: Props, newP: Props) {
  const old = oldP || {};
  const next = newP || {};

  const oldClass = classValue(old);
  const newClass = classValue(next);
  if (oldClass !== newClass) applyClass(el, newClass);

  for (const k in old) {
    if (!(k in next)) setProp(el, k, old[k], undefined, next);
  }
  for (const k in next) {
    if (old[k] !== next[k]) setProp(el, k, old[k], next[k], next);
  }
}

export function applyRef(props: Props, el: Element | null) {
  const ref = props?.ref;
  if (typeof ref === "function") ref(el);
}

export const VOID = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);
