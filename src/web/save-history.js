import {deepFreeze} from '../lib/deep-freeze';
exports.saveHistory = (spec,diff_state)=> {
  let time;
  if(spec.time) time = deepFreeze(spec.time);
  else time={ history: [], pos: -1 };

  time.history.splice(time.pos + 1);
  time.history.push(deepFreeze(diff_state));
  time.pos++;
  return time;
};
