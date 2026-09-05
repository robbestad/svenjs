---
title: A page in one file
nav: One file
description: Build a complete stateful SvenJS page in one HTML file, with no npm, compiler, or build step.
order: 1
---

You do not need npm. Save this as `hello.html`, open it in a browser, click the button.

```html
<!DOCTYPE html>
<html lang="en">
<body>
  <div id="app"></div>
  <script src="https://unpkg.com/svenjs@3.3.0"></script>
  <script>
    const { create, render, html } = Svenjs;

    const App = create({
      initialState: { clicks: 0 },
      render() {
        return html`
          <button onClick=${() => this.setState({ clicks: this.state.clicks + 1 })}>
            ${this.state.clicks}
          </button>
        `;
      },
    });

    render(App, document.getElementById("app"));
  </script>
</body>
</html>
```

`html\`...\`` is a tagged template. It builds the same tree JSX would, without a compiler. `${value}` interpolates. `onClick=${fn}` binds an event.

The [playground](/play/) edits this kind of file and has **Copy HTML** / **Download .html**.

Using a bundler and JSX instead? See [Bundler](/docs/install/).
