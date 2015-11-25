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

	var Svenjs = __webpack_require__(1);
	var App = __webpack_require__(3);
	var rootNode = document.getElementById('myapp');
	Svenjs.render(App, rootNode);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	(function webpackUniversalModuleDefinition(root, factory) {
		if (true) module.exports = factory();else if (typeof define === 'function' && define.amd) define(factory);else if (typeof exports === 'object') exports['Svenjs'] = factory();else root['Svenjs'] = factory();
	})(undefined, function () {
		return ( /******/(function (modules) {
				// webpackBootstrap
				/******/ // The module cache
				/******/var installedModules = {};

				/******/ // The require function
				/******/function __webpack_require__(moduleId) {

					/******/ // Check if module is in cache
					/******/if (installedModules[moduleId])
						/******/return installedModules[moduleId].exports;

					/******/ // Create a new module (and put it into the cache)
					/******/var module = installedModules[moduleId] = {
						/******/exports: {},
						/******/id: moduleId,
						/******/loaded: false
						/******/ };

					/******/ // Execute the module function
					/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

					/******/ // Flag the module as loaded
					/******/module.loaded = true;

					/******/ // Return the exports of the module
					/******/return module.exports;
					/******/
				}

				/******/ // expose the modules object (__webpack_modules__)
				/******/__webpack_require__.m = modules;

				/******/ // expose the module cache
				/******/__webpack_require__.c = installedModules;

				/******/ // __webpack_public_path__
				/******/__webpack_require__.p = '';

				/******/ // Load entry module and return exports
				/******/return __webpack_require__(0);
				/******/
			})([
			/* 0 */
			/***/function (module, exports, __webpack_require__) {

				var __WEBPACK_AMD_DEFINE_RESULT__; /* WEBPACK VAR INJECTION */(function (module) {
					'use strict';

					var _componentVersion = __webpack_require__(8);

					var _componentSaveState = __webpack_require__(4);

					var _componentTimeTravel = __webpack_require__(7);

					var _componentSetState = __webpack_require__(5);

					var _componentCreateComponent = __webpack_require__(6);

					var _componentLifeCycle = __webpack_require__(1);

					var _componentRender = __webpack_require__(3);

					var _storeCreateStore = __webpack_require__(11);

					var _libDeepCopy = __webpack_require__(2);

					var _libFindDomNode = __webpack_require__(9);

					var Svenjs = {
						version: _componentVersion.version,
						setState: _componentSetState.setState,
						createStore: _storeCreateStore.createStore,
						create: _componentCreateComponent.create,
						render: _componentRender.render,
						lifeCycle: _componentLifeCycle.lifeCycle,
						timeTravel: _componentTimeTravel.timeTravel,
						saveState: _componentSaveState.saveState,
						findDOMNode: _libFindDomNode.findDOMNode,
						deepCopy: _libDeepCopy.deepCopy
					};

					if (typeof module === 'object' && module != null && module.exports) module.exports = Svenjs;else if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
						return Svenjs;
					}).call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
					/* WEBPACK VAR INJECTION */
				}).call(exports, __webpack_require__(12)(module));

				/***/
			},
			/* 1 */
			/***/function (module, exports, __webpack_require__) {

				'use strict';

				var _render = __webpack_require__(3);

				exports.lifeCycle = function (spec) {
					if (spec.isMounted && spec._svenjs.rootNode) {
						_render.render(spec, spec._svenjs.rootNode);
						if (spec.hasOwnProperty('componentDidUpdate')) spec.componentDidUpdate.apply(spec);
					}
				};

				/***/
			},
			/* 2 */
			/***/function (module, exports) {

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

				/***/
			},
			/* 3 */
			/***/function (module, exports) {

				'use strict';

				var type = ({}).toString;
				var isFunction = function isFunction(object) {
					return typeof object === 'function';
				};
				var isObject = function isObject(object) {
					return type.call(object) === '[object Object]';
				};
				var isString = function isString(object) {
					return type.call(object) === '[object String]';
				};
				var isArray = function isArray(object) {
					return type.call(object) === '[object Array]';
				};

				var appendChild = function appendChild(child, parent) {
					return parent.appendChild(child);
				};
				// Speed up calls to hasOwnProperty
				var hasOwnProperty = Object.prototype.hasOwnProperty;

				var voidElements = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;
				var setAttrs = function setAttrs(tag, node) {
					if (tag.hasOwnProperty('children')) {
						tag.children.forEach(function (childTag) {
							if (typeof childTag == 'string' || typeof childTag == 'number') {
								node.appendChild(document.createTextNode(childTag));
							}
						});
					}
					if (hasOwnProperty.call(tag, 'attrs')) {
						var attr = tag.attrs;
						for (var attrName in attr) {
							if (attrName === 'config' || attrName === 'key') continue;else if (attrName == 'class' || attrName == 'className') node.className = attr[attrName].toString();else if (isFunction(attr[attrName]) && attrName.slice(0, 2) == 'on') {
								node[attrName.toLowerCase()] = attr[attrName];
							} else if (attrName === 'checked' && (attr[attrName] === false || attr[attrName] === '')) continue;else {
								node.setAttribute('' + attrName, attr[attrName].toString());
							}
						}
					}
					return node;
				};

				var buildChildren = function buildChildren(tags, parent) {
					if (typeof tags.children != 'object') {
						if (hasOwnProperty.call(tags, 'tag')) {
							if (hasOwnProperty.call(tags, 'children')) {
								tags.forEach(function (tag) {
									var child = document.createElement(tag.tag);
									appendChild(setAttrs(tag, child), parent);
								});
							}
						} else return false;
					}
					if (hasOwnProperty.call(tags, 'children')) {
						tags.children.forEach(function (tag, idx) {
							var tagName = tag.tag;
							if (isArray(tag)) {
								tag.forEach(function (childtag, idx) {
									var child = document.createElement(childtag.tag);
									appendChild(setAttrs(childtag, child), parent);
									buildChildren(childtag, child);
								});
							} else {
								if ('undefined' == typeof tagName) tagName = 'span';
								var child = document.createElement(tagName);
								appendChild(setAttrs(tag, child), parent);
								buildChildren(tag, child);
							}
						});
					}
					if (hasOwnProperty.call(tags, 'tag') && isArray(tags)) {
						tags.forEach(function (tag) {
							buildChildren(tag, parent);
						});
					}
					return parent;
				};

				exports.render = function (spec, node) {
					spec._svenjs.rootNode = node;
					if (node) {
						node.innerHTML = '';

						var tags = spec.render();

						var docFragment = document.createDocumentFragment();

						// Root node 
						var root = document.createElement(tags.tag);
						if (tags.attrs.hasOwnProperty('id')) {
							root.id = tags.attrs.id;
						}

						// Build children
						var childrenTree = buildChildren(tags, root);

						// Append to root node
						docFragment.appendChild(childrenTree);

						// Append to window
						node.appendChild(docFragment);
					}
				};

				/***/
			},
			/* 4 */
			/***/function (module, exports, __webpack_require__) {

				'use strict';

				var _libDeepCopy = __webpack_require__(2);

				exports.saveState = function (spec, state) {
					spec.state = _libDeepCopy.deepCopy(state);

					var time = undefined;
					if (spec.time) time = spec.time;else time = { history: [], pos: -1 };

					time.history.splice(time.pos + 1);
					time.history.push(_libDeepCopy.deepCopy(state));
					time.pos++;
				};

				/***/
			},
			/* 5 */
			/***/function (module, exports, __webpack_require__) {

				'use strict';

				var _saveState = __webpack_require__(4);

				var _lifeCycle = __webpack_require__(1);

				exports.setState = function (state, spec) {
					_saveState.saveState(spec, state);
					_lifeCycle.lifeCycle(spec);
				};

				/***/
			},
			/* 6 */
			/***/function (module, exports, __webpack_require__) {

				'use strict';

				var _setState = __webpack_require__(5);

				var _libLog = __webpack_require__(10);

				exports.create = function (spec) {
					var _context;

					(_context = spec.displayName, _libLog.log).call(_context, 'info');
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

				/***/
			},
			/* 7 */
			/***/function (module, exports, __webpack_require__) {

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

				/***/
			},
			/* 8 */
			/***/function (module, exports) {

				'use strict';

				exports.version = function () {
					return '0.0.2-alpha';
				};

				/***/
			},
			/* 9 */
			/***/function (module, exports) {

				'use strict';

				exports.findDOMNode = function (ref) {};

				/***/
			},
			/* 10 */
			/***/function (module, exports) {

				'use strict';

				exports.log = function log(level) {
					level = level || 'debug';
					console[level](this);
				};

				/***/
			},
			/* 11 */
			/***/function (module, exports) {

				'use strict';

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

						if ('function' === typeof spec.init) {
							spec.init.apply(spec);
						}
					}
					return spec;
				};

				/***/
			},
			/* 12 */
			/***/function (module, exports) {

				module.exports = function (module) {
					if (!module.webpackPolyfill) {
						module.deprecate = function () {};
						module.paths = [];
						// module.parent = undefined by default
						module.children = [];
						module.webpackPolyfill = 1;
					}
					return module;
				}

				/***/;
			}
			/******/])
		);
	});
	;

	/************************************************************************/
	/******/

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	(function webpackUniversalModuleDefinition(root, factory) {
		if (true) module.exports = factory();else if (typeof define === 'function' && define.amd) define(factory);else if (typeof exports === 'object') exports['Svenjs'] = factory();else root['Svenjs'] = factory();
	})(undefined, function () {
		return ( /******/(function (modules) {
				// webpackBootstrap
				/******/ // The module cache
				/******/var installedModules = {};

				/******/ // The require function
				/******/function __webpack_require__(moduleId) {

					/******/ // Check if module is in cache
					/******/if (installedModules[moduleId])
						/******/return installedModules[moduleId].exports;

					/******/ // Create a new module (and put it into the cache)
					/******/var module = installedModules[moduleId] = {
						/******/exports: {},
						/******/id: moduleId,
						/******/loaded: false
						/******/ };

					/******/ // Execute the module function
					/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

					/******/ // Flag the module as loaded
					/******/module.loaded = true;

					/******/ // Return the exports of the module
					/******/return module.exports;
					/******/
				}

				/******/ // expose the modules object (__webpack_modules__)
				/******/__webpack_require__.m = modules;

				/******/ // expose the module cache
				/******/__webpack_require__.c = installedModules;

				/******/ // __webpack_public_path__
				/******/__webpack_require__.p = '';

				/******/ // Load entry module and return exports
				/******/return __webpack_require__(0);
				/******/
			})([
			/* 0 */
			/***/function (module, exports, __webpack_require__) {

				var __WEBPACK_AMD_DEFINE_RESULT__; /* WEBPACK VAR INJECTION */(function (module) {
					'use strict';

					var _componentVersion = __webpack_require__(8);

					var _componentSaveState = __webpack_require__(4);

					var _componentTimeTravel = __webpack_require__(7);

					var _componentSetState = __webpack_require__(5);

					var _componentCreateComponent = __webpack_require__(6);

					var _componentLifeCycle = __webpack_require__(1);

					var _componentRender = __webpack_require__(3);

					var _storeCreateStore = __webpack_require__(11);

					var _libDeepCopy = __webpack_require__(2);

					var _libFindDomNode = __webpack_require__(9);

					var Svenjs = {
						version: _componentVersion.version,
						setState: _componentSetState.setState,
						createStore: _storeCreateStore.createStore,
						create: _componentCreateComponent.create,
						render: _componentRender.render,
						lifeCycle: _componentLifeCycle.lifeCycle,
						timeTravel: _componentTimeTravel.timeTravel,
						saveState: _componentSaveState.saveState,
						findDOMNode: _libFindDomNode.findDOMNode,
						deepCopy: _libDeepCopy.deepCopy
					};

					if (typeof module === 'object' && module != null && module.exports) module.exports = Svenjs;else if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
						return Svenjs;
					}).call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
					/* WEBPACK VAR INJECTION */
				}).call(exports, __webpack_require__(12)(module));

				/***/
			},
			/* 1 */
			/***/function (module, exports, __webpack_require__) {

				'use strict';

				var _render = __webpack_require__(3);

				exports.lifeCycle = function (spec) {
					if (spec.isMounted && spec._svenjs.rootNode) {
						_render.render(spec, spec._svenjs.rootNode);
						if (spec.hasOwnProperty('componentDidUpdate')) spec.componentDidUpdate.apply(spec);
					}
				};

				/***/
			},
			/* 2 */
			/***/function (module, exports) {

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

				/***/
			},
			/* 3 */
			/***/function (module, exports) {

				'use strict';

				var type = ({}).toString;
				var isFunction = function isFunction(object) {
					return typeof object === 'function';
				};
				var isObject = function isObject(object) {
					return type.call(object) === '[object Object]';
				};
				var isString = function isString(object) {
					return type.call(object) === '[object String]';
				};
				var isArray = function isArray(object) {
					return type.call(object) === '[object Array]';
				};

				var appendChild = function appendChild(child, parent) {
					return parent.appendChild(child);
				};
				// Speed up calls to hasOwnProperty
				var hasOwnProperty = Object.prototype.hasOwnProperty;

				var voidElements = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;
				var setAttrs = function setAttrs(tag, node) {
					if (tag.hasOwnProperty('children')) {
						tag.children.forEach(function (childTag) {
							if (typeof childTag == 'string' || typeof childTag == 'number') {
								node.appendChild(document.createTextNode(childTag));
							}
						});
					}
					if (hasOwnProperty.call(tag, 'attrs')) {
						var attr = tag.attrs;
						for (var attrName in attr) {
							if (attrName === 'config' || attrName === 'key') continue;else if (attrName == 'class' || attrName == 'className') node.className = attr[attrName].toString();else if (isFunction(attr[attrName]) && attrName.slice(0, 2) == 'on') {
								node[attrName.toLowerCase()] = attr[attrName];
							} else if (attrName === 'checked' && (attr[attrName] === false || attr[attrName] === '')) continue;else {
								node.setAttribute('' + attrName, attr[attrName].toString());
							}
						}
					}
					return node;
				};

				var buildChildren = function buildChildren(tags, parent) {
					if (typeof tags.children != 'object') {
						if (hasOwnProperty.call(tags, 'tag')) {
							if (hasOwnProperty.call(tags, 'children')) {
								tags.forEach(function (tag) {
									var child = document.createElement(tag.tag);
									appendChild(setAttrs(tag, child), parent);
								});
							}
						} else return false;
					}
					if (hasOwnProperty.call(tags, 'children')) {
						tags.children.forEach(function (tag, idx) {
							var tagName = tag.tag;
							if (isArray(tag)) {
								tag.forEach(function (childtag, idx) {
									var child = document.createElement(childtag.tag);
									appendChild(setAttrs(childtag, child), parent);
									buildChildren(childtag, child);
								});
							} else {
								if ('undefined' == typeof tagName) tagName = 'span';
								var child = document.createElement(tagName);
								appendChild(setAttrs(tag, child), parent);
								buildChildren(tag, child);
							}
						});
					}
					if (hasOwnProperty.call(tags, 'tag') && isArray(tags)) {
						tags.forEach(function (tag) {
							buildChildren(tag, parent);
						});
					}
					return parent;
				};

				exports.render = function (spec, node) {
					spec._svenjs.rootNode = node;
					if (node) {
						node.innerHTML = '';

						var tags = spec.render();

						var docFragment = document.createDocumentFragment();

						// Root node 
						var root = document.createElement(tags.tag);
						if (tags.attrs.hasOwnProperty('id')) {
							root.id = tags.attrs.id;
						}

						// Build children
						var childrenTree = buildChildren(tags, root);

						// Append to root node
						docFragment.appendChild(childrenTree);

						// Append to window
						node.appendChild(docFragment);
					}
				};

				/***/
			},
			/* 4 */
			/***/function (module, exports, __webpack_require__) {

				'use strict';

				var _libDeepCopy = __webpack_require__(2);

				exports.saveState = function (spec, state) {
					spec.state = _libDeepCopy.deepCopy(state);

					var time = undefined;
					if (spec.time) time = spec.time;else time = { history: [], pos: -1 };

					time.history.splice(time.pos + 1);
					time.history.push(_libDeepCopy.deepCopy(state));
					time.pos++;
				};

				/***/
			},
			/* 5 */
			/***/function (module, exports, __webpack_require__) {

				'use strict';

				var _saveState = __webpack_require__(4);

				var _lifeCycle = __webpack_require__(1);

				exports.setState = function (state, spec) {
					_saveState.saveState(spec, state);
					_lifeCycle.lifeCycle(spec);
				};

				/***/
			},
			/* 6 */
			/***/function (module, exports, __webpack_require__) {

				'use strict';

				var _setState = __webpack_require__(5);

				var _libLog = __webpack_require__(10);

				exports.create = function (spec) {
					var _context;

					(_context = spec.displayName, _libLog.log).call(_context, 'info');
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

				/***/
			},
			/* 7 */
			/***/function (module, exports, __webpack_require__) {

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

				/***/
			},
			/* 8 */
			/***/function (module, exports) {

				'use strict';

				exports.version = function () {
					return '0.0.2-alpha';
				};

				/***/
			},
			/* 9 */
			/***/function (module, exports) {

				'use strict';

				exports.findDOMNode = function (ref) {};

				/***/
			},
			/* 10 */
			/***/function (module, exports) {

				'use strict';

				exports.log = function log(level) {
					level = level || 'debug';
					console[level](this);
				};

				/***/
			},
			/* 11 */
			/***/function (module, exports) {

				'use strict';

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

						if ('function' === typeof spec.init) {
							spec.init.apply(spec);
						}
					}
					return spec;
				};

				/***/
			},
			/* 12 */
			/***/function (module, exports) {

				module.exports = function (module) {
					if (!module.webpackPolyfill) {
						module.deprecate = function () {};
						module.paths = [];
						// module.parent = undefined by default
						module.children = [];
						module.webpackPolyfill = 1;
					}
					return module;
				}

				/***/;
			}
			/******/])
		);
	});
	;

	/************************************************************************/
	/******/

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Svenjs = __webpack_require__(2);
	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;
	var _toggled = false;
	var _prevEditing = false;
	var _currentEdit = 0;

	var todoMVCApp = Svenjs.create({
	  displayName: "TodoMVC App",
	  initialState: {
	    messages: [{ id: 1, message: "Answer mail", complete: false, editing: false }, { id: 2, message: "Get a cup of coffee", complete: false, editing: false }]
	  },
	  componentDidUpdate: function componentDidUpdate() {
	    var node = document.getElementById("new-todo");
	    if (node !== null && _prevEditing) {
	      _prevEditing = false;
	      node.focus();
	      node.setSelectionRange(node.value.length, node.value.length);
	    }
	  },
	  componentDidMount: function componentDidMount() {
	    var url = self.history === true ? self.getPath() : window.location.hash.replace(/.*#\//, "");
	    this.setState({ messages: this.state.messages, url: url });
	    window.addEventListener("hashchange", this.onHashChange.bind(this), false);
	  },
	  handleEditTodoKeyDown: function handleEditTodoKeyDown(e) {

	    if (e.keyCode === ESCAPE_KEY) {
	      this.simpleResetEditing();
	      return;
	    }
	    if (e.keyCode !== ENTER_KEY) {
	      return;
	    }
	    this.saveTodo(e);
	    this.resetEditing();
	    e.preventDefault();
	  },
	  handleNewTodoKeyDown: function handleNewTodoKeyDown(id, e) {
	    if (e.keyCode !== ENTER_KEY) {
	      return;
	    }
	    this.addTodo(e);
	    e.innerHTML = "";
	    //Svenjs.findDOMNode('new-todo');
	    document.getElementById(id).focus();
	    e.preventDefault();
	  },
	  onHashChange: function onHashChange() {
	    var url = self.history === true ? self.getPath() : window.location.hash.replace(/.*#\//, "");
	    this.resetEditing();
	    this.setState({ messages: this.state.messages, url: url });
	  },
	  saveTodo: function saveTodo(e) {
	    var val = "undefined" === typeof e.srcElement ? e.target.value : e.srcElement.value;
	    var messages = this.state.messages.filter(function (msg) {
	      if (msg.id === _currentEdit) msg.message = val;
	      return msg;
	    });
	    this.setState({ messages: messages, url: this.state.url });
	  },
	  addTodo: function addTodo(e) {
	    var messages = this.state.messages;
	    var lastId = undefined;
	    var val = "undefined" === typeof e.srcElement ? e.target.value : e.srcElement.value;
	    if (messages.length === 0) lastId = 1;else lastId = messages[messages.length - 1].id;
	    messages.push({ id: lastId + 1, message: val, complete: false, editing: false });
	    this.setState({ messages: messages, url: this.state.url });
	  },
	  destroyMessage: function destroyMessage(item) {
	    var messages = this.state.messages.filter(function (msg) {
	      return msg.id !== item.id;
	    });
	    this.setState({ messages: messages });
	  },
	  destroyCompleted: function destroyCompleted() {
	    var messages = this.state.messages.filter(function (msg) {
	      return msg.complete === false;
	    });
	    this.resetEditing();
	    this.setState({ messages: messages, url: this.state.url });
	  },
	  toggleOne: function toggleOne(item, e) {
	    var messages = this.state.messages.filter(function (msg) {
	      if (msg.id === item.id) msg.complete = !msg.complete;
	      return msg;
	    });
	    this.resetEditing();
	    this.setState({ messages: messages, url: this.state.url });
	  },
	  simpleResetEditing: function simpleResetEditing() {
	    var messages = this.state.messages.map(function (msg) {
	      msg.editing = false;
	      return msg;
	    });
	    _prevEditing = false;
	    this.setState({ messages: messages, url: this.state.url });
	  },
	  resetEditing: function resetEditing(e) {
	    var update = false;
	    var messages = this.state.messages.map(function (msg) {
	      if (msg.editing) update = true;
	      msg.editing = false;
	      return msg;
	    });
	    if (update) {
	      _prevEditing = true;
	      this.setState({ messages: messages, url: this.state.url });
	    } else {
	      _prevEditing = false;
	    }
	  },
	  onDoubleClick: function onDoubleClick(todo, e) {
	    _currentEdit = todo.id;
	    if (!todo.complete) {
	      var messages = this.state.messages.map(function (msg) {
	        msg.editing = msg.id === todo.id ? !msg.editing : false;
	        return msg;
	      });
	      this.setState({ messages: messages, url: this.state.url });
	      var node = document.getElementsByClassName("edit active")[0];
	      node.focus();
	      node.setSelectionRange(node.value.length, node.value.length);
	    }
	  },
	  toggleAll: function toggleAll() {
	    _toggled = !_toggled;
	    var messages = this.state.messages.map(function (msg) {
	      msg.complete = _toggled;
	      return msg;
	    });
	    this.resetEditing();
	    this.setState({ messages: messages });
	  },
	  listTodos: function listTodos() {

	    var shownTodos = this.state.messages.filter((function (todo) {
	      switch (this.state.url) {
	        case "active":
	          return !todo.complete;
	        case "completed":
	          return todo.complete;
	        default:
	          return true;
	      }
	    }).bind(this), this);

	    return shownTodos.map((function (todo) {
	      var label = todo.message;
	      var checked = false;
	      var className = "todo";
	      var editClassName = "edit";
	      if (todo.editing) {
	        className = "todo editing";
	        editClassName = "edit active";
	      }
	      if (todo.complete) {
	        label = { tag: "del", attrs: {}, children: [todo.message] };
	        checked = true;
	      }
	      return { tag: "li", attrs: { className: className }, children: [{ tag: "div", attrs: { className: "view" }, children: [{ tag: "input", attrs: { className: "toggle", type: "checkbox", checked: checked, onClick: this.toggleOne.bind(this, todo) } }, { tag: "label", attrs: { ondblclick: this.onDoubleClick.bind(this, todo) }, children: [label] }, { tag: "button", attrs: { className: "destroy", onClick: this.destroyMessage.bind(this, todo) } }] }, { tag: "input", attrs: { className: editClassName,
	            type: "text",
	            onKeyDown: this.handleEditTodoKeyDown.bind(this),
	            value: todo.message } }] };
	    }).bind(this));
	  },
	  render: function render() {
	    "use strict";
	    var state = this.state;
	    var selected_all = "",
	        selected_active = "",
	        selected_completed = "";
	    if (this.state.url === "" || this.state.url === "all") selected_all = "selected";
	    if (this.state.url === "active") selected_active = "selected";
	    if (this.state.url === "completed") selected_completed = "selected";

	    return { tag: "section", attrs: { "class": "todoapp" }, children: [{ tag: "header", attrs: { "class": "header" }, children: [{ tag: "h1", attrs: {}, children: ["todos"] }, { tag: "input", attrs: { className: "new-todo",
	            id: "new-todo",
	            onClick: this.resetEditing.bind(this),
	            onKeyDown: this.handleNewTodoKeyDown.bind(this, "new-todo"),
	            placeholder: "What needs to be done?", autofocus: true } }] }, { tag: "section", attrs: { className: "main" }, children: [{ tag: "input", attrs: { className: "toggle-all", type: "checkbox", onClick: this.toggleAll.bind(this) } }, { tag: "label", attrs: { "for": "toggle-all" }, children: ["Mark all as complete"] }, { tag: "ul", attrs: { className: "todo-list" }, children: [this.listTodos()] }] }, { tag: "footer", attrs: { "class": "footer" }, children: [{ tag: "span", attrs: { "class": "todo-count" }, children: [this.state.messages.length, this.state.messages.length === 1 ? " item" : " items", " remaining"] }, { tag: "ul", attrs: { "class": "filters" }, children: [{ tag: "li", attrs: {}, children: [{ tag: "a", attrs: { href: "#/all", "class": selected_all }, children: ["All"] }] }, { tag: "li", attrs: {}, children: [{ tag: "a", attrs: { href: "#/active", "class": selected_active }, children: ["Active"] }] }, { tag: "li", attrs: {}, children: [{ tag: "a", attrs: { href: "#/completed", "class": selected_completed }, children: ["Completed"] }] }] }, { tag: "button", attrs: { "class": "clear-completed", onClick: this.destroyCompleted.bind(this) }, children: ["Clear completed"] }] }] };
	  }

	});
	module.exports = todoMVCApp;

/***/ }
/******/ ])
});
;
