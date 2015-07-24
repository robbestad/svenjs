var Svenjs = require('../dist/sven.min.js');
var test = require('tape');
var myFunc=()=>{};
var backDisabled=false;
var nextDisabled=true;
var goBack=()=>{return "go back";}
var goForward=()=>{return "go forward";}
var jsdom = require("jsdom");
var document = jsdom.jsdom();
var window = jsdom.jsdom();
var nodeCache = [], cellCache = {};

var tags= ({tag: "div", attrs: {id:"row"}, children: [
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

//const tags = spec.render();
console.log(tags.tag);
var docFragment = document.createDocumentFragment();

var div = document.createElement(tags.tag);
if(tags.attrs.hasOwnProperty('id')){
    div.id = "row";	
}
const appendChild=(child,parent)=>{
	return parent.appendChild(child);
}
const addChildren=(tags, parent)=>{
    if(typeof tags.children == "object"){
    tags.children.forEach((tag)=>{
    	if(tag.children != null && typeof tag.children == "object"){
    		const childrenTags=tag.children;
	    	childrenTags.forEach((childTag)=>{
	    		addChildren(childTag,parent);
	    	})
    	}
		var div = document.createElement(tags.tag);
		if(tags.attrs.hasOwnProperty('id')){
			div.id = "row";	
		}
		if(tags.attrs.hasOwnProperty('onClick')){
			div.onclick = tags.attrs.onClick;	
		}
		appendChild(div,parent);
    })
	}
	return div;
}


test('render html', function (t) {
    docFragment.appendChild(addChildren(tags, div));
console.log(docFragment);
//parse(div);
t.end();
});