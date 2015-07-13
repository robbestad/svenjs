const setState = exports.setState = (state, time, callback)=> {
  Svenjs.saveState(time);
  if (JSON.stringify(document.querySelector('#ui').innerstate) === JSON.stringify(state)) {
    return;
  }
// delete alternate future history
  time.history.splice(time.pos);
// push state to history
  time.history.push(Svenjs.deepCopy(state));

  callback(state);
};