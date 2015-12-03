# SvenJS

A very small reactive web framework for very small apps

# Demos

  - [TodoMVC](http://svenjs-todomvc.herokuapp.com/). [Source](https://github.com/svenanders/svenjs-todomvc)

# Releases

 - 0.3.2: Added *_beforeMount* life cycle method. 
 - 0.3.1: Added composition (importing components and referencing them in JSX by name). For instance: _const SecondComponent = require("SecondComponent")_. Referenced in _render_ like this: _<SecondComponent />_
 - 0.3.0: Renamed life cycle methods. New names: *_didMount* & *_didUpdate*

# Goals

 - A web library that enables you to write code that can be accessed both serverside and clientside

 - Time travel

  - Every component has time travel abilities built in by default.

 - Enforced state immutability

  - With time travel abilities comes immutability

 - Built in store implementation

  - With actions and emitter

 - Synthetic event handler. Implemented in such a way that input events work across browsers.

 - Focus on developer experience; keeping the programmer happy

 - Minimal file size

  - The minified version is about 4.8K. Compressing can reduce the file size even more.

# Install

Use the npm version:

```bash
  npm install svenjs
```

Build youself. Clone this repo and run

```bash
  npm run build
   _or_
  npm run dist # builds minified version
```

# How to use 

Here's a basic Universal component ([Source](https://github.com/svenanders/svenjs-example-clicky)):

```html
const Svenjs = require("svenjs");

module.exports = Svenjs.create({
    initialState: {
        clicks: 0
    },
    render() {
    const clickFunc = () =>{
      let clicks=this.state.clicks;
      this.setState({clicks: ++clicks });
    }
    return (<div id="row">
        <div id="app">
            <h3>The Click App</h3>
            <button onClick={clickFunc}>Why not click me?</button>
        </div>
        <div id="time-travel">
            <h3>Click stats</h3>
          <p>You have clicked on the button {this.state.clicks} times</p>
        </div>
    </div>)
    }
});
```

## Related Modules

* [svenjsx](https://github.com/svenanders/svenjsx) - JSX as used by SvenJS.

* [svenjsx-loader](https://github.com/svenanders/svenjsx-loader) - Webpack loader for SvenJS.

