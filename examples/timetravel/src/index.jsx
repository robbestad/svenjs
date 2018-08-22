const Svenjs = require('dist/index.js');
const App = require("./app.jsx");
const rootNode = document.getElementById('myapp');
Svenjs.render(
  App,
  rootNode
);
