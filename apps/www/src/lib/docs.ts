import MarkdownIt from "markdown-it";

const md = new MarkdownIt({ html: false, linkify: true, typographer: true });

const files = import.meta.glob("../../docs/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export type Doc = {
  slug: string;
  title: string;
  nav: string;
  order: number;
  html: string;
};

function parseFrontmatter(raw: string) {
  if (!raw.startsWith("---")) return { fm: {} as Record<string, string>, body: raw };
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { fm: {} as Record<string, string>, body: raw };
  const block = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).replace(/^\s+/, "");
  const fm: Record<string, string> = {};
  for (const line of block.split("\n")) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    fm[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { fm, body };
}

export const docs: Doc[] = Object.entries(files)
  .map(([path, raw]) => {
    const slug = path.split("/").pop()!.replace(/\.md$/, "");
    const { fm, body } = parseFrontmatter(raw);
    return {
      slug,
      title: fm.title ?? slug,
      nav: fm.nav ?? fm.title ?? slug,
      order: Number(fm.order ?? 99),
      html: md.render(body),
    };
  })
  .sort((a, b) => a.order - b.order);

export function getDoc(slug: string | undefined) {
  if (!slug) return docs[0];
  return docs.find((d) => d.slug === slug);
}
