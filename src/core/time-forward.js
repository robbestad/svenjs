import {deepCopy} from '../utils/deep-copy';
import {updateUI} from './update-ui';
import {setState} from './set-state';

exports.timeForward = (spec)=> {
	console.log('timeForward');
	let time=spec.time;
	let state=spec.state;
	state = time.history[time.pos];
	time.pos=time.pos+1;
  updateUI(true, spec.render(state), time);
};