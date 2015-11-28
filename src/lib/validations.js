"use strict"
// define common functions used in this module
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
