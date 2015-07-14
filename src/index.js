import { version } from './core/version';
import { render } from './core/render';
import { updateUI } from './core/update-ui';
import { saveState } from './core/save-state';
import { setState } from './core/set-state';
import { timeTravel } from './core/time-travel';
import { timeForward } from './core/time-forward';
import { createComponent } from './core/create-component';
import { deepCopy } from './utils/deep-copy';

export {
  version,
  createComponent,
  updateUI,
  setState,
  timeTravel,
  timeForward,
  saveState,
  deepCopy,
  render
};