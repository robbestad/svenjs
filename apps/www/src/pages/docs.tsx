import { create } from "svenjs";
import { docs, getDoc } from "../lib/docs";

export const DocsPage = create<{ params?: { slug?: string } }, Record<string, never>>({
  render() {
    const slug = this.props.params?.slug ?? docs[0]?.slug;
    const doc = getDoc(slug);
    if (!doc) {
      return (
        <div className="not-found">
          <h1 className="page-title">Missing page</h1>
          <p>
            No doc named <code>{slug}</code>. <a href="/docs/one-file/">Back to docs</a>.
          </p>
        </div>
      );
    }
    return (
      <div className="docs">
        <nav className="docs-nav" aria-label="Documentation">
          {docs.map((d) => (
            <a key={d.slug} href={`/docs/${d.slug}/`} aria-current={d.slug === doc.slug ? "page" : undefined}>
              {d.nav}
            </a>
          ))}
        </nav>
        <article className="prose">
          <h1>{doc.title}</h1>
          <div className="prose-body" dangerouslySetInnerHTML={{ __html: doc.html }} />
        </article>
      </div>
    );
  },
});
