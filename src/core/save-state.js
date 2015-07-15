import {deepCopy} from '../utils/deep-copy';
exports.saveState = (time,state)=> {
	console.log('save-state');
  time = time || {history: [], pos: -1};
// delete alternate future history
  time.history.splice(time.pos + 1);
// push state to history
  time.history.push(deepCopy(state));
  time.pos++;
console.log(time);
};