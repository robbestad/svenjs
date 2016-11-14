import { version } from './core/version';
import { create } from './core/create';
import { render, renderToString } from './core/render';

import { timeTravel } from './web/time-travel';
import { setState } from './web/set-state';
import { lifeCycle } from './web/life-cycle';
import { createStore } from './store/create-store';
import { deepCopy } from './lib/deep-copy';

console.log('version 1.3');


const Svenjs= {
  version,
  create,
  setState,
  createStore,
  render,
  renderToString,
  lifeCycle,
  timeTravel,
  deepCopy
};

if (typeof module === "object" && module != null && module.exports) module.exports = Svenjs;
else if (typeof define === "function" && define.amd) define(function() { return Svenjs });
