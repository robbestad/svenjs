import {
    updateUI
}
from './update-ui';
//import {jsx} from './jsx';


var nodeCache = [],
    cellCache = {};
var html;
var documentNode = {
    appendChild: function(node) {
        if (html === undefined) html = $document.createElement("html");
        if ($document.documentElement && $document.documentElement !== node) {
            $document.replaceChild(node, $document.documentElement);
        } else $document.appendChild(node);
        this.childNodes = $document.childNodes;
    },
    insertBefore: function(node) {
        this.appendChild(node);
    },
    childNodes: []
};
var configs = [];
// caching commonly used variables
var $document, $location, $requestAnimationFrame, $cancelAnimationFrame;
// self invoking function needed because of the way mocks work
const init = () => {
    $document = document;
    $location = window.location;
    $cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;
    $requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;
}();

function injectTextNode(parentElement, first, index, data) {
    try {
        insertNode(parentElement, first, index);
        first.nodeValue = data;
    } catch (e) {} //IE erroneously throws error when appending an empty text node after a null
}

function clear(nodes, cached) {
    for (var i = nodes.length - 1; i > -1; i--) {
        if (nodes[i] && nodes[i].parentNode) {
            try {
                nodes[i].parentNode.removeChild(nodes[i]);
            } catch (e) {} //ignore if this fails due to order of events (see http://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node)
            cached = [].concat(cached);
            if (cached[i]) unload(cached[i]);
        }
    }
    //release memory if nodes is an array. This check should fail if nodes is a NodeList (see loop above)
    if (nodes.length) nodes.length = 0;
}

function autoredraw(callback, object) {
    return function(e) {
        e = e || event;
        m.redraw.strategy("diff");
        m.startComputation();
        try {
            return callback.call(object, e);
        } finally {
            endFirstComputation();
        }
    };
}

function flatten(list) {
    //recursively flatten array
    for (var i = 0; i < list.length; i++) {
        if (isArray(list[i])) {
            list = list.concat.apply([], list);
            //check current index again and flatten until there are no more nested arrays at that index
            i--;
        }
    }
    return list;
}

function insertNode(parentElement, node, index) {
    parentElement.insertBefore(node, parentElement.childNodes[index] || null);
}

var DELETION = 1,
    INSERTION = 2,
    MOVE = 3;

function handleKeysDiffer(data, existing, cached, parentElement) {
    forKeys(data, function(key, i) {
        existing[key = key.key] = existing[key] ? {
            action: MOVE,
            index: i,
            from: existing[key].index,
            element: cached.nodes[existing[key].index] || $document.createElement("div")
        } : {
            action: INSERTION,
            index: i
        };
    });
    var actions = [];
    for (var prop in existing) actions.push(existing[prop]);
    var changes = actions.sort(sortChanges),
        newCached = new Array(cached.length);
    newCached.nodes = cached.nodes.slice();

    forEach(changes, function(change) {
        var index = change.index;
        if (change.action === DELETION) {
            clear(cached[index].nodes, cached[index]);
            newCached.splice(index, 1);
        }
        if (change.action === INSERTION) {
            var dummy = $document.createElement("div");
            dummy.key = data[index].attrs.key;
            insertNode(parentElement, dummy, index);
            newCached.splice(index, 0, {
                attrs: {
                    key: data[index].attrs.key
                },
                nodes: [dummy]
            });
            newCached.nodes[index] = dummy;
        }

        if (change.action === MOVE) {
            var changeElement = change.element;
            var maybeChanged = parentElement.childNodes[index];
            if (maybeChanged !== changeElement && changeElement !== null) {
                parentElement.insertBefore(changeElement, maybeChanged || null);
            }
            newCached[index] = cached[change.from];
            newCached.nodes[index] = changeElement;
        }
    });

    return newCached;
}

function diffKeys(data, cached, existing, parentElement) {
    var keysDiffer = data.length !== cached.length;
    if (!keysDiffer) {
        forKeys(data, function(attrs, i) {
            var cachedCell = cached[i];
            return keysDiffer = cachedCell && cachedCell.attrs && cachedCell.attrs.key !== attrs.key;
        });
    }

    return keysDiffer ? handleKeysDiffer(data, existing, cached, parentElement) : cached;
}

function diffArray(data, cached, nodes) {
    //diff the array itself

    //update the list of DOM nodes by collecting the nodes from each item
    forEach(data, function(_, i) {
        if (cached[i] != null) nodes.push.apply(nodes, cached[i].nodes);
    })
    //remove items from the end of the array if the new array is shorter than the old one. if errors ever happen here, the issue is most likely
    //a bug in the construction of the `cached` data structure somewhere earlier in the program
    forEach(cached.nodes, function(node, i) {
        if (node.parentNode != null && nodes.indexOf(node) < 0) clear([node], [cached[i]]);
    })
    if (data.length < cached.length) cached.length = data.length;
    cached.nodes = nodes;
}

