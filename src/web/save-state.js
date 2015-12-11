import {deepFreeze} from '../lib/deep-freeze';
exports.saveState = (spec,diff_state)=> {

  const state = deepFreeze(diff_state);
  return state;
};
