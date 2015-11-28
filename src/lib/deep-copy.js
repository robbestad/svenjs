"use strict";

exports.deepCopy = function (o) {
  return JSON.parse(JSON.stringify(o));
};
