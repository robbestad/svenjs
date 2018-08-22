// const Svenjs = require('root/index.js');
const Svenjs = require('assets/index.js');
const App = require("./app");
const rootNode = document.getElementById('myapp');
Svenjs.render(
  App,
  rootNode
);