function buildArrayKeys(data) {
    var guid = 0;
    forKeys(data, function() {
        forEach(data, function(attrs) {
            if ((attrs = attrs && attrs.attrs) && attrs.key == null) attrs.key = "__svenjs__" + guid++;
        })
        return 1;
    });
}

function buildArray(data, cached, parentElement, index, parentTag, shouldReattach, editable, namespace, configs) {
    data = flatten(data);
    var nodes = [],
        intact = cached.length === data.length,
        subArrayCount = 0;

    //keys algorithm: sort elements without recreating them if keys are present
    //1) create a map of all existing keys, and mark all for deletion
    //2) add new keys to map and mark them for addition
    //3) if key exists in new list, change action from deletion to a move
    //4) for each key, handle its corresponding action as marked in previous steps
    var existing = {},
        shouldMaintainIdentities = false;
    forKeys(cached, function(attrs, i) {
        shouldMaintainIdentities = true;
        existing[cached[i].attrs.key] = {
            action: DELETION,
            index: i
        };
    });

    buildArrayKeys(data);
    if (shouldMaintainIdentities) cached = diffKeys(data, cached, existing, parentElement);
    //end key algorithm

    var cacheCount = 0;
    //faster explicitly written
    for (var i = 0, len = data.length; i < len; i++) {
        //diff each item in the array
        var item = build(parentElement, parentTag, cached, index, data[i], cached[cacheCount], shouldReattach, index + subArrayCount || subArrayCount, editable, namespace, configs);

        if (item !== undefined) {
            intact = intact && item.nodes.intact;
            subArrayCount += getSubArrayCount(item);
            cached[cacheCount++] = item;
        }
    }

    if (!intact) diffArray(data, cached, nodes);
    return cached
}

function build(parentElement, parentTag, parentCache, parentIndex, data, cached, shouldReattach, index, editable, namespace, configs) {
    //`build` is a recursive function that manages creation/diffing/removal
    //of DOM elements based on comparison between `data` and `cached`
    //the diff algorithm can be summarized as this:
    //1 - compare `data` and `cached`
    //2 - if they are different, copy `data` to `cached` and update the DOM
    //    based on what the difference is
    //3 - recursively apply this algorithm for every array and for the
    //    children of every virtual element

    //the `cached` data structure is essentially the same as the previous
    //redraw's `data` data structure, with a few additions:
    //- `cached` always has a property called `nodes`, which is a list of
    //   DOM elements that correspond to the data represented by the
    //   respective virtual element
    //- in order to support attaching `nodes` as a property of `cached`,
    //   `cached` is *always* a non-primitive object, i.e. if the data was
    //   a string, then cached is a String instance. If data was `null` or
    //   `undefined`, cached is `new String("")`
    //- `cached also has a `configContext` property, which is the state
    //   storage object exposed by config(element, isInitialized, context)
    //- when `cached` is an Object, it represents a virtual element; when
    //   it's an Array, it represents a list of elements; when it's a
    //   String, Number or Boolean, it represents a text node

    //`parentElement` is a DOM element used for W3C DOM API calls
    //`parentTag` is only used for handling a corner case for textarea
    //values
    //`parentCache` is used to remove nodes in some multi-node cases
    //`parentIndex` and `index` are used to figure out the offset of nodes.
    //They're artifacts from before arrays started being flattened and are
    //likely refactorable
    //`data` and `cached` are, respectively, the new and old nodes being
    //diffed
    //`shouldReattach` is a flag indicating whether a parent node was
    //recreated (if so, and if this node is reused, then this node must
    //reattach itself to the new parent)
    //`editable` is a flag that indicates whether an ancestor is
    //contenteditable
    //`namespace` indicates the closest HTML namespace as it cascades down
    //from an ancestor
    //`configs` is a list of config functions to run after the topmost
    //`build` call finishes running

    //there's logic that relies on the assumption that null and undefined
    //data are equivalent to empty strings
    //- this prevents lifecycle surprises from procedural helpers that mix
    //  implicit and explicit return statements (e.g.
    //  function foo() {if (cond) return m("div")}
    //- it simplifies diffing code
    data = dataToString(data);
    if (data.subtree === "retain") return cached;
    cached = makeCache(data, cached, index, parentIndex, parentCache);
    return isArray(data) ? buildArray(data, cached, parentElement, index, parentTag, shouldReattach, editable, namespace, configs) :
        data != null && isObject(data) ? buildObject(data, cached, editable, parentElement, index, shouldReattach, namespace, configs) :
        !isFunction(data) ? handleText(cached, data, index, parentElement, shouldReattach, editable, parentTag) :
        cached;
}

