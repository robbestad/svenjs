function getObjectType(obj) {
  return Object.prototype.toString.call(obj);
}
function isObject(obj) {
  return getObjectType(obj) === '[object Object]';
}
function isDate(obj) {
  return getObjectType(obj) === '[object Date]';
}
function isString(obj) {
  return getObjectType(obj) === '[object String]';
}
function isArray(obj) {
  return getObjectType(obj) === '[object Array]';
}
function isNumber(obj) {
  return getObjectType(obj) === '[object Number]';
}
function isFunction(obj) {
  return getObjectType(obj) === '[object Function]';
}
function isRegExp(obj) {
  return getObjectType(obj) === '[object RegExp]';
}
function isUndefined(obj) {
  return getObjectType(obj) === '[object Undefined]';
}
function isBoolean(obj) {
  return getObjectType(obj) === '[object Boolean]';
}
const deepCopy = exports.deepCopy = (obj)=> {
  'use strict';
  //return $.extend(true, {}, obj);
  var cloneObj = null;
  if (isArray(obj))
    cloneObj = [];
  else if (isObject(obj))
    cloneObj = {};
  else if (isDate(obj))
    cloneObj = new Date(obj.toJSON());
  else if (isRegExp(obj))
    cloneObj = new RegExp(obj.valueOf());
  else
    cloneObj = obj;
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var child = obj[key];
      if (isObject(child) || isArray(child))
        cloneObj[key] = deepCopy(child);
      else if (isNumber(child) ||
        isString(child) ||
        isFunction(child) ||
        isUndefined(child) ||
        isBoolean(child))
        cloneObj[key] = child;
    }
  }
  return cloneObj;
};