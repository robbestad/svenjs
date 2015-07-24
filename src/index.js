import { version } from './component/version';
import { updateUI } from './component/update-ui';
import { saveState } from './component/save-state';
import { timeTravel } from './component/time-travel';
import { setState } from './component/set-state';
import { createComponent } from './component/create-component';
import { lifeCycle } from './component/life-cycle';
import { render } from './component/render';
import { createStore } from './store/create-store';
import { deepCopy } from './lib/deep-copy';
import { jsx } from './component/jsx';
import { createElement } from './component/create-element';

export {
  version,
  updateUI,
  setState,
  createStore,
  createElement,
  createComponent,
  render,
  jsx,
  lifeCycle,
  timeTravel,
  saveState,
  deepCopy
};