function sortChanges(a, b) {
    return a.action - b.action || a.index - b.index;
}

function setAttributes(node, tag, dataAttrs, cachedAttrs, namespace) {
    for (var attrName in dataAttrs) {
        var dataAttr = dataAttrs[attrName];
        var cachedAttr = cachedAttrs[attrName];
        if (!(attrName in cachedAttrs) || (cachedAttr !== dataAttr)) {
            cachedAttrs[attrName] = dataAttr;
            try {
                //if (attrName === "onClick") node.setAttribute(attrName, dataAttr);
                //if (attrName === "onClick") node.setAttribute(attrName, (function(){console.log('hei')}));
                //`config` isn't a real attributes, so ignore it
                if (attrName === "config" || attrName === "key"){ console.log('not real attr'); continue;}

				else if (attrName === "onClick") {
					node[attrName] = dataAttr;
                }
                //hook event handlers to the auto-redrawing system
                else if (isFunction(dataAttr) && attrName.slice(0, 2) === "on") {
                	console.log('ev handler');
                	console.log(attrName);
                    node[attrName] = autoredraw(dataAttr, node);
                }
                //handle `style: {...}`
                else if (attrName === "style" && dataAttr != null && isObject(dataAttr)) {
                    for (var rule in dataAttr) {
                        if (cachedAttr == null || cachedAttr[rule] !== dataAttr[rule]) node.style[rule] = dataAttr[rule];
                    }
                    for (var rule in cachedAttr) {
                        if (!(rule in dataAttr)) node.style[rule] = "";
                    }
                }
                //handle SVG
                else if (namespace != null) {
                    if (attrName === "href") node.setAttributeNS("http://www.w3.org/1999/xlink", "href", dataAttr);
                    else node.setAttribute(attrName === "className" ? "class" : attrName, dataAttr);
                }
                //handle cases that are properties (but ignore cases where we should use setAttribute instead)
                //- list and form are typically used as strings, but are DOM element references in js
                //- when using CSS selectors (e.g. `m("[style='']")`), style is used as a string, but it's an object in js
                else if (attrName in node && attrName !== "list" && attrName !== "style" && attrName !== "form" && attrName !== "type" && attrName !== "width" && attrName !== "height") {
                    //#348 don't set the value if not needed otherwise cursor placement breaks in Chrome
                    if (tag !== "input" || node[attrName] !== dataAttr) node[attrName] = dataAttr;
                } else node.setAttribute(attrName, dataAttr);
            } catch (e) {
                //swallow IE's invalid argument errors to mimic HTML's fallback-to-doing-nothing-on-invalid-attributes behavior
                if (e.message.indexOf("Invalid argument") < 0) throw e;
            }
        }
        //#348 dataAttr may not be a string, so use loose comparison (double equal) instead of strict (triple equal)
        else if (attrName === "value" && tag === "input" && node.value != dataAttr) {
            node.value = dataAttr;
        }
    }
    return cachedAttrs;
}

function forEach(list, f) {
    for (var i = 0; i < list.length && !f(list[i], i++);) {}
}

function forKeys(list, f) {
    forEach(list, function(attrs, i) {
        return (attrs = attrs && attrs.attrs) && attrs.key != null && f(attrs, i);
    });
}

function handleText(cached, data, index, parentElement, shouldReattach, editable, parentTag) {
    //handle text nodes
    return cached.nodes.length === 0 ? handleNonexistentNodes(data, parentElement, index) :
        cached.valueOf() !== data.valueOf() || shouldReattach === true ?
        reattachNodes(data, cached, parentElement, editable, index, parentTag) :
        (cached.nodes.intact = true, cached);
}

function getSubArrayCount(item) {
    if (item.$trusted) {
        //fix offset of next element if item was a trusted string w/ more than one html element
        //the first clause in the regexp matches elements
        //the second clause (after the pipe) matches text nodes
        var match = item.match(/<[^\/]|\>\s*[^<]/g);
        if (match != null) return match.length;
    } else if (isArray(item)) {
        return item.length;
    }
    return 1;
}

function scheduleConfigsToBeCalled(configs, data, node, isNew, cached) {
    //schedule configs to be called. They are called after `build`
    //finishes running
    if (isFunction(data.attrs.config)) {
        var context = cached.configContext = cached.configContext || {};

        //bind
        configs.push(function() {
            return data.attrs.config.call(data, node, !isNew, context, cached);
        });
    }
}

