/**
 * @module core/create
 * @see module:svenjs
 * @author Sven A Robbestad <sven@robbestad.com>
 */
'use strict';
import {version} from './version';
import setState from '../web/set-state';
import lifeCycle from "root/web/life-cycle"

const create = (spec, props) => {
	spec._svenjs = {rootNode: false};
	spec.props = {};
	if (props) {
		spec._jsxid = spec.props.sjxid;
		spec.props = props;
		setTimeout(() => lifeCycle(spec), 0);
		delete spec.props.sjxid;
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
		spec.time = {history: [], pos: -1}
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
