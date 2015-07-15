import {deepCopy} from '../utils/deep-copy';
exports.saveState = (time,state)=> {
  time = time || {history: [], pos: -1};
// delete future history from this point
  time.history.splice(time.pos + 1);
// push state to history
  time.history.push(deepCopy(state));
  time.pos++;
};