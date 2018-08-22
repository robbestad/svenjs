import {deepCopy} from '../lib/deep-copy';
import {deepFreeze} from '../lib/deep-freeze';
const saveState = (spec,diff_state)=> {
  const state = deepCopy(diff_state);
  deepFreeze(state);
  return state;
};
export default saveState;
