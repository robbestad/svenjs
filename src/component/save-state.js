import {deepCopy} from '../lib/deep-copy';
exports.saveState = (time,state)=> {
  time = time || {history: [], pos: -1};
  time.history.splice(time.pos + 1);
  time.history.push(deepCopy(state));
  time.pos++;
};