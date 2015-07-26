import {deepCopy} from '../lib/deep-copy';
exports.saveState = (spec,state)=> {
  spec.state=deepCopy(state);

  let time;
  if(spec.time) time = spec.time;
  else time={ history: [], pos: -1 };

  time.history.splice(time.pos + 1);
  time.history.push(deepCopy(state));
  time.pos++;
};