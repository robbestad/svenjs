var Svenjs = require('../dist/sven.min.js');
var test = require('tape');
var myFunc=()=>{};
var backDisabled=false;
var nextDisabled=true;
var goBack=()=>{return "go back";}
var goForward=()=>{return "go forward";}
var jsdom = require("jsdom");
var document = jsdom.jsdom();
var window = jsdom.jsdom().parentWindow;

var div= ({tag: "div", attrs: {id:"row"}, children: [
        {tag: "div", attrs: {id:"app"}, children: [
            {tag: "h3", attrs: {}, children: ["Sample App"]},
            {tag: "button", attrs: {id:"add", onClick:myFunc}, children: ["Add word"]},
            {tag: "div", attrs: {id:"ui"}},
            {tag: "small", attrs: {}, children: ["(click word to delete)"]}
        ]},
        {tag: "div", attrs: {id:"time-travel"}, children: [
            {tag: "h3", attrs: {}, children: ["Time travel"]},
            {tag: "button", attrs: {id:"back", disabled:backDisabled, onClick:goBack}, children: ["Back"]},
            {tag: "button", attrs: {id:"next", disabled:nextDisabled, onClick:goForward}, children: ["Next"]},
            {tag: "p", attrs: {id:"time-pos"}}
        ]}
    ]});


var buildChildren = (root) =>{
    var i = 0;
    var n = 0;
    var matches = null;
    let docFragment = document.createDocumentFragment();

	//build tag
    //document.getElementById('ui').appendChild(docFragment);
    //if the node has children that is an array, handle it with a loop
    //&& root.children instanceof Array
      root.children.forEach((val,idx)=> {
		docFragment.appendChild(document.createElement(val.tag));
      	// any more children?
      	console.log(val.children!==null);
/*        if(root.children[idx] !== null) {
        	console.log(typeof root.children[idx]);
        	console.log(root.children[idx]);
        
        }*/
      })

      console.log(docFragment);

  };

const parse = (data) =>{
	//return typeof data;
	let result = buildChildren(data);
	//console.log(result);
}

test('render html', function (t) {
//t.equal(JSON.stringify(example), '{"tag":"div","attrs":{},"children":["Hello world! Your name is ","Bob"]}');
parse(div);
t.end();
});