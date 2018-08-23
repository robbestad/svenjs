const shallowCopy = function (o) {
  return JSON.parse(JSON.stringify(o));
};
export default shallowCopy;
