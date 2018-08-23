/**
 * @module core/create
 * @see module:svenjs
 * @author Sven A Robbestad <sven@robbestad.com>
 */
import version from './version.js';
import setState from '../web/set-state.js';
import lifeCycle from "../web/life-cycle.js";
import deepClone from "../lib/deep-clone.js";
import uuid from "../lib/uuid.js";

const create = (_spec, props) => {
	const spec = deepClone(_spec);
	spec._svenjs = {rootNode: false};
	spec.isBound = false;
	spec.isMounted = false;
	spec.props = {};

	if (props) {
		spec._jsxid = spec.props.sjxid;
		spec.props = props;
		setTimeout(() => lifeCycle(spec), 0);
		delete spec.props.sjxid;
	}
	if (!spec.hasOwnProperty("attrs")) {
		if (!spec.hasOwnProperty("attrs")) {
			spec.attrs = {sjxid: uuid()};
		}
	}
	if (!spec.isBound) {
		spec.version = version;
		spec.isBound = true;
		spec.setState = function (state) {
			return setState(state, this);
		};
		if ("function" === typeof spec._beforeMount) {
			spec._beforeMount.apply(spec);
		}
	}
	if (!spec.isMounted) {
		spec.isMounted = true;

		if (undefined !== spec.initialState) {
			spec.state = spec.initialState;
		}
		if ("function" === typeof spec._didMount) {
			spec._didMount.apply(spec);
			if ("function" === typeof lifeCycle)
				setTimeout(() => lifeCycle(spec), 100);
		}
	}
	return spec;
};
export default create;
