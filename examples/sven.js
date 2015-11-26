(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
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

	function _typeof2(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	var _version = __webpack_require__(6);

	var _create = __webpack_require__(5);

	var _render = __webpack_require__(3);

	var _timeTravel = __webpack_require__(11);

	var _setState = __webpack_require__(4);

	var _lifeCycle = __webpack_require__(2);

	var _createStore = __webpack_require__(8);

	var _deepCopy = __webpack_require__(1);

	function _typeof(obj) {
	  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
	}

	var Svenjs = {
	  version: _version.version,
	  create: _create.create,
	  setState: _setState.setState,
	  createStore: _createStore.createStore,
	  render: _render.render,
	  renderToString: _render.renderToString,
	  lifeCycle: _lifeCycle.lifeCycle,
	  timeTravel: _timeTravel.timeTravel,
	  deepCopy: _deepCopy.deepCopy
	};

	if (( false ? 'undefined' : _typeof(module)) === "object" && module != null && module.exports) module.exports = Svenjs;else if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	  return Svenjs;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)(module)))

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	exports.deepCopy = function (o) {
	  return JSON.parse(JSON.stringify(o));
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _render = __webpack_require__(3);

	exports.lifeCycle = function (spec) {
		var rootNode = undefined;
		if (spec._svenjs.rootNode) {
			rootNode = spec._svenjs.rootNode;
		};

		var sjxid = document.querySelector("[sjxid='" + spec.render().attrs.sjxid + "']");
		if (sjxid) {
			rootNode = sjxid;
		};

		if (spec.isMounted && rootNode) {
			(0, _render.render)(spec, rootNode);
			if (spec.hasOwnProperty('componentDidUpdate')) spec.componentDidUpdate.apply(spec);
		}
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _validations = __webpack_require__(7);

	/**
	 * render module.
	 * @module component/render
	 * @see module:universaljs
	 * @author Sven A Robbestad <robbestad@gmail.com> 
	 */

	// The vDOM
	var vDomCache = [];

	// define common functions used in this mod ule

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
		if (hasOwnProperty.call(tag, 'children')) {
			if ((0, _validations.isArray)(tag.children)) {
				tag.children.forEach(function (childTag) {
					if (typeof childTag == "string" || typeof childTag == "number") {
						node.appendChild(document.createTextNode(childTag));
					}
				});
			}
		}
		if (hasOwnProperty.call(tag, 'attrs')) {
			var attr = tag.attrs;
			for (var attrName in attr) {
				if (attrName === "config" || attrName === "key") continue;
				if (attrName === "disabled" && attr[attrName] === false) continue;else if (attrName == "class" || attrName == "className") node.className = attr[attrName].toString();else if ((0, _validations.isFunction)(attr[attrName]) && attrName.slice(0, 2) == "on") {
					node[attrName.toLowerCase()] = attr[attrName];
				} else if (attrName === "checked" && (attr[attrName] === false || attr[attrName] === "")) continue;else {
					node.setAttribute('' + attrName, attr[attrName].toString());
				}
			}
		}
		return node;
	};

	/**
	 * buildElement
	 * @param {tag} a tag structure (e.g {tag: "div", attrs: {class:"test"}, children: []})
	 * @returns {Object} a DOM Node
	 */
	var buildElement = function buildElement(tag) {
		var child = document.createElement(tag.tag);
		setAttrs(tag, child);
		return child;
	};

	/**
	 * buildChildren
	 * @param {tags} a tag structure (e.g {tag: "div", attrs: {class:"test"}, children: []})
	 * @param {parent} a DOM Node the children should be added to
	 * @returns {Object} a DOM Node
	 */
	var buildChildren = function buildChildren(tags, parent) {
		//let _vdom=[];
		var childNode = undefined;
		if (hasOwnProperty.call(tags, 'children')) {
			if ((0, _validations.isArray)(tags.children)) {
				tags.children.forEach(function (tag, idx) {
					var tagName = tag.tag;
					if ((0, _validations.isArray)(tag)) {
						tag.forEach(function (childtag, idx) {
							// Subcomponents
							if (hasOwnProperty.call(childtag, 'sjxid')) {
								childtag.attrs['universaljs-id'] = sjxid;
							}
							childNode = buildElement(childtag);
							buildChildren(childtag, childNode);
							appendChild(childNode, parent);
						});
					} else {
						if ("undefined" != typeof tagName) {
							if (tag.tag === "strong" || tag.tag === "input") {
								childNode = buildElement(tag);
								appendChild(childNode, parent);
								buildChildren(tag, childNode);
							} else {
								childNode = buildElement(tag);
								buildChildren(tag, childNode);
								//_vdom.push(childNode,parent);
								appendChild(childNode, parent);
							}
						}
					}
				});
			}
		}
		return parent;
		//return [_vdom,parent];
	};

	exports.renderToString = function (tags, data) {
		return vDom(tags, data).innerHTML;
	};

	/**
	 * vDom
	 * @param {tags} a tag structure (e.g {tag: "div", attrs: {class:"test"}, children: []})
	 * @returns {Object} a DOM Node
	 */
	var vDom = function vDom(tags, data) {
		var docFragment = document.createDocumentFragment();

		// Root node  
		var root = document.createElement(tags.tag);
		setAttrs(tags, data.rootNode);

		// Build children
		var childrenTree = buildChildren(tags, root);
		docFragment.appendChild(childrenTree);

		//vDomCache.push(childrenTree[0]);

		//// Append to root node
		//vDomCache[vDomCache.length-1].forEach((node)=>{
		//docFragment.appendChild(node);
		//})

		// Append to window
		return docFragment;
	};

	/**
	 * Render
	 * @alias universaljs.render
	 * @param {spec} a universaljs component with a render method. Optional, set to false if not used
	 * @param {node} a document node (e.g from document.getElementById()).
	 * @param {tags} optional pre-rendered tags
	 * @returns {undefined}
	 */
	exports.render = function (spec, node) {
		var preRendered = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

		if (node) {

			if ((0, _validations.isObject)(spec)) {
				// Set internal ref
				if (!hasOwnProperty.call(spec, '_svenjs')) {
					spec._svenjs = { rootNode: false };
				}
				spec._svenjs.rootNode = node;
			}

			// reset HTML
			node.innerHTML = "";
			// Get the converted tags
			var tags = undefined;

			if ((0, _validations.isObject)(preRendered)) {
				tags = preRendered;
			} else {
				tags = spec.render();
			}

			// Append to window
			node.appendChild(vDom(tags, spec._svenjs));
		} else {
			return 'Error: no node to attach rendered HTML';
		}
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _saveState = __webpack_require__(10);

	var _saveHistory = __webpack_require__(9);

	var _lifeCycle = __webpack_require__(2);

	exports.setState = function (state, spec) {
	    spec.state = (0, _saveState.saveState)(spec, state);
	    spec.time = (0, _saveHistory.saveHistory)(spec, state);
	    (0, _lifeCycle.lifeCycle)(spec);
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _setState = __webpack_require__(4);

	exports.create = function (spec) {
		spec._svenjs = { rootNode: false };

		if (!spec.isBound) {
			spec.isBound = true;
			spec.setState = function (state) {
				return (0, _setState.setState)(state, this);
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
/* 6 */
/***/ function(module, exports) {

	"use strict";

	exports.version = function () {
	  return "0.0.2-alpha";
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict"

	// define common functions used in this module
	;
	var type = ({}).toString;
	exports.isFunction = function (object) {
	       return typeof object === "function";
	};
	exports.isObject = function (object) {
	       return type.call(object) === "[object Object]";
	};
	exports.isString = function (object) {
	       return type.call(object) === "[object String]";
	};
	exports.isArray = function (object) {
	       return type.call(object) === "[object Array]";
	};
	exports.isDefined = function (object) {
	       return type.call(object) !== "undefined";
	};

/***/ },
/* 8 */
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _deepCopy = __webpack_require__(1);

	exports.saveHistory = function (spec, diff_state) {
	  var time = undefined;
	  if (spec.time) time = (0, _deepCopy.deepCopy)(spec.time);else time = { history: [], pos: -1 };

	  time.history.splice(time.pos + 1);
	  time.history.push((0, _deepCopy.deepCopy)(diff_state));
	  time.pos++;
	  return time;
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _deepCopy = __webpack_require__(1);

	exports.saveState = function (spec, diff_state) {

	  var state = (0, _deepCopy.deepCopy)(diff_state);
	  Object.freeze(state);
	  return state;
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _deepCopy = __webpack_require__(1);

	var _lifeCycle = __webpack_require__(2);

	exports.timeTravel = function (spec, position) {
	  var time = spec.time;
	  var state = spec.state;
	  time.pos += position;
	  spec.state = state;
	  state = (0, _deepCopy.deepCopy)(time.history[time.pos]);
	  spec.state = state;
	  spec, spec.render(state, spec._svenjs.rootNode);
	  (0, _lifeCycle.lifeCycle)(spec);
	};

/***/ },
/* 12 */
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