function buildUpdatedNode(cached, data, editable, hasKeys, namespace, views, configs, controllers) {
    var node = cached.nodes[0];
    console.log('buildUpdatedNode');
    console.log(cached);
    if (hasKeys) setAttributes(node, data.tag, data.attrs, cached.attrs, namespace);
    cached.children = build(node, data.tag, undefined, undefined, data.children, cached.children, false, 0, data.attrs.contenteditable ? node : editable, namespace, configs);
    cached.nodes.intact = true;

    if (controllers.length) {
        cached.views = views;
        cached.controllers = controllers;
    }

    return node;
}

function handleNonexistentNodes(data, parentElement, index) {
    var nodes;
    if (data.$trusted) {
        nodes = injectHTML(parentElement, index, data);
    } else {
        nodes = [$document.createTextNode(data)];
        if (!parentElement.nodeName.match(voidElements)) insertNode(parentElement, nodes[0], index);
    }

    var cached = typeof data === "string" || typeof data === "number" || typeof data === "boolean" ? new data.constructor(data) : data;
    cached.nodes = nodes;
    return cached;
}

function unloadCachedControllers(cached, views, controllers) {
    if (controllers.length) {
        cached.views = views;
        cached.controllers = controllers;
        forEach(controllers, function(controller) {
            if (controller.onunload && controller.onunload.$old) controller.onunload = controller.onunload.$old;
            if (pendingRequests && controller.onunload) {
                var onunload = controller.onunload;
                controller.onunload = noop;
                controller.onunload.$old = onunload;
            }
        });
    }
}

function dataToString(data) {
    //data.toString() might throw or return null if data is the return value of Console.log in Firefox (behavior depends on version)
    try {
        if (data == null || data.toString() == null) return "";
    } catch (e) {
        return "";
    }
    return data;
}

function isFunction(object) {
    return typeof object === "function";
}

function isObject(object) {
    return type.call(object) === "[object Object]";
}

function isString(object) {
    return type.call(object) === "[object String]";
}
var isArray = Array.isArray || function(object) {
    return type.call(object) === "[object Array]";
};
var type = {}.toString;
var parser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g,
    attrParser = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/;
var voidElements = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;
var noop = function() {};

function makeCache(data, cached, index, parentIndex, parentCache) {
    if (cached != null) {
        if (type.call(cached) === type.call(data)) return cached;

        if (parentCache && parentCache.nodes) {
            var offset = index - parentIndex,
                end = offset + (isArray(data) ? data : cached.nodes).length;
            clear(parentCache.nodes.slice(offset, end), parentCache.slice(offset, end));
        } else if (cached.nodes) {
            clear(cached.nodes, cached);
        }
    }

    cached = new data.constructor();
    //if constructor creates a virtual dom element, use a blank object
    //as the base cached node instead of copying the virtual el (#277)
    if (cached.tag) cached = {};
    cached.nodes = [];
    return cached;
}

function buildObject(data, cached, editable, parentElement, index, shouldReattach, namespace, configs) {
    var views = [],
        controllers = [];
    data = markViews(data, cached, views, controllers);
    if (!data.tag && controllers.length) throw new Error("Component template must return a virtual element, not an array, string, etc.");
    data.attrs = data.attrs || {};
    cached.attrs = cached.attrs || {};
    var dataAttrKeys = Object.keys(data.attrs);
    var hasKeys = dataAttrKeys.length > ("key" in data.attrs ? 1 : 0);
    maybeRecreateObject(data, cached, dataAttrKeys);
    if (!isString(data.tag)) return;
    var isNew = cached.nodes.length === 0;
    namespace = getObjectNamespace(data, namespace);
    var node;
    if (isNew) {
        node = constructNode(data, namespace);
        //set attributes first, then create children
        var attrs = constructAttrs(data, node, namespace, hasKeys);
        var children = constructChildren(data, node, cached, editable, namespace, configs);
        cached = reconstructCached(data, attrs, children, node, namespace, views, controllers);
    } else {
        node = buildUpdatedNode(cached, data, editable, hasKeys, namespace, views, configs, controllers);
    }
    if (isNew || shouldReattach === true && node != null) insertNode(parentElement, node, index);
    //schedule configs to be called. They are called after `build`
    //finishes running
    scheduleConfigsToBeCalled(configs, data, node, isNew, cached);
    return cached;
}


function constructNode(data, namespace) {
    return namespace === undefined ?
        data.attrs.is ? $document.createElement(data.tag, data.attrs.is) : $document.createElement(data.tag) :
        data.attrs.is ? $document.createElementNS(namespace, data.tag, data.attrs.is) : $document.createElementNS(namespace, data.tag);
}

