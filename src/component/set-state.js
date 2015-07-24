import {updateUI} from './update-ui';
import {saveState} from './save-state';
import {lifeCycle} from './life-cycle';

exports.setState = (state, spec)=> {
    saveState(spec.time,state);
    spec.render(state);
//	updateUI(spec, spec.render(state));
	lifeCycle(spec);
	//spec.render.apply(spec);

};
