import { version } from './core/version';
import { render } from './core/render';
import { updateUI } from './core/update-ui';
import { saveState } from './core/save-state';
import { timeTravel } from './core/time-travel';
import { setState } from './core/set-state';
import { createComponent } from './core/create-component';
import { deepCopy } from './utils/deep-copy';

export {
  version,
  updateUI,
  setState,
  createComponent,
  timeTravel,
  saveState,
  deepCopy,
  render
};