(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["Svenjs"] = factory();
	else
		root["Svenjs"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _componentVersion = __webpack_require__(9);

	var _componentUpdateUi = __webpack_require__(1);

	var _componentSaveState = __webpack_require__(4);

	var _componentTimeTravel = __webpack_require__(8);

	var _componentSetState = __webpack_require__(5);

	var _componentCreateComponent = __webpack_require__(6);

	var _componentLifeCycle = __webpack_require__(2);

	var _componentRender = __webpack_require__(7);

	var _storeCreateStore = __webpack_require__(10);

	var _libDeepCopy = __webpack_require__(3);

	exports.version = _componentVersion.version;
	exports.updateUI = _componentUpdateUi.updateUI;
	exports.setState = _componentSetState.setState;
	exports.createStore = _storeCreateStore.createStore;
	exports.createComponent = _componentCreateComponent.createComponent;
	exports.render = _componentRender.render;
	exports.lifeCycle = _componentLifeCycle.lifeCycle;
	exports.timeTravel = _componentTimeTravel.timeTravel;
	exports.saveState = _componentSaveState.saveState;
	exports.deepCopy = _libDeepCopy.deepCopy;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	exports.updateUI = function (spec, html, time) {
	  var rootNode = spec._svenjs.rootNode;
	  time = time || spec.time;
	  html = html || spec.render(spec.state);
	  if (JSON.stringify(rootNode.innerHTML) === JSON.stringify(html)) {
	    return;
	  }
	  rootNode.innerHTML = "";
	  if (typeof html === "string") {
	    rootNode.appendChild(document.createRange().createContextualFragment(html));
	  } else {
	    rootNode.appendChild(html);
	  }
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	exports.lifeCycle = function (spec) {
		if (spec.isMounted) {
			spec.componentDidUpdate.apply(spec);
		}
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	var deepCopy = exports.deepCopy = function (obj) {
	  if (obj === null || typeof obj !== 'object' || 'isActiveClone' in obj) return obj;
	  var temp = obj.constructor();
	  for (var key in obj) {
	    if (Object.prototype.hasOwnProperty.call(obj, key)) {
	      obj['isActiveClone'] = null;
	      temp[key] = deepCopy(obj[key]);
	      delete obj['isActiveClone'];
	    }
	  }
	  return temp;
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _libDeepCopy = __webpack_require__(3);

	exports.saveState = function (time, state) {
	  time = time || { history: [], pos: -1 };
	  time.history.splice(time.pos + 1);
	  time.history.push(_libDeepCopy.deepCopy(state));
	  time.pos++;
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _updateUi = __webpack_require__(1);

	var _saveState = __webpack_require__(4);

	var _lifeCycle = __webpack_require__(2);

	exports.setState = function (state, spec) {
					_saveState.saveState(spec.time, state);
					_updateUi.updateUI(spec, spec.render(state));
					_lifeCycle.lifeCycle(spec);
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _setState = __webpack_require__(5);

	exports.createComponent = function (spec) {
		console.log(spec.displayName);
		spec._svenjs = { rootNode: {} };
		if (!spec.isBound) {
			spec.isBound = true;

			spec.setState = function (state) {
				return _setState.setState(state, this);
			};
		}
		if (!spec.isMounted) {
			spec.time = { history: [], pos: -1 };
			spec.isMounted = true;
			if (undefined !== spec.initialState) {
				spec.state = spec.initialState;
			}
			if ("function" === typeof spec.componentDidMount) {
				spec.componentDidMount.apply(spec);
			}
		}
		return spec;
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _updateUi = __webpack_require__(1);

	exports.render = function (spec, rootNode) {
	  spec._svenjs.rootNode = rootNode;
	  _updateUi.updateUI(spec);
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _libDeepCopy = __webpack_require__(3);

	var _updateUi = __webpack_require__(1);

	var _lifeCycle = __webpack_require__(2);

	exports.timeTravel = function (spec, position) {
	  var time = spec.time;
	  var state = spec.state;
	  time.pos += position;
	  state = _libDeepCopy.deepCopy(time.history[time.pos]);
	  spec.state = state;
	  _updateUi.updateUI(spec, spec.render(state), time);
	  _lifeCycle.lifeCycle(spec);
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";

	exports.version = function () {
	  return "0.0.2-alpha";
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";

	var _callbacks = [];
	exports.createStore = function (spec) {
		if (!spec.isMounted) {
			spec.listenTo = function (cb) {
				_callbacks.push(cb);
			};
			spec.emit = function (data) {
				_callbacks.forEach(function (cb) {
					cb(data);
				});
			};

			if ("function" === typeof spec.init) {
				spec.init.apply(spec);
			}
		}
		return spec;
	};

/***/ }
/******/ ])
});
;