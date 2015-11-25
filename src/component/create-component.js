import {setState} from './set-state';
exports.createComponent = (spec)=> {
    spec._svenjs={rootNode:false};

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
