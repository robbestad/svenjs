const appendChild=(child,parent)=>{
	return parent.appendChild(child);
}

const setAttrs = (tag,node)=>{
//	console.log(tag.children[0]);
	if(tag.hasOwnProperty('children') && typeof tag.children[0] == "string"){
		let innerText=document.createTextNode(tag.children[0]);
		node.appendChild(innerText);
	}
	if(tag.hasOwnProperty('children')){
		//console.log(tag.children);
	}
	if(tag.hasOwnProperty('attrs')){

		if(tag.attrs.hasOwnProperty('id')){
			node.id = "row";	
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
/*
	var parent = document.createElement(tags.tag);
	setAttrs(tags,parent);
	appendChild(parent,root);
*/
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
	console.log(childrenTree);
	// Append to root node
    root.appendChild(childrenTree);

	// Append to window
    node.appendChild(docFragment);

};

/*

    	if(null != tags.children[0] && typeof tags.children[0] == "string"){
    		let innerText=document.createTextNode(tags.children[0]);
			div.appendChild(innerText);
    	}

		if(tags.attrs.hasOwnProperty('id')){
			div.id = "row";	
		}
		if(tags.attrs.hasOwnProperty('onClick')){
			div.onclick = tags.attrs.onClick;	
		}

		//appendChild(div,root);

		if(tag.children != null && typeof tag.children == "object"){
    		const childrenTags=tag.children;
	    	childrenTags.forEach((childTag)=>{
	    		addChildren(childTag,div);
	    	})
    	}
		*/
