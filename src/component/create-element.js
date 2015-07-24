//import {updateUI} from './update-ui';
var assign = require('Object.assign');
var RESERVED_PROPS = {
  key: true,
  ref: true,
};

/**
 * Base constructor for all Svenjs elements. This is only used to make this
 * work with a dynamic instanceof check. Nothing should live on this prototype.
 *
 * @param {*} type
 * @param {*} key
 * @param {string|object} ref
 * @param {*} owner
 * @param {*} props
 * @internal
 */

var SvenjsElement = function(type, key, ref, owner, props) {
  // Built-in properties that belong on the element
  this.type = type;
  this.key = key;
  this.ref = ref;
  // Record the component responsible for creating this element.
  this._owner = owner;
  this.props = props;
console.log(this);
};

exports.createElement = (type, config, children) => {
//	console.log('create-element');
//	console.log(parts);
   /* let docFragment = document.createDocumentFragment();
    let el = document.createElement(type);
    //console.log(parts);
    if(config){
    	//console.log(config);
    	if(config.hasOwnProperty('onClick')) 
    		el.onclick = config.onClick;

		if(config.hasOwnProperty('disabled')) 
    		if(config.disabled !== "false") el.disabled = config.disabled;
    	
		if(config.hasOwnProperty('id')){ 
    		el.id = config.id;
    		}
    	
    }
    if(children){
    el.appendChild(document.createTextNode(children));
    }
        //if(parts[3]){
    //	el.appendChild(document.createTextNode(parts[3]));
    //}
    docFragment.appendChild(el);

    document.getElementById('ui').appendChild(docFragment);
    */
     var propName;

  // Reserved names are extracted
  var props = {};

  var key = null;
  var ref = null;

  if (config != null) {
    ref = config.ref === undefined ? null : config.ref;
    key = config.key === undefined ? null : '' + config.key;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (config.hasOwnProperty(propName) &&
          !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (typeof props[propName] === 'undefined') {
        props[propName] = defaultProps[propName];
      }
    }
  }

  return new SvenjsElement(
    type,
    key,
    ref,
    'ui',
    props
  );

}

