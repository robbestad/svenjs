import {render} from "./render";
exports.lifeCycle = (spec)=> {
	if(spec.isMounted){
		if(spec.hasOwnProperty('componentDidUpdate')) spec.componentDidUpdate.apply(spec);
		render(spec, spec._svenjs.rootNode);
	}	
};