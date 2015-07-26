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
const voidElements = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;
const setAttrs = (tag,node)=>{
	if(tag.hasOwnProperty('children')){
		tag.children.forEach((childTag)=>{
			if(typeof childTag == "string" || typeof childTag == "number"){
				node.appendChild(document.createTextNode(childTag));
			}
		});
	}
	if(tag.hasOwnProperty('attrs')){
		const attr=tag.attrs;
		for (var attrName in attr) {
			if(attrName === "config" || attrName === "key") continue;
			else if(attrName=="class" || attrName=="className") node.className = attr[attrName].toString();
			else if(isFunction(attr[attrName]) && attrName.slice(0, 2) == "on") {
				node[attrName.toLowerCase()] = attr[attrName];
			}
			//else if (attrName in node && attrName !== "list" && attrName !== "style" && attrName !== "form" && attrName !== "type" && attrName !== "width" && attrName !== "height") {
			//	if (tag !== "input" || node[attrName] !== attr) node[attrName] = attr;
			//}
			else {
				//console.log(attrName);
				node.setAttribute(''+attrName,attr[attrName].toString());
			}
		}
		
	}
	return node;
}

const buildChildren=(tags, parent)=>{

    if(typeof tags.children != "object"){

    	if(!tags.hasOwnProperty('tag')){
    		console.log(tags);
			if(tags.hasOwnProperty('children')){
			    tags.forEach((tag)=>{
			    	var child = document.createElement(tag.tag);
					appendChild(setAttrs(tag,child),parent);
			    })
			    
			    //var child = document.createElement('span');
				//buildChildren(tags,child);
	    	}
	    }
		else
    	return false;
    } 

	if(tags.hasOwnProperty('children')){
    tags.children.forEach((tag)=>{
		var child = document.createElement(tag.tag);
		appendChild(setAttrs(tag,child),parent)
		buildChildren(tag,child);
    })
	} 
	return parent;
}

exports.render = (spec, node) => {
    spec._svenjs.rootNode = node;
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
	//console.log(childrenTree);
	
	// Append to root node
    docFragment.appendChild(childrenTree);

	// Append to window
    node.appendChild(docFragment);
};
