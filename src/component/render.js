const appendChild=(child,parent)=>{
	return parent.appendChild(child);
}

const setAttrs = (tag,node)=>{
	if(tag.hasOwnProperty('children')){
		tag.children.forEach((childTag)=>{
			if(typeof childTag == "string" || typeof childTag == "number"){
				if(typeof childTag == "number"){
					console.log('setAttrs');
					console.log(childTag);
				}
				node.appendChild(document.createTextNode(childTag));
			}
		});
	}

	if(tag.hasOwnProperty('attrs')){

		if(tag.attrs.hasOwnProperty('id')){
			node.id = tag.attrs.id;	
		}
		if(tag.attrs.hasOwnProperty('onClick')){
			node.onclick = tag.attrs.onClick;	
		}
	}
	return node;
}

const addChildren=(tags, parent)=>{
    if(typeof tags.children != "object"){
    	return false;
    } 

    tags.children.forEach((tag)=>{
		var child = document.createElement(tag.tag);
		appendChild(setAttrs(tag,child),parent)
		if(tag.children != null && typeof tag.children == "object"){
    		const childrenTags=tag.children;
	    	childrenTags.forEach((childTag)=>{
	    		var childnode = document.createElement(childTag.tag);
				setAttrs(childTag,childnode);
				//setAttrs(childnode,child);
				appendChild(childnode,child);
	    	})
		}
		
    })

	return parent;
}

exports.render = (spec, node) => {
    spec._svenjs.rootNode = node;

    const tags = spec.render();
    
    var docFragment = document.createDocumentFragment();

	// Root node    
	var root = document.createElement(tags.tag);
	if(tags.attrs.hasOwnProperty('id')){
	    root.id = tags.attrs.id;	
	}


    //docFragment.appendChild(root);

	// Build children
	let childrenTree = addChildren(tags, root);
	//console.log(childrenTree);
	
	// Append to root node
    docFragment.appendChild(childrenTree);

	// Append to window
    node.appendChild(docFragment);

};
