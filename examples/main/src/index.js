const Svenjs = require('../../../dist/sven.js');
const App = require("./app");
const rootNode = document.getElementById('myapp');
Svenjs.render(
  App,
  rootNode
);
