import {deepCopy} from '../utils/deep-copy';
import {updateUI} from './update-ui';
import {saveState} from './save-state';
import {lifeCycle} from './life-cycle';
import {binder} from './binder';

exports.setState = (state, spec)=> {
    saveState(spec.time,state);
	updateUI(spec, spec.render(state));
	lifeCycle(spec);
};
