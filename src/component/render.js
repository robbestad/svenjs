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

const appendChild=(child,parent)=>{
	return parent.appendChild(child);
}
// Speed up calls to hasOwnProperty
var hasOwnProperty = Object.prototype.hasOwnProperty;

const voidElements = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;
const setAttrs = (tag,node)=>{
	if(tag.hasOwnProperty('children')){
		tag.children.forEach((childTag)=>{
			if(typeof childTag == "string" || typeof childTag == "number"){
				node.appendChild(document.createTextNode(childTag));
			}
		});
	}
	if((hasOwnProperty.call(tag, 'attrs'))){
		const attr=tag.attrs;
		for (var attrName in attr) {
			if(attrName === "config" || attrName === "key") continue;
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

const buildChildren=(tags, parent)=>{
    if(typeof tags.children != "object"){
		if((hasOwnProperty.call(tags, 'tag'))){
			if((hasOwnProperty.call(tags, 'children'))){
			    tags.forEach((tag)=>{
			    	var child = document.createElement(tag.tag);
					appendChild(setAttrs(tag,child),parent);
			    })
	    	}
	    }
		else
    	return false;
    } 
	if((hasOwnProperty.call(tags, 'children'))){
	    tags.children.forEach((tag,idx)=>{
	    	var tagName=tag.tag;
			if(isArray(tag)){
				tag.forEach((childtag,idx)=>{
					var child = document.createElement(childtag.tag);
					appendChild(setAttrs(tag,child),parent)
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
	if((hasOwnProperty.call(tags, 'tag'))  && isArray(tags)){
		tags.forEach((tag)=>{
			buildChildren(tag,parent);
	    });
	}
	return parent;
}

exports.render = (spec, node) => {
    spec._svenjs.rootNode = node;
    if(node){ 
    node.innerHTML="";

    const tags = spec.render();
    
    var docFragment = document.createDocumentFragment();

	// Root node    
	var root = document.createElement(tags.tag);
	if(tags.attrs.hasOwnProperty('id')){
	    root.id = tags.attrs.id;	
	}

	// Build children
	let childrenTree = buildChildren(tags, root);
	
	// Append to root node
    docFragment.appendChild(childrenTree);

	// Append to window
    node.appendChild(docFragment);
    }
};
