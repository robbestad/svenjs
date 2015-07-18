import { version } from './core/version';
import { updateUI } from './core/update-ui';
import { saveState } from './core/save-state';
import { timeTravel } from './core/time-travel';
import { setState } from './core/set-state';
import { createComponent } from './core/create-component';
import { lifeCycle } from './core/life-cycle';
import { binder } from './core/binder';
import { render } from './core/render';
import { deepCopy } from './utils/deep-copy';

export {
  version,
  updateUI,
  setState,
  createComponent,
  binder,
  render,
  lifeCycle,
  timeTravel,
  saveState,
  deepCopy
};