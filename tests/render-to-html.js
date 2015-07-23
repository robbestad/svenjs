var test = require('tape');
//var Svenjs = require('../src/index');
var Svenjs = require('../dist/sven');
var MyApp = require('../examples/component/app2');
import {jsx} from "../src/lib/jsx";
test('render html', function (t) {
var name = "Bob";
// Svenjs.parse.assign("App", MyApp);
let myFunc = () =>{console.log('test')}
var example = Svenjs.jsx`<div>Hello world!<App/> <button onClick='${myFunc}'></button>Your name is ${ name }</div>`;	
t.equal(JSON.stringify(example), '{"tag":"div","attrs":{},"children":["Hello world! Your name is ","Bob"]}');
t.end();
});