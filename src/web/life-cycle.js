import {render} from "../core/render";

exports.lifeCycle = (spec)=> {
	let rootNode;
	if(spec._svenjs.rootNode){
		rootNode=spec._svenjs.rootNode;
	};

	let sjxid=document.querySelector("[sjxid='"+spec.render().attrs.sjxid+"']");
	if(sjxid){
		rootNode=sjxid;
	};

	if(spec.isMounted && rootNode){
		render(spec, rootNode);
		if(spec.hasOwnProperty('componentDidUpdate')) spec.componentDidUpdate.apply(spec);
	}	
};