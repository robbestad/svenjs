import deepClone from '../lib/deep-clone.js';
import deepFreeze from '../lib/deep-freeze.js';
const saveState = (spec,diff_state)=> {
  const state = deepClone(diff_state);
  deepFreeze(state);
  return state;
};
export default saveState;
