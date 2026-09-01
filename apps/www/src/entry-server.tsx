import { renderToString } from "svenjs";
import { App } from "./app";
import {
  canonicalUrl,
  jsonLdScript,
  loadRoute,
  metadataForPath,
  SITE_NAME,
  SITE_ORIGIN,
  SOCIAL_IMAGE,
  SOCIAL_IMAGE_ALT,
  staticPaths,
  type PageMetadata,
} from "./lib/site";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderHead(metadata: PageMetadata) {
  const title = escapeHtml(metadata.title);
  const description = escapeHtml(metadata.description);
  const image = escapeHtml(metadata.socialImage ?? SOCIAL_IMAGE);
  const imageAlt = escapeHtml(metadata.socialImageAlt ?? SOCIAL_IMAGE_ALT);
  const robots = metadata.noIndex ? "noindex, nofollow" : "index, follow";
  const lines = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta name="robots" content="${robots}" />`,
  ];
  if (!metadata.noIndex) {
    const canonical = escapeHtml(canonicalUrl(metadata));
    lines.push(
      `<link rel="canonical" href="${canonical}" />`,
      `<meta property="og:url" content="${canonical}" />`,
    );
  }
  lines.push(
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:type" content="image/png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${imageAlt}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="twitter:image:alt" content="${imageAlt}" />`,
  );
  const ld = jsonLdScript(metadata);
  if (ld) lines.push(ld);
  return lines.join("\n    ");
}

export async function renderPath(pathname: string) {
  await loadRoute(pathname);
  const metadata = metadataForPath(pathname);
  return {
    head: renderHead(metadata),
    html: renderToString(<App initialUrl={metadata.path} />),
    metadata,
  };
}

export { SITE_ORIGIN, staticPaths };
