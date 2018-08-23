# SvenJS

A JavaScript framework for composable web apps

# Demos

  - [TodoMVC](http://svenanders.github.io/svenjs-todomvc/). [Source](https://github.com/svenanders/svenjs-todomvc)

# Releases

 - 2.0.1: ES modules, bug fixes and more!
 - 0.3.2: Added *_beforeMount* life cycle method. 
 - 0.3.1: Added composition (importing components and referencing them in JSX by name). For instance: _const SecondComponent = require("SecondComponent")_. Referenced in _render_ like this: _<SecondComponent />_
 - 0.3.0: Renamed life cycle methods. New names: *_didMount* & *_didUpdate*
 
# Goals

 - A web library that enables you to write code that can be accessed both serverside and clientside

 - Enforced state immutability

 - Built in store implementation (todo)

 - Synthetic event handler. Implemented in such a way that input events work across browsers.

 - Minimal file size

# Install

Use the npm version:

```bash
  npm install svenjs
```

Build youself. Clone this repo and run

```bash
  npm run build
```

# How to use 

```html
import SvenJs from "svenjs";

SvenJs.create({
    initialState: {
        clicks: 0
    },
    render() {
    const clickFunc = () =>{
      let clicks=this.state.clicks;
      this.setState({clicks: ++clicks });
    }
    return (<div id="row">
            <h3>The Click App</h3>
            <div>
              <button onClick={clickFunc}>Click me?</button>
            </div>
        <div>
            <h3>Click stats</h3>
          <p>You have clicked on the button {this.state.clicks} times</p>
        </div>
    </div>)
    }
});
SvenJs.render(App, document.getElementById("app"))
```

## Related Modules

* [svenjsx](https://github.com/svenanders/svenjsx) - JSX as used by SvenJS.

* [svenjsx-loader](https://github.com/svenanders/svenjsx-loader) - Webpack loader for SvenJS.

