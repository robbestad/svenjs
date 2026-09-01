import type { SvenComponent } from "svenjs";

export type Route = {
  path: string;
  component: SvenComponent<any, any>;
};

export type Match = {
  route: Route;
  params: Record<string, string>;
};

export function matchRoute(pathname: string, routes: Route[]): Match | null {
  const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "") || "/";
  for (const route of routes) {
    const keys: string[] = [];
    const pattern = route.path === "/" ? "/" : route.path.replace(/\/+$/, "");
    const re = new RegExp(
      `^${pattern.replace(/:([^/]+)/g, (_, key: string) => {
        keys.push(key);
        return "([^/]+)";
      })}$`,
    );
    const m = path.match(re);
    if (!m) continue;
    const params: Record<string, string> = {};
    keys.forEach((key, i) => {
      params[key] = decodeURIComponent(m[i + 1]);
    });
    return { route, params };
  }
  return null;
}

export function navigate(to: string, replace = false) {
  const apply = () => {
    if (replace) history.replaceState({}, "", to);
    else history.pushState({}, "", to);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };
  const start = document.startViewTransition?.bind(document);
  if (start) start(apply);
  else apply();
}

export function isInternalLink(a: HTMLAnchorElement, event: MouseEvent) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return false;
  if (a.target && a.target !== "_self") return false;
  if (a.hasAttribute("download")) return false;
  if (a.origin !== location.origin) return false;
  return true;
}
