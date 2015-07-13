var state = {items: ['dog', 'cat']};
var time = {history: [], pos: -1};
// app events
function handleClick(idx) {
  "use strict";
  state.items.splice(idx, 1);
  updateTimeUI();
  Svenjs.updateUI(false, render(state), time);
}
document.querySelector('#add').onclick = function () {
  "use strict";
  state.items.push(getNextString());
  Svenjs.updateUI(false, render(state), time);
  updateTimeUI();
};
function getNextString() {
  var words = 'The quick brown fox jumps over the lazy dog'.split(' ');
  return words[Math.floor(Math.random() * words.length)];
}
Svenjs.updateUI(false, render(state), time);
// Time travel
updateTimeUI();
function updateTimeUI() {
  document.querySelector('#time-pos').innerHTML =
    ('Position ' + (time.pos + 1) + ' of ' + time.history.length);
  document.querySelector('#back').disabled = time.pos <= 0;
  document.querySelector('#next').disabled = time.pos >= time.history.length - 1;
}
document.querySelector('#back').onclick = function () {
  "use strict";
  time.pos--;
  updateTimeUI();
  // Load historic state
  state = Svenjs.deepCopy(time.history[time.pos]);
  Svenjs.updateUI(true, render(state), time);
};
document.querySelector('#next').onclick = function () {
  "use strict";
  // Move history pointer
  time.pos++;
  updateTimeUI();
  // Load historic state
  state = Svenjs.deepCopy(time.history[time.pos]);
  Svenjs.updateUI(true, render(state), time);
};
function render(state) {
  "use strict";


  var span = '<span id="count">Words: ' + state.items.length + '</span>';
  var lis = state.items.map(function (item, idx) {
    return '<li onclick=handleClick(' + idx + ')>' + item + '</li>';
  });
  return span + '<ul>' + lis.join('') + '</ul>';
}