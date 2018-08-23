var Svenjs = (function (lifeCycle) {
  'use strict';

  lifeCycle = lifeCycle && lifeCycle.hasOwnProperty('default') ? lifeCycle['default'] : lifeCycle;

  /**
   * @module core/version
   * @see module:svenjs
   * @author Sven A Robbestad <sven@robbestad.com>
   */

  var version = require("root/../package.json").version;

  const deepCopy = function (o) {
    return JSON.parse(JSON.stringify(o));
  };

  const deepFreeze = exports.deepFreeze = function (o) {
    Object.freeze(o);

    Object.getOwnPropertyNames(o).forEach(function (prop) {
      if (o.hasOwnProperty(prop)
      && o[prop] !== null
      && (typeof o[prop] === "object" || typeof o[prop] === "function")
      && !Object.isFrozen(o[prop])) {
        deepFreeze(o[prop]);
      }
    });
    return o;
  };

  const saveState = (spec,diff_state)=> {
    const state = deepCopy(diff_state);
    deepFreeze(state);
    return state;
  };

  /**
   * render module.
   * @module core/render
   * @see module:svenjs
   * @author Sven A Robbestad <sven@robbestad.com>
   */

  // define common functions used in this mod ule
  // import {isFunction, isObject, isString, isArray} from '../lib/validations';

  const validations = require('../lib/validations');
  const {isFunction, isObject, isString, isArray} = validations;


  const appendChild = (child, parent) => {
  	return parent.appendChild(child);
  };

  // Speed up calls to hasOwnProperty
  var hasOwnProperty = Object.prototype.hasOwnProperty;

  //const voidElems = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;

  /**
   * setAttrs. This sets all attributes on the node tag, like class names, event handlers etc.
   * @param {tag} a tag structure (e.g {tag: "div", attrs: {class:"test"}, children: []})
   * @param {node} a DOM Node the children should be added to
   * @returns {Object} a DOM Node
   */
  const setAttrs = (tag, node) => {
  	if ((hasOwnProperty.call(tag, 'children'))) {
  		if (isArray(tag.children)) {
  			tag.children.forEach((childTag) => {
  				if (typeof childTag == "string" || typeof childTag == "number") {
  					node.appendChild(document.createTextNode(childTag));
  				}
  			});
  		}
  	}

  	if ((hasOwnProperty.call(tag, 'attrs'))) {
  		const attr = tag.attrs;
  		for (var attrName in attr) {
  			if (attrName === "config" || attrName === "key") continue;
  			if (attrName === "disabled" && attr[attrName] === false) continue;
  			else if (attrName == "class" || attrName == "className") node.className = attr[attrName].toString();
  			else if (isFunction(attr[attrName]) && attrName.slice(0, 2) == "on") {
  				node[attrName.toLowerCase()] = attr[attrName];
  			}
  			else if (attrName === "checked" && (attr[attrName] === false || attr[attrName] === "")) continue;
  			else {
  				try {
  					node.setAttribute('' + attrName, attr[attrName].toString());
  				} catch (e) {
  					console.error('e', e);
  				}
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
  const buildElement = (tag) => {
  	if ("undefined" === typeof tag.tag) {
  		tag.tag = "span";
  		tag.attrs = {"sjxid": Math.floor(Math.random() * new Date().getTime())};
  	}
  	let child = document.createElement(tag.tag);
  	setAttrs(tag, child);
  	return child;
  };

  /**
   * buildChildren
   * @param {tags} a tag structure (e.g {tag: "div", attrs: {class:"test"}, children: []})
   * @param {parent} a DOM Node the children should be added to
   * @returns {Object} a DOM Node
   */
  const buildChildren = (tags, parent) => {
  	let childNode;
  	if ((hasOwnProperty.call(tags, 'children'))) {
  		if (isArray(tags.children)) {
  			tags.children.forEach((tag, idx) => {
  				if (null !== tag && 'object' === typeof tag) {
  					childNode = buildElement(tag);
  					buildChildren(tag, childNode);
  					appendChild(childNode, parent);
  				}
  				if (isArray(tag)) {
  					var tagName = tag.tag;
  					tag.forEach((childtag, idx) => {
  						if (!(hasOwnProperty.call(childtag, 'render'))) {
  							childNode = buildElement(childtag);
  							buildChildren(childtag, childNode);
  							appendChild(childNode, parent);
  						}
  					});
  				}
  			});
  		}
  	} else {
  		// Components inside render
  		if ('object' === typeof tags) {
  			if ((hasOwnProperty.call(tags, 'render'))) {
  				buildChildren(tags.render(), parent);
  			}
  		}
  	}
  	return parent;
  };


  const renderToString = (tags, data) => {
  	return vDom(tags, data).innerHTML;
  };

  /**
   * vDom
   * @param {tags} a tag structure (e.g {tag: "div", attrs: {class:"test"}, children: []})
   * @returns {Object} a DOM Node
   */
  const vDom = (tags, data) => {
  	var docFragment = document.createDocumentFragment();

  	// Root node
  	var root = document.createElement(tags.tag);
  	setAttrs(tags, data.rootNode);

  	// Build children
  	let childrenTree = buildChildren(tags, root);
  	docFragment.appendChild(childrenTree);

  	return docFragment;
  };

  /**
   * Render
   * @alias svenjs.render
   * @param {spec} a svenjs component with a render method. Optional, set to false if not used
   * @param {node} a document node (e.g from document.getElementById()).
   * @param {tags} optional pre-rendered tags
   * @returns {undefined}
   */
  const render = (spec, node, preRendered = false) => {
  	console.log("node", node);
  	console.log("remder", spec.render());
  	if (node) {

  		if (isObject(spec)) {
  			// Set internal ref
  			if (!(hasOwnProperty.call(spec, '_svenjs'))) {
  				spec._svenjs = {rootNode: false};
  			}
  			spec._svenjs.rootNode = node;
  		}

  		// reset HTML
  		node.innerHTML = "";
  		// Get the converted tags
  		let tags;

  		if (isObject(preRendered)) {
  			tags = preRendered;
  		} else {
  			tags = spec.render();
  		}
  		console.log(tags);

  		// Append to window
  		node.appendChild(vDom(tags, spec._svenjs));
  		console.log(node);
  	} else {
  		return 'Error: No node to attach';
  	}
  };

  const lifeCycle$1 = (spec) => {
  	let rootNode;
  	if (spec._svenjs.rootNode) {
  		rootNode = spec._svenjs.rootNode;
  	}
  	if (spec.hasOwnProperty("attrs")  && spec.attrs.hasOwnProperty("sjxid")) {
  		if (!rootNode) rootNode = document.querySelector("[sjxid='" + spec.attrs.sjxid + "']");
  	}

  	if (spec.isMounted) {
  		render(spec, rootNode);
  		if (spec.hasOwnProperty('_didUpdate')) spec._didUpdate.apply(spec);
  	}
  };

  const setState = (state, spec)=> {
  	spec.state = saveState(spec, state);
  	lifeCycle$1(spec);
  };

  /**
   * @module core/create
   * @see module:svenjs
   * @author Sven A Robbestad <sven@robbestad.com>
   */

  const uuid = () => {
  	const s = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  	return `${s() + s()}`;
  };

  const deepClone = obj => {
  	if (!obj || typeof obj !== 'object') {
  		return obj;
  	}
  	let newObj = {};
  	if (Array.isArray(obj)) {
  		newObj = obj.map(item => deepClone(item));
  	} else {
  		Object.keys(obj).forEach((key) => {
  			return newObj[key] = deepClone(obj[key]);
  		});
  	}
  	return newObj;
  };

  const create = (_spec, props) => {
  	const spec = deepClone(_spec);
  	spec._svenjs = {rootNode: false};
  	spec.isBound = false;
  	spec.isMounted = false;
  	spec.props = {};

  	if (props) {
  		spec._jsxid = spec.props.sjxid;
  		spec.props = props;
  		setTimeout(() => lifeCycle(spec), 0);
  		delete spec.props.sjxid;
  	}
  	if (!spec.hasOwnProperty("attrs")) {
  		if (!spec.hasOwnProperty("attrs")) {
  			spec.attrs = {sjxid: uuid()};
  		}
  	}
  	if (!spec.isBound) {
  		spec.version = version;
  		spec.isBound = true;
  		spec.setState = function (state) {
  			return setState(state, this);
  		};
  		if ("function" === typeof spec._beforeMount) {
  			spec._beforeMount.apply(spec);
  		}
  	}
  	if (!spec.isMounted) {
  		spec.isMounted = true;

  		if (undefined !== spec.initialState) {
  			spec.state = spec.initialState;
  		}
  		if ("function" === typeof spec._didMount) {
  			spec._didMount.apply(spec);
  			if ("function" === typeof lifeCycle)
  				setTimeout(() => lifeCycle(spec), 100);
  		}
  	}
  	return spec;
  };

  let _callbacks=[];
  const createStore = (spec)=> {
    if(!spec.isMounted){
      spec.listenTo=function(cb){
        _callbacks.push(cb);
      };
      spec.emit=(data)=>{
        _callbacks.forEach((cb)=>{
          cb(data);
        });
      };

      if("function" === typeof spec.init){
        spec.init.apply(spec);
      }
    }
    return spec;
  };

  console.log(`running svenjs version ${version}`);

  const Svenjs = {
  	version,
  	create,
  	setState,
  	createStore,
  	render,
  	renderToString,
  	lifeCycle: lifeCycle$1
  };
  // if (typeof module === "object" && module != null && module.exports) module.exports = Svenjs;
  // else if (typeof define === "function" && define.amd) define(function () {
  // 	return Svenjs
  // });

  return Svenjs;

}(lifeCycle));
