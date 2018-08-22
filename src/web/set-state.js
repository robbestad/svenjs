import saveState from './save-state';
import lifeCycle from './life-cycle';

const setState = (state, spec)=> {
	spec.state = saveState(spec, state);
	lifeCycle(spec);
};
export default setState;
