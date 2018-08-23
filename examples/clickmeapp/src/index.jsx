const Svenjs = require('dist/index.js').default;
const App = require("./app.jsx");
const rootNode = document.getElementById('myapp');
Svenjs.render(
  App,
  rootNode
);
