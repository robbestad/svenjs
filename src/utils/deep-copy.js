const deepCopy = exports.deepCopy = (obj)=> {
  if(obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj)
    return obj;

  let temp = obj.constructor(); // changed

  for(let key in obj) {
    if(Object.prototype.hasOwnProperty.call(obj, key)) {
      obj['isActiveClone'] = null;
      temp[key] = deepCopy(obj[key]);
      delete obj['isActiveClone'];
    }
  }

  return temp;
};