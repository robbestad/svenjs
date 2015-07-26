import {setState} from './set-state';
function log(level){
	level = level || "debug";
	console[level](this)
}
exports.createComponent = (spec)=> {
	spec.displayName::log('info');
    spec._svenjs={rootNode:{}};

	if(!spec.isBound){
		spec.isBound=true;
		spec.setState=function(state){
		    return setState(state,this);
		 };

	}
	if(!spec.isMounted){
		spec.time={history: [], pos: -1}
		spec.isMounted=true;
		if(undefined !== spec.initialState){
			spec.state = spec.initialState;
		}
		if("function" === typeof spec.componentDidMount){
			spec.componentDidMount.apply(spec);
		}

	}
	return spec;
};