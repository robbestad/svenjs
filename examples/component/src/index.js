const Svenjs = require('./sven.js');
const First = require("./app");
const rootNode = document.getElementById('ui');
Svenjs.render(
  First,
  rootNode
);
//const Second = require("./app2");
//Svenjs.render(
//  Second,
//  document.getElementById('myapp')
//);