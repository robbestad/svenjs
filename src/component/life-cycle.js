import {render} from "./render";
exports.lifeCycle = (spec)=> {
	if(spec.isMounted){
		spec.componentDidUpdate.apply(spec);
		render(spec, spec._svenjs.rootNode);
	}	
};