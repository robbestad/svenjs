import {render} from "../core/render";
exports.lifeCycle = (spec)=> {
	if(spec.isMounted && spec._svenjs.rootNode){
		render(spec, spec._svenjs.rootNode);
		if(spec.hasOwnProperty('componentDidUpdate')) spec.componentDidUpdate.apply(spec);
	}	
};