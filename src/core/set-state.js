import {deepCopy} from '../utils/deep-copy';
import {updateUI} from './update-ui';
import {saveState} from './save-state';
import {lifeCycle} from './life-cycle';

exports.setState = (state, time, spec)=> {
    saveState(time,state);
	updateUI(spec, spec.render(state), time);
	lifeCycle(spec);
};