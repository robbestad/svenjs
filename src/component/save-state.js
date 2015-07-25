import {deepCopy} from '../lib/deep-copy';
exports.saveState = (spec,state)=> {
//	console.log(state.clicks);
  //spec.state.clicks=state.clicks;
  spec.state=deepCopy(state);
  let time = spec.time || {history: [], pos: -1};
  time.history.splice(time.pos + 1);
  time.history.push(deepCopy(state));
  time.pos++;
};