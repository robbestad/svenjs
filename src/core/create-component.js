import {updateUI} from './update-ui';
exports.createComponent = (spec)=> {
	console.log('createComponent');
	if(!spec.isMounted){
		console.log('setting isMounted');
		spec.time={history: [], pos: -1}
		spec.isMounted=true;
	}
	spec.componentDidMount.apply(spec);

    updateUI(false, spec.render(spec.state), spec.time);

	return spec;
};