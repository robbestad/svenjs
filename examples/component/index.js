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
	var First = __webpack_require__(2);
	var rootNode = document.getElementById('ui');
	Svenjs.render(First, rootNode);
	//const Second = require("./app2");
	//Svenjs.render(
	//  Second,
	//  document.getElementById('myapp')
	//);

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

				/***/
			},
			/* 1 */
			/***/function (module, exports) {

				'use strict';

				exports.updateUI = function (spec, html, time) {
					var rootNode = spec._svenjs.rootNode;
					time = time || spec.time;
					html = html || spec.render(spec.state);
					if (JSON.stringify(rootNode.innerHTML) === JSON.stringify(html)) {
						return;
					}
					rootNode.innerHTML = '';
					if (typeof html === 'string') {
						rootNode.appendChild(document.createRange().createContextualFragment(html));
					} else {
						rootNode.appendChild(html);
					}
				};

				/***/
			},
			/* 2 */
			/***/function (module, exports) {

				'use strict';

				exports.lifeCycle = function (spec) {
					if (spec.isMounted) {
						spec.componentDidUpdate.apply(spec);
					}
				};

				/***/
			},
			/* 3 */
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
			/* 4 */
			/***/function (module, exports, __webpack_require__) {

				'use strict';

				var _libDeepCopy = __webpack_require__(3);

				exports.saveState = function (time, state) {
					time = time || { history: [], pos: -1 };
					time.history.splice(time.pos + 1);
					time.history.push(_libDeepCopy.deepCopy(state));
					time.pos++;
				};

				/***/
			},
			/* 5 */
			/***/function (module, exports, __webpack_require__) {

				'use strict';

				var _updateUi = __webpack_require__(1);

				var _saveState = __webpack_require__(4);

				var _lifeCycle = __webpack_require__(2);

				exports.setState = function (state, spec) {
					_saveState.saveState(spec.time, state);
					_updateUi.updateUI(spec, spec.render(state));
					_lifeCycle.lifeCycle(spec);
				};

				/***/
			},
			/* 6 */
			/***/function (module, exports, __webpack_require__) {

				'use strict';

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

				var _updateUi = __webpack_require__(1);

				exports.render = function (spec, rootNode) {
					spec._svenjs.rootNode = rootNode;
					_updateUi.updateUI(spec);
				};

				/***/
			},
			/* 8 */
			/***/function (module, exports, __webpack_require__) {

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

				/***/
			},
			/* 9 */
			/***/function (module, exports) {

				'use strict';

				exports.version = function () {
					return '0.0.2-alpha';
				};

				/***/
			},
			/* 10 */
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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _store = __webpack_require__(4);

	var _store2 = _interopRequireDefault(_store);

	var Svenjs = __webpack_require__(1);

	var timeTravel = Svenjs.createComponent({
	  displayName: 'First app',
	  initialState: { items: [], message: '' },
	  componentDidMount: function componentDidMount() {
	    'use strict';
	    _store2['default'].listenTo(this.onEmit);
	  },

	  componentDidUpdate: function componentDidUpdate() {
	    'use strict';
	  },
	  onEmit: function onEmit(data) {
	    console.log('data from store received!');
	    console.log(data);
	  },
	  handleClick: function handleClick(idx) {
	    'use strict';
	    this.state.items.splice(idx, 1);
	    this.state.message = 'Spliced!';
	    this.setState(this.state);
	  },
	  getNextString: function getNextString() {
	    'use strict';
	    var words = 'The quick brown fox jumps over the lazy dog'.split(' ');
	    return words[Math.floor(Math.random() * words.length)];
	  },

	  render: function render() {
	    'use strict';

	    var _this = this;

	    var state = this.state;
	    var time = this.time;
	    var docFragment = document.createDocumentFragment();
	    var rowDiv = document.createElement('div');
	    rowDiv.id = 'row';
	    docFragment.appendChild(rowDiv);
	    var app = document.createElement('div');
	    app.id = 'app';
	    rowDiv.appendChild(app);
	    var h3 = document.createElement('h3');
	    var h3Text = document.createTextNode(this.state.message || 'Sample App');
	    h3.appendChild(h3Text);
	    app.appendChild(h3);
	    var button = document.createElement('button');
	    var buttonText = document.createTextNode('Add Word');
	    button.id = 'add';
	    button.onclick = function () {
	      'use strict';
	      state.items.push(_this.getNextString());
	      _this.setState(state);
	    };
	    button.appendChild(buttonText);
	    app.appendChild(button);
	    var smallSpan = document.createElement('small');
	    smallSpan.textContent = '(click word to delete)';
	    //setInterval(()=>{smallSpan.textContent=Math.random()*50},50)
	    app.appendChild(smallSpan);
	    var wordSpan = document.createElement('span');
	    wordSpan.id = 'count';
	    wordSpan.textContent = 'Words: ' + state.items.length;
	    app.appendChild(wordSpan);
	    var ul = document.createElement('ul');
	    state.items.forEach(function (item, idx) {
	      var li = document.createElement('li');
	      var textContent = document.createTextNode(item);
	      li.appendChild(textContent);
	      li.onclick = function () {
	        _this.handleClick(idx);
	      };
	      ul.appendChild(li);
	    });
	    app.appendChild(ul);
	    var timeTravelDiv = document.createElement('div');
	    timeTravelDiv.id = 'time-travel';
	    rowDiv.appendChild(timeTravelDiv);
	    var ttH3 = document.createElement('h3');
	    var ttH3Text = document.createTextNode('Time Travel');
	    ttH3.appendChild(ttH3Text);
	    timeTravelDiv.appendChild(ttH3);
	    button = document.createElement('button');
	    buttonText = document.createTextNode('Back');
	    button.id = 'back';
	    button.disabled = time.pos <= 0;
	    button.onclick = function () {
	      'use strict';
	      Svenjs.timeTravel(_this, -1);
	    };

	    button.appendChild(buttonText);
	    timeTravelDiv.appendChild(button);
	    button = document.createElement('button');
	    buttonText = document.createTextNode('Next');
	    button.id = 'next';
	    button.disabled = time.pos >= time.history.length - 1;
	    button.onclick = function () {
	      'use strict';
	      Svenjs.timeTravel(_this, 1);
	    };
	    button.appendChild(buttonText);
	    timeTravelDiv.appendChild(button);
	    var ttP = document.createElement('p');
	    ttP.id = 'time-pos';
	    ttP.textContent = 'Position ' + (time.pos + 1) + ' of ' + time.history.length;
	    timeTravelDiv.appendChild(ttP);
	    return docFragment;
	  }
	});
	module.exports = timeTravel;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	exports.getJSON = function (url) {
	  'use strict';
	  return new Promise(function (resolve, reject) {
	    var xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function () {
	      if (xhr.readyState === 4) {
	        if (xhr.status === 200) {
	          resolve(JSON.parse(xhr.responseText));
	        } else {
	          reject(xhr.responseText);
	        }
	      }
	    };
	    xhr.open('GET', url);
	    xhr.send();
	  });
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _getJson = __webpack_require__(3);

	var Svenjs = __webpack_require__(1);

	var _data = '_content+emitted_';

	module.exports = Svenjs.createStore({
		init: function init() {
			var self = this;
			_getJson.getJSON('http://www.reddit.com/r/javascript/.json').then(function (data) {
				self.emit(data);
			})['catch'](console.log.bind(console));

			//.catch((reason) =>{
			//	console.log('oh no, this happened:'+reason);
			//});
			/*
	  setInterval(()=>{
	  	_data = Math.random()*1000;
	  	this.emit(_data);
	  },10e3);
	  */
		}
	});

/***/ }
/******/ ])
});
;