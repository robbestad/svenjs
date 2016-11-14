var Svenjs = require('../dist/sven.min.js');
var test = require('tape');
var myFunc = ()=> {
};
var backDisabled = false;
var nextDisabled = true;
var goBack = ()=> {
  return "go back";
}
var goForward = ()=> {
  return "go forward";
}
var jsdom = require("jsdom");
var document = jsdom.jsdom();
var window = jsdom.jsdom();
var nodeCache = [], cellCache = {};

var tags = ({
  tag: "div", attrs: {id: "row"}, children: [
    {
      tag: "div", attrs: {id: "app"}, children: [
      {tag: "h3", attrs: {}, children: ["Sample App"]},
      {tag: "button", attrs: {id: "add", onClick: myFunc}, children: ["Add word"]},
      {tag: "div", attrs: {id: "ui"}},
      {tag: "small", attrs: {}, children: ["(click word to delete)"]}
    ]
    },
    {
      tag: "div", attrs: {id: "time-travel"}, children: [
      {tag: "h3", attrs: {}, children: ["Time travel"]},
      {tag: "button", attrs: {id: "back", disabled: backDisabled, onClick: goBack}, children: ["Back"]},
      {tag: "button", attrs: {id: "next", disabled: nextDisabled, onClick: goForward}, children: ["Next"]},
      {tag: "p", attrs: {id: "time-pos"}}
    ]
    }
  ]
});

//const tags = spec.render();
const appendChild = (child, parent)=> {
  return parent.appendChild(child);
}

const setAttrs = (tag, node)=> {
  //console.log(tag);
  if (null != tag.children[0] && typeof tag.children[0] == "string") {
    let innerText = document.createTextNode(tag.children[0]);
    node.appendChild(innerText);
  }
  if (tag.hasOwnProperty('attrs')) {
    if (tag.attrs.hasOwnProperty('id')) {
      node.id = "row";
    }
    if (tag.attrs.hasOwnProperty('onClick')) {
      node.onclick = tag.attrs.onClick;
    }
  }
  return node;
}

const addChildren = (tags, root)=> {
  if (typeof tags.children != "object") {
    return false;
  }
  var parent = document.createElement(tags.tag);

  tags.children.forEach((tag)=> {
    var child = document.createElement(tag.tag);
    appendChild(setAttrs(tag, child), parent)
    if (tag.children != null && typeof tag.children == "object") {
      const childrenTags = tag.children;
      childrenTags.forEach((childTag)=> {
        console.log(childTag);
        var childnode = document.createElement(childTag.tag);
        appendChild(setAttrs(childnode, child), parent)
      })
    }

  });
  appendChild(setAttrs(tags, parent), root)

  return parent;
};


test('render html', function (t) {

  var docFragment = document.createDocumentFragment();

  // Root node
  var div = document.createElement(tags.tag);
  if (tags.attrs.hasOwnProperty('id')) {
    div.id = tags.attrs.id;
  }

  docFragment.appendChild(div);

  // Build children
  let childrenTree = addChildren(tags, div);
  console.log(childrenTree);

  // Append to root node
  docFragment.appendChild(childrenTree);

  t.end();
});