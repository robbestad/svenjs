const files = import.meta.glob("../../docs/*.md", {
  query: "?sven-doc",
  import: "default",
  eager: true,
}) as Record<string, Doc>;

export type Doc = {
  slug: string;
  title: string;
  nav: string;
  description: string;
  order: number;
  html: string;
};

export const docs: Doc[] = Object.values(files).sort((a, b) => a.order - b.order);

export function getDoc(slug: string | undefined) {
  if (!slug) return docs[0];
  return docs.find((d) => d.slug === slug);
}
