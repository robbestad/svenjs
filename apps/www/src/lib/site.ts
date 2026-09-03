import type { Route } from "./router";
import { matchRoute } from "./router";
import { docs, getDoc } from "./docs";
import { DocsPage } from "../pages/docs";
import { HeritagePage } from "../pages/heritage";
import { HomePage } from "../pages/home";
import { PlayGate } from "../pages/play-gate";

const FALLBACK_ORIGIN = "https://svenjs.vercel.app";

function configuredOrigin() {
  const value = import.meta.env.VITE_SITE_ORIGIN?.trim() || FALLBACK_ORIGIN;
  const url = new URL(value);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("VITE_SITE_ORIGIN must be an http(s) URL");
  }
  return url.origin;
}

export const SITE_ORIGIN = configuredOrigin();
export const SITE_NAME = "SvenJS 3";
export const SOCIAL_IMAGE = new URL("/og.png", SITE_ORIGIN).href;
export const SOCIAL_IMAGE_ALT = "SvenJS — one file, real state";

export const routes: Route[] = [
  { path: "/", component: HomePage },
  { path: "/play", component: PlayGate },
  {
    path: "/demo/mission-control",
    load: () => import("../pages/demo-mission-control").then((m) => m.MissionControlPage),
  },
  { path: "/demo/todo", load: () => import("../pages/demo-todo").then((m) => m.TodoPage) },
  { path: "/demo/click", load: () => import("../pages/demo-click").then((m) => m.ClickPage) },
  { path: "/demo/compose", load: () => import("../pages/demo-compose").then((m) => m.ComposePage) },
  { path: "/docs", component: DocsPage },
  { path: "/docs/:slug", component: DocsPage },
  { path: "/heritage", component: HeritagePage },
];

export const staticPaths = [
  "/",
  "/play",
  "/demo/mission-control",
  "/demo/todo",
  "/demo/click",
  "/demo/compose",
  "/docs",
  ...docs.map((doc) => `/docs/${doc.slug}`),
  "/heritage",
];

export async function loadRoute(pathname: string) {
  const matched = matchRoute(pathname, routes);
  if (!matched) return null;
  if (!matched.route.component && matched.route.load) {
    matched.route.component = await matched.route.load();
  }
  return matched;
}

export type PageMetadata = {
  title: string;
  description: string;
  path: string;
  canonicalPath?: string;
  noIndex?: boolean;
  socialImage?: string;
  socialImageAlt?: string;
};

const pageMetadata: Record<
  string,
  Pick<PageMetadata, "title" | "description"> &
    Partial<Pick<PageMetadata, "socialImage" | "socialImageAlt">>
> = {
  "/": {
    title: "SvenJS 3 — A tiny UI runtime with state",
    description: "Build small interactive pages with components, immutable state, and a keyed DOM patch — with or without a build step.",
  },
  "/play": {
    title: "Playground — SvenJS 3",
    description: "Edit a SvenJS app in the browser, share it, or download it as one self-contained HTML file.",
  },
  "/demo/mission-control": {
    title: "Mission Control — SvenJS 3",
    description: "Run 100 synthetic telemetry streams in a dependency-free SvenJS dashboard with shared state, keyed sorting, SVG charts, lifecycle cleanup, and one-file export.",
    socialImage: new URL("/mission-control-og.png", SITE_ORIGIN).href,
    socialImageAlt: "SvenJS Mission Control dashboard with telemetry graphs, fleet metrics, and selected asset state",
  },
  "/demo/todo": {
    title: "Todo demo — SvenJS 3",
    description: "A small SvenJS todo app with editing, filters, immutable state, keyed lists, and local persistence.",
  },
  "/demo/click": {
    title: "Click demo — SvenJS 3",
    description: "The smallest SvenJS state example: one component, one counter, and one button.",
  },
  "/demo/compose": {
    title: "Component composition — SvenJS 3",
    description: "See SvenJS parent and child components compose while each child keeps independent state.",
  },
  "/docs": {
    title: "Documentation — SvenJS 3",
    description: "Learn SvenJS from a one-file page through components, state, lifecycle, stores, JSX, and rendering.",
  },
  "/heritage": {
    title: "Heritage — SvenJS 3",
    description: "How SvenJS evolved from its Webpack-era 2.x implementation into the small modern version 3 runtime.",
  },
};

