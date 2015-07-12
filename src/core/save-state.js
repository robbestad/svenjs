const saveState = exports.saveState = (time)=> {
  time = time || {history: [], pos: -1};
// delete alternate future history
  time.history.splice(time.pos + 1);
// push state to history
  time.history.push(Svenjs.deepCopy(state));
  time.pos++;
};