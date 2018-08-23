const Svenjs = require('dist/index.js').default;

const App = require("./app");
const rootNode = document.getElementById('myapp');
Svenjs.render(
  App,
  rootNode
);