export function normalizePath(pathname: string) {
  const path = pathname.split(/[?#]/, 1)[0] || "/";
  return path === "/" ? "/" : path.replace(/\/+$/, "") || "/";
}

export function metadataForPath(pathname: string): PageMetadata {
  const path = normalizePath(pathname);

  if (path.startsWith("/docs/")) {
    const slug = decodeURIComponent(path.slice("/docs/".length));
    const doc = getDoc(slug);
    if (doc) {
      return {
        path,
        title: `${doc.title} — SvenJS 3`,
        description: doc.description,
      };
    }
  }

  const known = pageMetadata[path];
  if (known) {
    return {
      path,
      ...known,
      canonicalPath: path === "/docs" && docs[0] ? `/docs/${docs[0].slug}` : undefined,
    };
  }

  return {
    path,
    title: "Page not found — SvenJS 3",
    description: "This SvenJS page does not exist.",
    noIndex: true,
  };
}

export function canonicalUrl(metadata: PageMetadata) {
  const path = normalizePath(metadata.canonicalPath ?? metadata.path);
  const route = path === "/" ? "/" : `${path}/`;
  return new URL(route, SITE_ORIGIN).href;
}

export function jsonLdFor(metadata: PageMetadata): unknown {
  if (metadata.noIndex) return null;
  const url = canonicalUrl(metadata);
  const path = normalizePath(metadata.canonicalPath ?? metadata.path);

  if (path === "/") {
    return [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_ORIGIN,
      },
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "SvenJS",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        url: SITE_ORIGIN,
        description: metadata.description,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        license: "https://opensource.org/licenses/ISC",
      },
    ];
  }

  if (path.startsWith("/docs")) {
    const slug = path === "/docs" ? docs[0]?.slug : path.slice("/docs/".length);
    const doc = getDoc(slug);
    const docsUrl = new URL("/docs/", SITE_ORIGIN).href;
    return [
      {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: doc?.title ?? metadata.title,
        description: metadata.description,
        mainEntityOfPage: url,
        url,
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Docs", item: docsUrl },
          { "@type": "ListItem", position: 2, name: doc?.title ?? metadata.title, item: url },
        ],
      },
    ];
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: metadata.title,
    description: metadata.description,
    url,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_ORIGIN },
  };
}

export function jsonLdScript(metadata: PageMetadata) {
  const data = jsonLdFor(metadata);
  if (data == null) return "";
  return `<script id="sven-jsonld" type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}

function setMeta(selector: string, attribute: string, value: string) {
  const element = document.head.querySelector(selector);
  element?.setAttribute(attribute, value);
}

function syncJsonLd(metadata: PageMetadata) {
  const existing = document.getElementById("sven-jsonld");
  const markup = jsonLdScript(metadata);
  if (!markup) {
    existing?.remove();
    return;
  }
  const next = markup.slice(markup.indexOf(">") + 1, markup.lastIndexOf("<"));
  if (existing) {
    existing.textContent = next;
    return;
  }
  document.head.insertAdjacentHTML("beforeend", markup);
}

export function syncDocumentMetadata(pathname: string) {
  if (typeof document === "undefined") return;
  const metadata = metadataForPath(pathname);
  const socialImage = metadata.socialImage ?? SOCIAL_IMAGE;
  const socialImageAlt = metadata.socialImageAlt ?? SOCIAL_IMAGE_ALT;

  document.title = metadata.title;
  setMeta('meta[name="description"]', "content", metadata.description);
  setMeta('meta[name="robots"]', "content", metadata.noIndex ? "noindex, nofollow" : "index, follow");
  if (metadata.noIndex) {
    document.head.querySelector('link[rel="canonical"]')?.remove();
  } else {
    const canonical = canonicalUrl(metadata);
    const link = document.head.querySelector('link[rel="canonical"]');
    if (link) link.setAttribute("href", canonical);
    setMeta('meta[property="og:url"]', "content", canonical);
  }
  setMeta('meta[property="og:title"]', "content", metadata.title);
  setMeta('meta[property="og:description"]', "content", metadata.description);
  setMeta('meta[property="og:image"]', "content", socialImage);
  setMeta('meta[property="og:image:alt"]', "content", socialImageAlt);
  setMeta('meta[name="twitter:title"]', "content", metadata.title);
  setMeta('meta[name="twitter:description"]', "content", metadata.description);
  setMeta('meta[name="twitter:image"]', "content", socialImage);
  setMeta('meta[name="twitter:image:alt"]', "content", socialImageAlt);
  syncJsonLd(metadata);
}
