import {saveState} from './save-state';
import {lifeCycle} from './life-cycle';

exports.setState = (state, spec)=> {
	spec.state = saveState(spec, state);
	lifeCycle(spec);
};
