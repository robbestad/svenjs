import { version } from './core/version';
import { create } from './core/create';
import { render, renderToString } from './core/render';
import { setState } from './web/set-state';
import { lifeCycle } from './web/life-cycle';
import { createStore } from './store/create-store';

console.log('version 1.3');

const Svenjs= {
  version,
  create,
  setState,
  createStore,
  render,
  renderToString,
  lifeCycle
};

if (typeof module === "object" && module != null && module.exports) module.exports = Svenjs;
else if (typeof define === "function" && define.amd) define(function() { return Svenjs });