function constructAttrs(data, node, namespace, hasKeys) {
    return hasKeys ? setAttributes(node, data.tag, data.attrs, {}, namespace) : data.attrs;
}

function constructChildren(data, node, cached, editable, namespace, configs) {
    return data.children != null && data.children.length > 0 ?
        build(node, data.tag, undefined, undefined, data.children, cached.children, true, 0, data.attrs.contenteditable ? node : editable, namespace, configs) :
        data.children;
}

function reconstructCached(data, attrs, children, node, namespace, views, controllers) {
    var cached = {
        tag: data.tag,
        attrs: attrs,
        children: children,
        nodes: [node]
    };
    unloadCachedControllers(cached, views, controllers);
    if (cached.children && !cached.children.nodes) cached.children.nodes = [];
    //edge case: setting value on <select> doesn't work before children exist, so set it again after children have been created
    if (data.tag === "select" && "value" in data.attrs) setAttributes(node, data.tag, {
        value: data.attrs.value
    }, {}, namespace);
    return cached
}

function getController(views, view, cachedControllers, controller) {
	console.log('getController');
    var controllerIndex = m.redraw.strategy() === "diff" && views ? views.indexOf(view) : -1;
    return controllerIndex > -1 ? cachedControllers[controllerIndex] :
        typeof controller === "function" ? new controller() : {};
}

function updateLists(views, controllers, view, controller) {
    if (controller.onunload != null) unloaders.push({
        controller: controller,
        handler: controller.onunload
    });
    views.push(view);
    controllers.push(controller);
}

function checkView(data, view, cached, cachedControllers, controllers, views) {
		console.log('checkView	');

    var controller = getController(cached.views, view, cachedControllers, data.controller);
    //Faster to coerce to number and check for NaN
    var key = +(data && data.attrs && data.attrs.key);
    data = pendingRequests === 0 || forcing || cachedControllers && cachedControllers.indexOf(controller) > -1 ? data.view(controller) : {
        tag: "placeholder"
    };
    if (data.subtree === "retain") return cached;
    if (key === key)(data.attrs = data.attrs || {}).key = key;
    updateLists(views, controllers, view, controller);
    return data;
}

function markViews(data, cached, views, controllers) {
    var cachedControllers = cached && cached.controllers;
    while (data.view != null) data = checkView(data, data.view.$original || data.view, cached, cachedControllers, controllers, views);
    return data;
}

function maybeRecreateObject(data, cached, dataAttrKeys) {
    //if an element is different enough from the one in cache, recreate it
    if (data.tag !== cached.tag ||
        dataAttrKeys.sort().join() !== Object.keys(cached.attrs).sort().join() ||
        data.attrs.id !== cached.attrs.id ||
        data.attrs.key !== cached.attrs.key ||
        (m.redraw.strategy() === "all" && (!cached.configContext || cached.configContext.retain !== true)) ||
        (m.redraw.strategy() === "diff" && cached.configContext && cached.configContext.retain === false)) {
        if (cached.nodes.length) clear(cached.nodes);
        if (cached.configContext && isFunction(cached.configContext.onunload)) cached.configContext.onunload();
        if (cached.controllers) {
            forEach(cached.controllers, function(controller) {
                if (controller.unload) controller.onunload({
                    preventDefault: noop
                });
            });
        }
    }
}

function getObjectNamespace(data, namespace) {
    return data.attrs.xmlns ? data.attrs.xmlns :
        data.tag === "svg" ? "http://www.w3.org/2000/svg" :
        data.tag === "math" ? "http://www.w3.org/1998/Math/MathML" :
        namespace;
}

function getCellCacheKey(element) {
    var index = nodeCache.indexOf(element);
    return index < 0 ? nodeCache.push(element) - 1 : index;
}


exports.render = (spec, root, forceRecreation) => {
    spec._svenjs.rootNode = root;
    const data = spec.render();
    var configs = [];
    if (!root) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.");
    var id = getCellCacheKey(root);
    var isDocumentRoot = root === $document;
    var node = isDocumentRoot || root === $document.documentElement ? documentNode : root;
    if (isDocumentRoot && cell.tag !== "html") cell = {
        tag: "html",
        attrs: {},
        children: cell
    };
    if (cellCache[id] === undefined) clear(node.childNodes);
    if (forceRecreation === true) reset(root);
    cellCache[id] = build(node, null, undefined, undefined, data, cellCache[id], false, 0, null, undefined, configs);
    forEach(configs, function(config) {
        config();
    });
};