"use strict";

const deepCopy = function (o) {
  return JSON.parse(JSON.stringify(o));
};
export default deepCopy;
