import {deepCopy} from '../utils/deep-copy';
import {updateUI} from './update-ui';
import {saveState} from './save-state';
import {lifeCycle} from './life-cycle';

exports.setState = (state, spec, autobind="not set")=> {
	console.log('set-state');
	console.log(state);
	console.log(autobind);
    saveState(spec.time,state);
	updateUI(spec, spec.render(state));
	lifeCycle(spec);
};