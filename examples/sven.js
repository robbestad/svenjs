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

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {'use strict';

	var _componentVersion = __webpack_require__(8);

	var _componentSaveState = __webpack_require__(4);

	var _componentTimeTravel = __webpack_require__(7);

	var _componentSetState = __webpack_require__(5);

	var _componentCreateComponent = __webpack_require__(6);

	var _componentLifeCycle = __webpack_require__(1);

	var _componentRender = __webpack_require__(3);

	var _storeCreateStore = __webpack_require__(9);

	var _libDeepCopy = __webpack_require__(2);

	var Svenjs = {
	  version: _componentVersion.version,
	  setState: _componentSetState.setState,
	  createStore: _storeCreateStore.createStore,
	  createComponent: _componentCreateComponent.createComponent,
	  render: _componentRender.render,
	  lifeCycle: _componentLifeCycle.lifeCycle,
	  timeTravel: _componentTimeTravel.timeTravel,
	  saveState: _componentSaveState.saveState,
	  deepCopy: _libDeepCopy.deepCopy
	};

	if (typeof module === 'object' && module != null && module.exports) module.exports = Svenjs;else if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	  return Svenjs;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module)))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _render = __webpack_require__(3);

	exports.lifeCycle = function (spec) {
		if (spec.isMounted && spec._svenjs.rootNode != {}) {
			if (spec.hasOwnProperty("componentDidUpdate")) spec.componentDidUpdate.apply(spec);
			_render.render(spec, spec._svenjs.rootNode);
		}
	};

/***/ },
/* 2 */
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
/* 3 */
/***/ function(module, exports) {

	"use strict";

	var type = ({}).toString;
	var isFunction = function isFunction(object) {
		return typeof object === "function";
	};
	var isObject = function isObject(object) {
		return type.call(object) === "[object Object]";
	};
	var isString = function isString(object) {
		return type.call(object) === "[object String]";
	};
	var isArray = function isArray(object) {
		return type.call(object) === "[object Array]";
	};

	var appendChild = function appendChild(child, parent) {
		return parent.appendChild(child);
	};
	var voidElements = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;
	var setAttrs = function setAttrs(tag, node) {
		if (tag.hasOwnProperty("children")) {
			tag.children.forEach(function (childTag) {
				if (typeof childTag == "string" || typeof childTag == "number") {
					node.appendChild(document.createTextNode(childTag));
				}
			});
		}
		if (tag.hasOwnProperty("attrs")) {
			var attr = tag.attrs;
			for (var attrName in attr) {
				if (attrName === "config" || attrName === "key") continue;else if (attrName == "class" || attrName == "className") node.className = attr[attrName].toString();else if (isFunction(attr[attrName]) && attrName.slice(0, 2) == "on") {
					node[attrName.toLowerCase()] = attr[attrName];
				} else if (attrName === "checked" && (attr[attrName] === false || attr[attrName] === "")) continue;else {
					node.setAttribute("" + attrName, attr[attrName].toString());
				}
			}
		}
		return node;
	};

	var buildChildren = function buildChildren(tags, parent) {
		if (typeof tags.children != "object") {
			if (!tags.hasOwnProperty("tag")) {
				if (tags.hasOwnProperty("children")) {
					tags.forEach(function (tag) {
						var child = document.createElement(tag.tag);
						appendChild(setAttrs(tag, child), parent);
					});
				}
			} else return false;
		}
		if (tags.hasOwnProperty("children")) {
			tags.children.forEach(function (tag, idx) {
				var tagName = tag.tag;
				if (isArray(tag)) {
					tag.forEach(function (childtag, idx) {
						var child = document.createElement(childtag.tag);
						appendChild(setAttrs(tag, child), parent);
						buildChildren(childtag, child);
					});
				} else {
					if ("undefined" == typeof tagName) tagName = "span";
					var child = document.createElement(tagName);
					appendChild(setAttrs(tag, child), parent);
					buildChildren(tag, child);
				}
			});
		}
		if (!tags.hasOwnProperty("tag") && isArray(tags)) {
			tags.forEach(function (tag) {
				buildChildren(tag, parent);
			});
		}
		return parent;
	};

	exports.render = function (spec, node) {
		spec._svenjs.rootNode = node;
		node.innerHTML = "";

		var tags = spec.render();

		var docFragment = document.createDocumentFragment();

		// Root node  
		var root = document.createElement(tags.tag);
		if (tags.attrs.hasOwnProperty("id")) {
			root.id = tags.attrs.id;
		}

		// Build children
		var childrenTree = buildChildren(tags, root);

		// Append to root node
		docFragment.appendChild(childrenTree);

		// Append to window
		node.appendChild(docFragment);
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _libDeepCopy = __webpack_require__(2);

	exports.saveState = function (spec, state) {
	  spec.state = _libDeepCopy.deepCopy(state);
	  var time = spec.time || { history: [], pos: -1 };
	  time.history.splice(time.pos + 1);
	  time.history.push(_libDeepCopy.deepCopy(state));
	  time.pos++;
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _saveState = __webpack_require__(4);

	var _lifeCycle = __webpack_require__(1);

	exports.setState = function (state, spec) {
	    _saveState.saveState(spec, state);
	    _lifeCycle.lifeCycle(spec);
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _setState = __webpack_require__(5);

	function log(level) {
		level = level || 'debug';
		console[level](this);
	}
	exports.createComponent = function (spec) {
		var _context;

		(_context = spec.displayName, log).call(_context, 'info');
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
			if ('function' === typeof spec.componentDidMount) {
				spec.componentDidMount.apply(spec);
			}
		}
		return spec;
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _libDeepCopy = __webpack_require__(2);

	var _lifeCycle = __webpack_require__(1);

	exports.timeTravel = function (spec, position) {
	  var time = spec.time;
	  var state = spec.state;
	  time.pos += position;
	  spec.state = state;
	  state = _libDeepCopy.deepCopy(time.history[time.pos]);
	  spec.state = state;
	  spec, spec.render(state, spec._svenjs.rootNode);
	  _lifeCycle.lifeCycle(spec);
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	exports.version = function () {
	  return "0.0.2-alpha";
	};

/***/ },
/* 9 */
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

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }
/******/ ])
});
;