import {deepCopy} from '../lib/deep-copy';
import {deepFreeze} from '../lib/deep-freeze';
exports.saveState = (spec,diff_state)=> {

  const state = deepCopy(diff_state);
  deepFreeze(state);
  return state;
};
