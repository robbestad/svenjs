/**
 * render module.
 * @module component/render
 * @see module:svenjs
 * @author Sven A Robbestad <robbestad@gmail.com> 
 */

// The vDOM
let vDomCache=[];

// define common functions used in this mod ule
import {isFunction, isObject, isString, isArray} from '../lib/validations';

const appendChild=(child,parent)=>{
	return parent.appendChild(child);
}

// Speed up calls to hasOwnProperty
var hasOwnProperty = Object.prototype.hasOwnProperty;

//const voidElements = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;

/**
 * setAttrs. This sets all attributes on the node tag, like class names, event handlers etc.
 * @param {tag} a tag structure (e.g {tag: "div", attrs: {class:"test"}, children: []})
 * @param {node} a DOM Node the children should be added to
 * @returns {Object} a DOM Node
 */
const setAttrs = (tag,node)=>{
  if((hasOwnProperty.call(tag, 'children'))){
    if(isArray(tag.children)){
      tag.children.forEach((childTag)=>{
        if(typeof childTag == "string" || typeof childTag == "number"){
          node.appendChild(document.createTextNode(childTag));
        }
      });
    }
  }
  if((hasOwnProperty.call(tag, 'attrs'))){
    const attr=tag.attrs;
    for (var attrName in attr) {
      if(attrName === "config" || attrName === "key") continue;
      if(attrName === "disabled" && attr[attrName]===false) continue;
      else if(attrName=="class" || attrName=="className") node.className = attr[attrName].toString();
      else if(isFunction(attr[attrName]) && attrName.slice(0, 2) == "on") {
        node[attrName.toLowerCase()] = attr[attrName];
      }
      else if(attrName === "checked" && (attr[attrName]===false || attr[attrName] === "")) continue;
      else {
        node.setAttribute(''+attrName,attr[attrName].toString());
      }
    }

  }
  return node;
}

/**
 * buildElement
 * @param {tag} a tag structure (e.g {tag: "div", attrs: {class:"test"}, children: []})
 * @returns {Object} a DOM Node
 */
const buildElement=(tag)=>{
  let child = document.createElement(tag.tag);
  setAttrs(tag,child);
  return child;
}

/**
 * buildChildren
 * @param {tags} a tag structure (e.g {tag: "div", attrs: {class:"test"}, children: []})
 * @param {parent} a DOM Node the children should be added to
 * @returns {Object} a DOM Node
 */
const buildChildren=(tags, parent)=>{
  let childNode;
  if((hasOwnProperty.call(tags, 'children'))){

    if (isArray(tags.children)) {
      tags.children.forEach((tag,idx)=>{
        if('object' === typeof tag){
          if(tag.hasOwnProperty("render")){
            childNode=buildElement(tag.render());
          } else {
            childNode=buildElement(tag);
          }
          buildChildren(tag,childNode);
          appendChild(childNode,parent);
        }
        else if(isArray(tag)){
          var tagName=tag.tag;
          tag.forEach((childtag,idx)=>{
            // Subcomponents
            if((hasOwnProperty.call(childtag, 'sjxid'))){
              childtag.attrs['sjxid']=sjxid;
            }
            childNode=buildElement(childtag);
            buildChildren(childtag,childNode);
            appendChild(childNode,parent);
          });
          //}
        }
        else {
          if("undefined" != typeof tagName){
            if(tag.tag==="strong" || tag.tag==="input"){
              childNode=buildElement(tag);
              appendChild(childNode,parent);
              buildChildren(tag,childNode);

            } else {
              childNode=buildElement(tag);
              buildChildren(tag,childNode);
              //_vdom.push(childNode,parent);
              appendChild(childNode,parent);
            }

          } 
        }
      })
    }
  } 
  return parent;
  //return [_vdom,parent];
}


exports.renderToString = (tags,data) => {
  return vDom(tags,data).innerHTML;
};

/**
 * vDom
 * @param {tags} a tag structure (e.g {tag: "div", attrs: {class:"test"}, children: []})
 * @returns {Object} a DOM Node
 */
const vDom  = (tags, data) => {
  var docFragment = document.createDocumentFragment();

  // Root node    
  var root = document.createElement(tags.tag);
  setAttrs(tags,data.rootNode);

  // Build children
  let childrenTree = buildChildren(tags, root);
  docFragment.appendChild(childrenTree);

  //vDomCache.push(childrenTree[0]);

  //// Append to root node
  //vDomCache[vDomCache.length-1].forEach((node)=>{
  //docFragment.appendChild(node);
  //})

  // Append to window
  return docFragment;
}

/**
 * Render
 * @alias svenjs.render
 * @param {spec} a svenjs component with a render method. Optional, set to false if not used
 * @param {node} a document node (e.g from document.getElementById()).
 * @param {tags} optional pre-rendered tags
 * @returns {undefined}
 */
exports.render = (spec, node, preRendered=false) => {
  if(node){ 

    if(isObject(spec)){
      // Set internal ref
      if(!(hasOwnProperty.call(spec, '_svenjs'))){
        spec._svenjs={rootNode:false};
      }
      spec._svenjs.rootNode = node;
    } 

    // reset HTML
    node.innerHTML="";
    // Get the converted tags
    let tags;

    if(isObject(preRendered)){
      tags = preRendered;
    } else {
      tags = spec.render();
    }

    // Append to window
    node.appendChild(vDom(tags,spec._svenjs));
  } else {
    return 'Error: No node to attach';
  }
};
