"use strict"
// define common functions used in this module
var type = ({}).toString;
const isFunction = function (object) {
	return typeof object === "function";
};
const isObject = function (object) {
	return type.call(object) === "[object Object]";
};
const isString = function (object) {
	return type.call(object) === "[object String]";
};
const isArray = function (object) {
	return type.call(object) === "[object Array]";
};
const isDefined = function (object) {
	return type.call(object) !== "undefined";
};
export {
	isFunction,
	isObject,
	isString,
	isArray,
	isDefined
}
