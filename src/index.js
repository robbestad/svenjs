import { version } from './component/version';
import { saveState } from './component/save-state';
import { timeTravel } from './component/time-travel';
import { setState } from './component/set-state';
import { createComponent } from './component/create-component';
import { lifeCycle } from './component/life-cycle';
import { render } from './component/render';
import { createStore } from './store/create-store';
import { deepCopy } from './lib/deep-copy';
import { findDOMNode } from './lib/find-dom-node';

const Svenjs= {
  version,
  setState,
  createStore,
  createComponent,
  render,
  lifeCycle,
  timeTravel,
  saveState,
  findDOMNode,
  deepCopy
};

if (typeof module === "object" && module != null && module.exports) module.exports = Svenjs;
else if (typeof define === "function" && define.amd) define(function() { return Svenjs });