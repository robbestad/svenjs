const Svenjs = require('../../dist/sven.js');
const First = require("./app");
//const Second = require("./app2");
const rootNode = document.getElementById('ui');
Svenjs.render(
  First,
  rootNode
);
//Svenjs.render(
//  Second,
//  document.getElementById('myapp')
//);