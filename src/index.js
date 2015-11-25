import { version } from './component/version';
import { timeTravel } from './component/time-travel';
import { setState } from './component/set-state';
import { create } from './component/create';
import { lifeCycle } from './component/life-cycle';
import { render, renderToString } from './component/render';
import { createStore } from './store/create-store';
import { deepCopy } from './lib/deep-copy';

const Svenjs= {
  version,
  setState,
  createStore,
  create,
  render,
  renderToString,
  lifeCycle,
  timeTravel,
  deepCopy
};

if (typeof module === "object" && module != null && module.exports) module.exports = Svenjs;
else if (typeof define === "function" && define.amd) define(function() { return Svenjs });
