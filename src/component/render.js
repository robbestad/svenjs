exports.render = (spec, rootNode) => {
    spec._svenjs.rootNode = rootNode;

    const tags = spec.render();
    console.log(tags.tag);
    var docFragment = document.createDocumentFragment();

    var div = document.createElement(tags.tag);
    if(tags.attrs.hasOwnProperty('id')){
	    div.id = "row";	
    }
    const addChildren=(tags, parentNode)=>{
	    tags.children.forEach((tag)=>{
	    	console.log(tag);

	    	if(tag.children != null){
	    		const childrenTags=tag.children;
		    	childrenTags.forEach((childTag)=>{
		    		addChildren(childTag);
		    	})
	    	}
	    })

    }
    addChildren(tags, div);

    
    docFragment.appendChild(div);
	
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