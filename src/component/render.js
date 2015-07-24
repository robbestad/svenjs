exports.render = (spec, rootNode) => {
    spec._svenjs.rootNode = rootNode;

    const tags = spec.render();
    
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
	    	if(null != tags.children[0]){
	    		console.log(tags.children[0]);
				let innerText=document.createTextNode(tags.children[0]);
				div.appendChild(innerText);
	    	}
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
    
    docFragment.appendChild(addChildren(tags, div));
	
	/*
    var rowDiv = document.createElement("div");
    rowDiv.id = "row";
    docFragment.appendChild(rowDiv);
    var app = document.createElement("div");
    app.id = "app";
    rowDiv.appendChild(app);
    var h3 = document.createElement("h3");
    var h3Text = document.createTextNode(spec.state.message || "Sample App");
    h3.appendChild(h3Text);
    app.appendChild(h3);
    var button = document.createElement("button");
    var buttonText = document.createTextNode("Add Word");
    button.id = "add";
    */

    rootNode.appendChild(docFragment);

    //updateUI(spec);
};