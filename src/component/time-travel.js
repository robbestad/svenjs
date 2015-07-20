import {deepCopy} from '../lib/deep-copy';
import {updateUI} from './update-ui';
import {lifeCycle} from './life-cycle';

exports.timeTravel = (spec,position)=> {
  let time = spec.time;
  let state = spec.state;
  time.pos+=position;
  state = deepCopy(time.history[time.pos]);
  spec.state=state;
  updateUI(spec,spec.render(state), time);
  lifeCycle(spec);
};