import {deepCopy} from '../lib/deep-copy';
exports.saveHistory = (spec,diff_state)=> {
  let time;
  if(spec.time) time = deepCopy(spec.time);
  else time={ history: [], pos: -1 };

  time.history.splice(time.pos + 1);
  time.history.push(deepCopy(diff_state));
  time.pos++;
  return time;
};