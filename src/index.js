import version from './core/version';
import create from './core/create';
import {render, renderToString} from './core/render';
import setState from './web/set-state';
import lifeCycle from './web/life-cycle';
import createStore from './store/create-store';

console.log(`running svenjs version ${version}`);

const Svenjs = {
	version,
	create,
	setState,
	createStore,
	render,
	renderToString,
	lifeCycle
};

export default Svenjs;
// if (typeof module === "object" && module != null && module.exports) module.exports = Svenjs;
// else if (typeof define === "function" && define.amd) define(function () {
// 	return Svenjs
// });
