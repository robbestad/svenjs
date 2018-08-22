// const Svenjs = require('assets/index.js');
const Svenjs = require('root/src/index.js');
const App = require("./app.jsx");
const rootNode = document.getElementById('myapp');
Svenjs.render(
  App,
  rootNode
);
