import type { Props } from "./types";

export const SVG_NS = "http://www.w3.org/2000/svg";
const SKIP = new Set(["key", "children", "ref"]);
const INVALID_ATTRIBUTE = /[\s"'<>/=`]/;

const LISTENER = "_svenL";

type ListenerMap = Map<string, EventListener>;

export function createDom(tag: string, svg: boolean): Element {
  if (!validAttributeName(tag)) throw new TypeError("SvenJS: bad tag");
  if (svg || tag === "svg") return document.createElementNS(SVG_NS, tag);
  return document.createElement(tag);
}

export function validAttributeName(name: string): boolean {
  return Boolean(name) && !INVALID_ATTRIBUTE.test(name);
}

function eventName(prop: string): string | null {
  if (prop.length < 3 || prop[0] !== "o" || prop[1] !== "n") return null;
  return prop.toLowerCase().slice(2);
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

function styleName(name: string): string {
  if (name.startsWith("--")) return name;
  return name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`).replace(/^ms-/, "-ms-");
}

export function styleText(value: unknown): string {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  let declarations = "";
  for (const name in value) {
    const entry = (value as Record<string, unknown>)[name];
    if (entry == null || entry === false || entry === "") continue;
    declarations += `${declarations ? ";" : ""}${styleName(name)}:${String(entry)}`;
  }
  return declarations;
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
  if (typeof oldVal === "string") el.removeAttribute("style");
  if (typeof oldVal === "object" && oldVal) {
    for (const k of Object.keys(oldVal as object)) {
      if (!(k in (newVal as Record<string, unknown>))) style.removeProperty(styleName(k));
    }
  }
  for (const k of Object.keys(newVal as object)) {
    const value = (newVal as Record<string, unknown>)[k];
    if (value == null || value === false || value === "") style.removeProperty(styleName(k));
    else style.setProperty(styleName(k), String(value));
  }
}

export function setProp(el: Element, name: string, oldVal: unknown, newVal: unknown, props?: Props) {
  if (!validAttributeName(name) || SKIP.has(name) || name === "class" || name === "className") return;

  const ev = eventName(name);
  if (ev) {
    el.removeAttribute(name);
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

  if (name.startsWith("aria-") || name.startsWith("data-")) {
    if (newVal == null) el.removeAttribute(name);
    else el.setAttribute(name, newVal === true ? "true" : newVal === false ? "false" : String(newVal));
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
