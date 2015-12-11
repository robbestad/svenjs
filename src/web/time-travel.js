import {deepFreeze} from '../lib/deep-freeze';
import {lifeCycle} from './life-cycle';

exports.timeTravel = (spec,position)=> {
  let time = spec.time;
  let state = spec.state;
  time.pos+=position;
  spec.state=state;
  state = deepFreeze(time.history[time.pos]);
  spec.state=state;
  spec,spec.render(state, spec._svenjs.rootNode);
  lifeCycle(spec);
};
