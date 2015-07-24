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

				var __WEBPACK_AMD_DEFINE_RESULT__; /* WEBPACK VAR INJECTION */(function (module) {
					'use strict';

					var _componentVersion = __webpack_require__(9);

					var _componentUpdateUi = __webpack_require__(2);

					var _componentSaveState = __webpack_require__(4);

					var _componentTimeTravel = __webpack_require__(8);

					var _componentSetState = __webpack_require__(5);

					var _componentCreateComponent = __webpack_require__(6);

					var _componentLifeCycle = __webpack_require__(1);

					var _componentRender = __webpack_require__(7);

					var _storeCreateStore = __webpack_require__(10);

					var _libDeepCopy = __webpack_require__(3);

					var Svenjs = {
						version: _componentVersion.version,
						updateUI: _componentUpdateUi.updateUI,
						setState: _componentSetState.setState,
						createStore: _storeCreateStore.createStore,
						createComponent: _componentCreateComponent.createComponent,
						render: _componentRender.render,
						lifeCycle: _componentLifeCycle.lifeCycle,
						timeTravel: _componentTimeTravel.timeTravel,
						saveState: _componentSaveState.saveState,
						deepCopy: _libDeepCopy.deepCopy
					};

					if (typeof module === 'object' && module != null && module.exports) module.exports = Svenjs;else if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
						return Svenjs;
					}).call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
					/* WEBPACK VAR INJECTION */
				}).call(exports, __webpack_require__(11)(module));

				/***/
			},
			/* 1 */
			/***/function (module, exports) {

				'use strict';

				exports.lifeCycle = function (spec) {
					if (spec.isMounted) {
						spec.componentDidUpdate.apply(spec);
					}
				};

				/***/
			},
			/* 2 */
			/***/function (module, exports) {

				'use strict';

				exports.updateUI = function (spec, html, time) {};

				/*let rootNode = spec._svenjs.rootNode;
	   time = time || spec.time;
	   html = html || spec.render(spec.state)
	   if (JSON.stringify(rootNode.innerHTML) === JSON.stringify(html)) {
	     return;
	   }
	   rootNode.innerHTML = "";
	   if (typeof html === "string") {
	     rootNode.appendChild(
	       document.createRange().createContextualFragment(html)
	     );
	   } else {
	     rootNode.appendChild(html);
	   }
	   */

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

				var _updateUi = __webpack_require__(2);

				var _saveState = __webpack_require__(4);

				var _lifeCycle = __webpack_require__(1);

				exports.setState = function (state, spec) {
					_saveState.saveState(spec.time, state);
					spec.render(state);
					//	updateUI(spec, spec.render(state));
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
			/***/function (module, exports) {

				'use strict';

				var appendChild = function appendChild(child, parent) {
					return parent.appendChild(child);
				};

				var setAttrs = function setAttrs(tag, node) {
					//	console.log(tag.children[0]);
					if (tag.hasOwnProperty('children') && typeof tag.children[0] == 'string') {
						var innerText = document.createTextNode(tag.children[0]);
						node.appendChild(innerText);
					}
					if (tag.hasOwnProperty('children')) {}
					if (tag.hasOwnProperty('attrs')) {

						if (tag.attrs.hasOwnProperty('id')) {
							node.id = 'row';
						}
						if (tag.attrs.hasOwnProperty('onClick')) {
							node.onclick = tag.attrs.onClick;
						}
					}
					return node;
				};

				var addChildren = function addChildren(tags, parent) {
					if (typeof tags.children != 'object') {
						return false;
					}
					/*
	    	var parent = document.createElement(tags.tag);
	    	setAttrs(tags,parent);
	    	appendChild(parent,root);
	    */
					tags.children.forEach(function (tag) {
						var child = document.createElement(tag.tag);
						appendChild(setAttrs(tag, child), parent);
						if (tag.children != null && typeof tag.children == 'object') {
							var childrenTags = tag.children;
							childrenTags.forEach(function (childTag) {
								var childnode = document.createElement(childTag.tag);
								setAttrs(childTag, childnode);
								//setAttrs(childnode,child);
								appendChild(childnode, child);
							});
						}
					});

					return parent;
				};

				exports.render = function (spec, node) {
					spec._svenjs.rootNode = node;

					var tags = spec.render();

					var docFragment = document.createDocumentFragment();

					// Root node 
					var root = document.createElement(tags.tag);
					if (tags.attrs.hasOwnProperty('id')) {
						root.id = tags.attrs.id;
					}

					//docFragment.appendChild(root);

					// Build children
					var childrenTree = addChildren(tags, root);
					console.log(childrenTree);
					// Append to root node
					root.appendChild(childrenTree);

					// Append to window
					node.appendChild(docFragment);
				};

				/*
	   	    	if(null != tags.children[0] && typeof tags.children[0] == "string"){
	       		let innerText=document.createTextNode(tags.children[0]);
	   			div.appendChild(innerText);
	       	}
	   			if(tags.attrs.hasOwnProperty('id')){
	   			div.id = "row";	
	   		}
	   		if(tags.attrs.hasOwnProperty('onClick')){
	   			div.onclick = tags.attrs.onClick;	
	   		}
	   			//appendChild(div,root);
	   			if(tag.children != null && typeof tag.children == "object"){
	       		const childrenTags=tag.children;
	   	    	childrenTags.forEach((childTag)=>{
	   	    		addChildren(childTag,div);
	   	    	})
	       	}
	   		*/

				//console.log(tag.children);

				/***/
			},
			/* 8 */
			/***/function (module, exports, __webpack_require__) {

				'use strict';

				var _libDeepCopy = __webpack_require__(3);

				var _updateUi = __webpack_require__(2);

				var _lifeCycle = __webpack_require__(1);

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
			},
			/* 11 */
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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _store = __webpack_require__(4);

	var _store2 = _interopRequireDefault(_store);

	var Svenjs = __webpack_require__(1);

	var timeTravel = Svenjs.createComponent({
	    displayName: 'First app',
	    initialState: {
	        items: [],
	        message: ''
	    },
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
	        console.log('handleClick');
	        var state = this.state;
	        var time = this.time;
	        var self = this;
	        state.items.push(this.getNextString());
	        state.message = 'BOB' + (1 + Math.floor(Math.random() * 100)) + '!';
	        this.setState(state);
	    },
	    goBack: function goBack() {
	        Svenjs.timeTravel(this, -1);
	    },
	    goForward: function goForward() {
	        Svenjs.timeTravel(this, 1);
	    },
	    getNextString: function getNextString() {
	        'use strict';
	        var words = 'The quick brown fox jumps over the lazy dog'.split(' ');
	        return words[Math.floor(Math.random() * words.length)];
	    },
	    render: function render() {
	        'use strict';

	        var state = this.state;
	        var time = this.time;
	        var backDisabled = true;
	        var nextDisabled = true;

	        return { tag: 'div', attrs: { id: 'row' }, children: [{ tag: 'div', attrs: { id: 'app' }, children: [{ tag: 'h3', attrs: {}, children: [state.message || 'Svenjs App'] }, { tag: 'button', attrs: { onClick: this.handleClick.bind(this) }, children: ['Add word'] }, { tag: 'div', attrs: { id: 'ui' } }, { tag: 'small', attrs: {}, children: ['(click word to delete)'] }] }, { tag: 'div', attrs: { id: 'time-travel' }, children: [{ tag: 'h3', attrs: {}, children: ['Time travel'] }, { tag: 'button', attrs: { disabled: backDisabled, onClick: this.goBack.bind(this) }, children: ['Back'] }, { tag: 'button', attrs: { disabled: nextDisabled, onClick: this.goForward.bind(this) }, children: ['Next'] }, { tag: 'p', attrs: { id: 'time-pos' } }] }] };
	    },

	    __render: function __render() {
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