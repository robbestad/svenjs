import {updateUI} from './update-ui';
exports.createComponent = (spec)=> {
	if(!spec.isMounted){
		spec.time={history: [], pos: -1}
		spec.isMounted=true;
	}
	spec.componentDidMount.apply(spec);

    updateUI(spec.render(spec.state), spec.time);

	return spec;
};