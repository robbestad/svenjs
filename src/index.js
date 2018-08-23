import version from './core/version';
import create from './core/create';
import {render, renderToString} from './core/render';
import setState from './web/set-state';
import lifeCycle from './web/life-cycle';
import createStore from './store/create-store';

console.info(`Running svenjs version ${version}`);

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
