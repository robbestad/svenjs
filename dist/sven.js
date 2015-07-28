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

	var _componentVersion = __webpack_require__(9);

	var _componentTimeTravel = __webpack_require__(8);

	var _componentSetState = __webpack_require__(4);

	var _componentCreateComponent = __webpack_require__(5);

	var _componentLifeCycle = __webpack_require__(2);

	var _componentRender = __webpack_require__(3);

	var _storeCreateStore = __webpack_require__(12);

	var _libDeepCopy = __webpack_require__(1);

	var _libFindDomNode = __webpack_require__(10);

	var Svenjs = {
	  version: _componentVersion.version,
	  setState: _componentSetState.setState,
	  createStore: _storeCreateStore.createStore,
	  createComponent: _componentCreateComponent.createComponent,
	  render: _componentRender.render,
	  renderToString: _componentRender.renderToString,
	  lifeCycle: _componentLifeCycle.lifeCycle,
	  timeTravel: _componentTimeTravel.timeTravel,
	  findDOMNode: _libFindDomNode.findDOMNode,
	  deepCopy: _libDeepCopy.deepCopy
	};

	if (typeof module === 'object' && module != null && module.exports) module.exports = Svenjs;else if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	  return Svenjs;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)(module)))

/***/ },
/* 1 */
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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _render = __webpack_require__(3);

	exports.lifeCycle = function (spec) {
		if (spec.isMounted && spec._svenjs.rootNode) {
			_render.render(spec, spec._svenjs.rootNode);
			if (spec.hasOwnProperty("componentDidUpdate")) spec.componentDidUpdate.apply(spec);
		}
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * render module.
	 * @module component/render
	 * @see module:svenjs
	 * @author Sven A Robbestad <robbestad@gmail.com> 
	 */

	// define common functions used in this module
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
	var isDefined = function isDefined(object) {
		return type.call(object) !== "undefined";
	};

	var appendChild = function appendChild(child, parent) {
		return parent.appendChild(child);
	};

	// Speed up calls to hasOwnProperty
	var hasOwnProperty = Object.prototype.hasOwnProperty;

	//const voidElements = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;

	/**
	 * setAttrs. This sets all attributes on the node tag, like class names, event handlers etc.
	 * @param {tag} a tag structure (e.g {tag: "div", attrs: {class:"test"}, children: []})
	 * @param {node} a DOM Node the children should be added to
	 * @returns {Object} a DOM Node
	 */
	var setAttrs = function setAttrs(tag, node) {
		if (tag.hasOwnProperty("children")) {
			if (isArray(tag.children)) {
				tag.children.forEach(function (childTag) {
					if (typeof childTag == "string" || typeof childTag == "number") {
						node.appendChild(document.createTextNode(childTag));
					}
				});
			}
		}
		if (hasOwnProperty.call(tag, "attrs")) {
			var attr = tag.attrs;
			for (var attrName in attr) {
				if (attrName === "config" || attrName === "key") continue;
				if (attrName === "disabled" && attr[attrName] === false) continue;else if (attrName == "class" || attrName == "className") node.className = attr[attrName].toString();else if (isFunction(attr[attrName]) && attrName.slice(0, 2) == "on") {
					node[attrName.toLowerCase()] = attr[attrName];
				} else if (attrName === "checked" && (attr[attrName] === false || attr[attrName] === "")) continue;else {
					node.setAttribute("" + attrName, attr[attrName].toString());
				}
			}
		}
		return node;
	};

	/**
	 * buildChildren
	 * @param {tags} a tag structure (e.g {tag: "div", attrs: {class:"test"}, children: []})
	 * @param {parent} a DOM Node the children should be added to
	 * @returns {Object} a DOM Node
	 */
	var buildChildren = function buildChildren(tags, parent) {
		if (typeof tags.children != "object") {
			if (hasOwnProperty.call(tags, "tag")) {
				if (hasOwnProperty.call(tags, "children")) {
					if (isArray(tags.children)) {
						tags.forEach(function (tag) {
							var child = document.createElement(tag.tag);
							appendChild(setAttrs(tag, child), parent);
						});
					}
				}
			} else return false;
		}
		if (hasOwnProperty.call(tags, "children")) {
			if (isArray(tags.children)) {
				tags.children.forEach(function (tag, idx) {
					var tagName = tag.tag;
					if (isArray(tag)) {
						tag.forEach(function (childtag, idx) {
							var child = document.createElement(childtag.tag);
							appendChild(setAttrs(childtag, child), parent);
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
		}
		if (hasOwnProperty.call(tags, "tag") && isArray(tags)) {
			if (isArray(tags)) {
				tags.forEach(function (tag) {
					buildChildren(tag, parent);
				});
			}
		}
		return parent;
	};

	var renderToString = exports.renderToString = function (tags) {
		return vDom(tags).innerHTML;
	};

	/**
	 * vDom
	 * @param {tags} a tag structure (e.g {tag: "div", attrs: {class:"test"}, children: []})
	 * @returns {Object} a DOM Node
	 */
	var vDom = function vDom(tags) {
		var docFragment = document.createDocumentFragment();

		// Root node  
		var root = document.createElement(tags.tag);
		setAttrs(tags, root);

		// Build children
		var childrenTree = buildChildren(tags, root);

		// Append to root node
		docFragment.appendChild(childrenTree);

		// Append to window
		return docFragment;
	};

	/**
	 * Render
	 * @alias svenjs.render
	 * @param {spec} a Svenjs component with a render method. Optional, set to false if not used
	 * @param {node} a document node (e.g from document.getElementById()).
	 * @param {tags} optional pre-rendered tags
	 * @returns {undefined}
	 */
	exports.render = function (spec, node) {
		var preRendered = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

		if (node) {

			if (isObject(spec)) {
				// Set internal ref
				if (!hasOwnProperty.call(spec, "_svenjs")) {
					spec._svenjs = { rootNode: false };
				}
				spec._svenjs.rootNode = node;
			}

			// reset HTML
			node.innerHTML = "";
			// Get the converted tags
			var tags = undefined;

			if (isObject(preRendered)) {
				tags = preRendered;
			} else {
				tags = spec.render();
			}

			// Append to window
			node.appendChild(vDom(tags));
		} else {
			return "Error: no node to attach rendered HTML";
		}
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _saveState = __webpack_require__(7);

	var _saveHistory = __webpack_require__(6);

	var _lifeCycle = __webpack_require__(2);

	exports.setState = function (state, spec) {
	    spec.state = _saveState.saveState(spec, state);
	    spec.time = _saveHistory.saveHistory(spec, state);
	    _lifeCycle.lifeCycle(spec);
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _setState = __webpack_require__(4);

	var _libLog = __webpack_require__(11);

	exports.createComponent = function (spec) {
		//spec.displayName::log('info');
		spec._svenjs = { rootNode: false };

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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _libDeepCopy = __webpack_require__(1);

	exports.saveHistory = function (spec, diff_state) {
	  var time = undefined;
	  if (spec.time) time = _libDeepCopy.deepCopy(spec.time);else time = { history: [], pos: -1 };

	  time.history.splice(time.pos + 1);
	  time.history.push(_libDeepCopy.deepCopy(diff_state));
	  time.pos++;
	  return time;
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _libDeepCopy = __webpack_require__(1);

	exports.saveState = function (spec, diff_state) {

	  var state = _libDeepCopy.deepCopy(diff_state);
	  Object.freeze(state);
	  return state;
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _libDeepCopy = __webpack_require__(1);

	var _lifeCycle = __webpack_require__(2);

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

	exports.findDOMNode = function (ref) {};

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";

	exports.log = function log(level) {
		level = level || "debug";
		console[level](this);
	};

/***/ },
/* 12 */
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
/* 13 */
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