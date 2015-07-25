import {render} from "./render";
exports.lifeCycle = (spec)=> {
	if(spec.isMounted && spec._svenjs.rootNode != {}){
		if(spec.hasOwnProperty('componentDidUpdate')) spec.componentDidUpdate.apply(spec);
		render(spec, spec._svenjs.rootNode);
	}	
};