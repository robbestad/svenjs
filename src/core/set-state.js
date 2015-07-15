import {deepCopy} from '../utils/deep-copy';
import {updateUI} from './update-ui';
import {saveState} from './save-state';
import {lifeCycle} from './life-cycle';

exports.setState = (state, time, callback)=> {
    saveState(time,state);
	updateUI(callback.render(state), time, callback);
	lifeCycle(callback);
};