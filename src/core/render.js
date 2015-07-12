const render = exports.render = (state)=> {
  var span = '<span id="count">Words: ' + state.items.length + '</span>';
  var lis = state.items.map( (item, idx) => {
    return '<li onclick=handleClick('+idx+')>' + item + '</li>';
  });
  return span + '<ul>' + lis.join('') + '</ul>';
};