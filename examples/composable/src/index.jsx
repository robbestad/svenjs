// const Svenjs = require('assets/index.js');
const Svenjs = require('dist/index.js');

const App = require("./app");
const rootNode = document.getElementById('myapp');
Svenjs.render(
  App,
  rootNode
);
