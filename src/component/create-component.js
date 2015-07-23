import {setState} from './set-state';
import {jsx} from './jsx';

exports.createComponent = (spec, rootNode) => {
    spec._svenjs={rootNode:{}};
	if(!spec.isBound){
		//console.log('binding');
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

	}

	if(spec.isMounted){
		if("function" === typeof spec.componentDidMount){
			spec.componentDidMount.apply(spec);
		}

		if("function" === typeof spec.render){
			console.log('applying render');
			document.getElementById('ui').innerHTML = "";
			spec.render.apply(spec);
		}
		
	}
	return spec;
};