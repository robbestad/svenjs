/**
 * render module.
 * @module component/render
 * @see module:svenjs
 * @author Sven A Robbestad <robbestad@gmail.com> 
 */

// define common functions used in this module
const type = {}.toString;
const isFunction=(object)=> {
	return typeof object === "function";
}
const isObject = (object) => {
	return type.call(object) === "[object Object]";
}
const isString = (object) => {
	return type.call(object) === "[object String]";
}
const isArray = (object) => {
	return type.call(object) === "[object Array]";
};
const isDefined = (object) => {
	return type.call(object) !== "undefined";
};


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
	if(tag.hasOwnProperty('children')){
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
 * buildChildren
 * @param {tags} a tag structure (e.g {tag: "div", attrs: {class:"test"}, children: []})
 * @param {parent} a DOM Node the children should be added to
 * @returns {Object} a DOM Node
 */
 const buildChildren=(tags, parent)=>{
    if(typeof tags.children != "object"){
		if((hasOwnProperty.call(tags, 'tag'))){
			if((hasOwnProperty.call(tags, 'children'))){
				if (isArray(tags.children)) {
				    tags.forEach((tag)=>{
				    	var child = document.createElement(tag.tag);
						appendChild(setAttrs(tag,child),parent);
				    })
				}
	    	}
	    }
		else
    	return false;
    } 
	if((hasOwnProperty.call(tags, 'children'))){
	if (isArray(tags.children)) {
	    tags.children.forEach((tag,idx)=>{
	    	var tagName=tag.tag;
			if(isArray(tag)){
				tag.forEach((childtag,idx)=>{
					var child = document.createElement(childtag.tag);
					appendChild(setAttrs(childtag,child),parent)
					buildChildren(childtag,child);
				});
			}
			else {
				if("undefined" == typeof tagName) tagName="span";
				var child = document.createElement(tagName);
				appendChild(setAttrs(tag,child),parent)
				buildChildren(tag,child);
			}
	    })
		}
	} 
	if((hasOwnProperty.call(tags, 'tag'))  && isArray(tags)){
		if (isArray(tags)) {
			tags.forEach((tag)=>{
				buildChildren(tag,parent);
		    });
		}
	}
	return parent;
}

const renderToString= exports.renderToString = (tags) => {
    return vDom(tags).innerHTML;
};

/**
 * vDom
 * @param {tags} a tag structure (e.g {tag: "div", attrs: {class:"test"}, children: []})
 * @returns {Object} a DOM Node
 */
const vDom  = (tags) => {
 var docFragment = document.createDocumentFragment();

	// Root node    
	var root = document.createElement(tags.tag);
	setAttrs(tags,root);

	// Build children
	let childrenTree = buildChildren(tags, root);

	// Append to root node
    docFragment.appendChild(childrenTree);

	// Append to window
    return docFragment;
}

/**
 * Render
 * @alias svenjs.render
 * @param {spec} a Svenjs component with a render method. Optional, set to false if not used
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
	    node.appendChild(vDom(tags));
    } else {
    	return 'Error: no node to attach rendered HTML';
    }
};

