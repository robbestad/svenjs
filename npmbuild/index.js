!function(t){function e(o){if(n[o])return n[o].exports;var r=n[o]={exports:{},id:o,loaded:!1};return t[o].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){t.exports=n(6)},function(t,e,n){"use strict";var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r="function"==typeof Symbol&&"symbol"===o(Symbol.iterator)?function(t){return"undefined"==typeof t?"undefined":o(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":"undefined"==typeof t?"undefined":o(t)},i=n(9),u=i.isFunction,c=i.isObject,f=(i.isString,i.isArray),s=function(t,e){return e.appendChild(t)},a=Object.prototype.hasOwnProperty,l=function(t,e){if(a.call(t,"children")&&f(t.children)&&t.children.forEach(function(t){"string"!=typeof t&&"number"!=typeof t||e.appendChild(document.createTextNode(t))}),a.call(t,"attrs")){var n=t.attrs;for(var o in n)if("config"!==o&&"key"!==o&&("disabled"!==o||n[o]!==!1))if("class"==o||"className"==o)e.className=n[o].toString();else if(u(n[o])&&"on"==o.slice(0,2))e[o.toLowerCase()]=n[o];else{if("checked"===o&&(n[o]===!1||""===n[o]))continue;try{e.setAttribute(""+o,n[o].toString())}catch(r){}}}return e},d=function(t){"undefined"==typeof t.tag&&(t.tag="span",t.attrs={sjxid:Math.floor(Math.random()*(new Date).getTime())});var e=document.createElement(t.tag);return l(t,e),e},y=function b(t,e){var n=void 0;return a.call(t,"children")?f(t.children)&&t.children.forEach(function(t,o){if(null!==t&&"object"===("undefined"==typeof t?"undefined":r(t))&&(n=d(t),b(t,n),s(n,e)),f(t)){t.tag;t.forEach(function(t,o){a.call(t,"render")||(n=d(t),b(t,n),s(n,e))})}}):"object"===("undefined"==typeof t?"undefined":r(t))&&a.call(t,"render")&&b(t.render(),e),e};e.renderToString=function(t,e){return p(t,e).innerHTML};var p=function(t,e){var n=document.createDocumentFragment(),o=document.createElement(t.tag);l(t,e.rootNode);var r=y(t,o);return n.appendChild(r),n},m=function(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(!e)return"Error: No node to attach";c(t)&&(a.call(t,"_svenjs")||(t._svenjs={rootNode:!1}),t._svenjs.rootNode=e),e.innerHTML="";var o=void 0;o=c(n)?n:t.render(),e.appendChild(p(o,t._svenjs))};e.render=m},function(t,e,n){(function(t){"use strict";e.version=function(){return t.env.npm_package_version}}).call(e,n(12))},function(t,e,n){"use strict";var o=n(1);e.lifeCycle=function(t){var e=void 0;t._svenjs.rootNode&&(e=t._svenjs.rootNode),e||(e=document.querySelector("[sjxid='"+t.attrs.sjxid+"']")),t.isMounted&&((0,o.render)(t,e),t.hasOwnProperty("_didUpdate")&&t._didUpdate.apply(t))}},function(t,e,n){"use strict";var o=n(11),r=n(3);e.setState=function(t,e){e.state=(0,o.saveState)(e,t),(0,r.lifeCycle)(e)}},function(t,e,n){"use strict";var o=n(2),r=n(4);e.create=function(t,e){return t._svenjs={rootNode:!1},t.props={},e&&(t._jsxid=t.props.sjxid,t.props=e,delete t.props.sjxid),t.isBound||(t.version=o.version,t.isBound=!0,t.setState=function(t){return(0,r.setState)(t,this)},"function"==typeof t._beforeMount&&t._beforeMount.apply(t)),t.isMounted||(t.time={history:[],pos:-1},t.isMounted=!0,void 0!==t.initialState&&(t.state=t.initialState),"function"==typeof t._didMount&&t._didMount.apply(t)),t}},function(t,e,n){var o;(function(t){"use strict";var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i="function"==typeof Symbol&&"symbol"===r(Symbol.iterator)?function(t){return"undefined"==typeof t?"undefined":r(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":"undefined"==typeof t?"undefined":r(t)},u=n(2),c=n(5),f=n(1),s=n(4),a=n(3),l=n(10),d={version:u.version,create:c.create,setState:s.setState,createStore:l.createStore,render:f.render,renderToString:f.renderToString,lifeCycle:a.lifeCycle};"object"===i(t)&&null!=t&&t.exports?t.exports=d:(o=function(){return d}.call(e,n,e,t),!(void 0!==o&&(t.exports=o)))}).call(e,n(13)(t))},function(t,e){"use strict";e.deepCopy=function(t){return JSON.parse(JSON.stringify(t))}},function(t,e){"use strict";var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o="function"==typeof Symbol&&"symbol"===n(Symbol.iterator)?function(t){return"undefined"==typeof t?"undefined":n(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":"undefined"==typeof t?"undefined":n(t)},r=e.deepFreeze=function(t){return Object.freeze(t),Object.getOwnPropertyNames(t).forEach(function(e){!t.hasOwnProperty(e)||null===t[e]||"object"!==o(t[e])&&"function"!=typeof t[e]||Object.isFrozen(t[e])||r(t[e])}),t}},function(t,e){"use strict";var n={}.toString;e.isFunction=function(t){return"function"==typeof t},e.isObject=function(t){return"[object Object]"===n.call(t)},e.isString=function(t){return"[object String]"===n.call(t)},e.isArray=function(t){return"[object Array]"===n.call(t)},e.isDefined=function(t){return"undefined"!==n.call(t)}},function(t,e){"use strict";var n=[];e.createStore=function(t){return t.isMounted||(t.listenTo=function(t){n.push(t)},t.emit=function(t){n.forEach(function(e){e(t)})},"function"==typeof t.init&&t.init.apply(t)),t}},function(t,e,n){"use strict";var o=n(7),r=n(8);e.saveState=function(t,e){var n=(0,o.deepCopy)(e);return(0,r.deepFreeze)(n),n}},function(t,e){function n(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function r(t){if(a===setTimeout)return setTimeout(t,0);if((a===n||!a)&&setTimeout)return a=setTimeout,setTimeout(t,0);try{return a(t,0)}catch(e){try{return a.call(null,t,0)}catch(e){return a.call(this,t,0)}}}function i(t){if(l===clearTimeout)return clearTimeout(t);if((l===o||!l)&&clearTimeout)return l=clearTimeout,clearTimeout(t);try{return l(t)}catch(e){try{return l.call(null,t)}catch(e){return l.call(this,t)}}}function u(){m&&y&&(m=!1,y.length?p=y.concat(p):b=-1,p.length&&c())}function c(){if(!m){var t=r(u);m=!0;for(var e=p.length;e;){for(y=p,p=[];++b<e;)y&&y[b].run();b=-1,e=p.length}y=null,m=!1,i(t)}}function f(t,e){this.fun=t,this.array=e}function s(){}var a,l,d=t.exports={};!function(){try{a="function"==typeof setTimeout?setTimeout:n}catch(t){a=n}try{l="function"==typeof clearTimeout?clearTimeout:o}catch(t){l=o}}();var y,p=[],m=!1,b=-1;d.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];p.push(new f(t,e)),1!==p.length||m||r(c)},f.prototype.run=function(){this.fun.apply(null,this.array)},d.title="browser",d.browser=!0,d.env={},d.argv=[],d.version="",d.versions={},d.on=s,d.addListener=s,d.once=s,d.off=s,d.removeListener=s,d.removeAllListeners=s,d.emit=s,d.binding=function(t){throw new Error("process.binding is not supported")},d.cwd=function(){return"/"},d.chdir=function(t){throw new Error("process.chdir is not supported")},d.umask=function(){return 0}},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children=[],t.webpackPolyfill=1),t}}]);
//# sourceMappingURL=index.js.map