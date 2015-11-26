import {deepCopy} from '../lib/deep-copy';
exports.saveState = (spec,diff_state)=> {

  const state = deepCopy(diff_state);
  Object.freeze(state);
  return state;
};
