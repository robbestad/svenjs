import {saveState} from './save-state';
import {saveHistory} from './save-history';
import {lifeCycle} from './life-cycle';

exports.setState = (state, spec)=> {
    spec.state=saveState(spec,state);
    spec.time=saveHistory(spec,state);
	lifeCycle(spec);
};