import {updateUI} from './update-ui';
exports.createComponent = (spec)=> {
	
	if(!spec.isMounted){
		spec.time={history: [], pos: -1}
		spec.isMounted=true;
		if(undefined !== spec.initialState){
			spec.state = spec.initialState;
		}
	}
	

	return spec;
};