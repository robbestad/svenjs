import { create } from "svenjs";

export const NotFoundPage = create({
  render() {
    return (
      <div className="not-found">
        <h1 className="page-title">404</h1>
        <p className="page-lede">That route is not a component.</p>
        <a className="btn" href="/">
          Back home
        </a>
      </div>
    );
  },
});
