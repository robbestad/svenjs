import {deepCopy} from '../utils/deep-copy';
import {updateUI} from './update-ui';
import {setState} from './set-state';
import {lifeCycle} from './life-cycle';

exports.timeTravel = (spec,position)=> {
  let time = spec.time;
  let state = spec.state;
  time.pos+=position;
  state = deepCopy(time.history[time.pos]);
  updateUI(spec.render(state), time, spec);
  lifeCycle(spec);
};