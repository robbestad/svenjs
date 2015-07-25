const Svenjs = require('../../../dist/sven.js');
const App = require("./app");
const rootNode = document.getElementById('ui');
Svenjs.render(
  App,
  rootNode
);

