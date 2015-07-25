const appendChild=(child,parent)=>{
	return parent.appendChild(child);
}

const setAttrs = (tag,node)=>{
	if(tag.hasOwnProperty('children')){
		tag.children.forEach((childTag)=>{
			if(typeof childTag == "string" || typeof childTag == "number"){
				node.appendChild(document.createTextNode(childTag));
			}
		});
	}

	if(tag.hasOwnProperty('attrs')){
		console.log(tag.attrs);
		if(tag.attrs.hasOwnProperty('className')){
			node.className = tag.attrs.className;	
		}
		if(tag.attrs.hasOwnProperty('class')){
			node.className = tag.attrs.class;	
		}
		if(tag.attrs.hasOwnProperty('id')){
			node.id = tag.attrs.id;	
		}
		if(tag.attrs.hasOwnProperty('onClick')){
			node.onclick = tag.attrs.onClick;	
		}
		if(tag.attrs.hasOwnProperty('onKeyDown')){
			node.onkeydown = tag.attrs.onKeyDown;	
			node.oninput = tag.attrs.onKeyDown;	
		}
	}
	return node;
}



const buildChildren=(tags, parent)=>{
    if(typeof tags.children != "object"){
    	return false;
    } 

    tags.children.forEach((tag)=>{
    	console.log(tag);
		var child = document.createElement(tag.tag);
		appendChild(setAttrs(tag,child),parent)
		if(tag.children != null && typeof tag.children == "object"){
    		const childrenTags=tag.children;
	    	childrenTags.forEach((childTag)=>{
	    		var childnode = document.createElement(childTag.tag);
				setAttrs(childTag,childnode);
				appendChild(childnode,child);
		    	buildChildren(childTag,childnode);
	    	})
		}
		
    })

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
