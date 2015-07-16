const Svenjs = require('../../dist/sven.js');
const App = require("./app");
const App2 = require("./app2");
const rootNode = document.getElementById('ui');
Svenjs.render(
  App,
  rootNode
);
Svenjs.render(
  App2,
  document.getElementById('myapp')
);