import {deepCopy} from '../utils/deep-copy';
import {updateUI} from './update-ui';
import {saveState} from './save-state';

exports.setState = (state, time, callback)=> {
    saveState(time,state);
	updateUI(callback.render(state), time);
};