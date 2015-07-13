var state = {items: []};
var time = {history: [], pos: -1};
// on did mount
Svenjs.updateUI(false, render(state), time);

// app events
function handleClick(idx) {
  "use strict";
  state.items.push(getNextString());
  Svenjs.updateUI(false, render(state), time);
}

function getNextString() {
  "use strict";
  var words = 'The quick brown fox jumps over the lazy dog'.split(' ');
  return words[Math.floor(Math.random() * words.length)];
}

function rerender(state){
  "use strict";
  Svenjs.render(render(state));
}

function render(state) {
  "use strict";
  var docFragment = document.createDocumentFragment();

  var rowDiv = document.createElement("div");
  rowDiv.id="row";
  docFragment.appendChild(rowDiv);

  var app = document.createElement("div");
  app.id="app";
  rowDiv.appendChild(app);

  var h3 = document.createElement("h3");
  var h3Text = document.createTextNode("Sample App");
  h3.appendChild(h3Text);
  app.appendChild(h3);

  var button = document.createElement("button");
  var buttonText = document.createTextNode("Add Word");
  button.id="add";
  button.onclick = function () {
    "use strict";
    state.items.push(getNextString());
    Svenjs.setState(state, time, rerender);
  };
  button.appendChild(buttonText);
  app.appendChild(button);

  var smallSpan = document.createElement("small");
  smallSpan.textContent='(click word to delete)';
  app.appendChild(smallSpan);

  var wordSpan = document.createElement("span");
  wordSpan.id='count';
  wordSpan.textContent='Words: ' + state.items.length;
  app.appendChild(wordSpan);

  var ul = document.createElement("ul");
  state.items.forEach(function(item, idx){
    var li = document.createElement("li");
    var textContent = document.createTextNode(item);
    li.appendChild(textContent);
    li.onclick = function () {
      handleClick(idx);
    };
    ul.appendChild(li);
  });
  app.appendChild(ul);

  var timeTravelDiv = document.createElement("div");
  timeTravelDiv.id="time-travel";
  rowDiv.appendChild(timeTravelDiv);

  var ttH3 = document.createElement("h3");
  var ttH3Text = document.createTextNode("Time Travel");
  ttH3.appendChild(ttH3Text);
  timeTravelDiv.appendChild(ttH3);

  button = document.createElement("button");
  buttonText = document.createTextNode("Back");
  button.id="back";
  button.disabled = time.pos <= 0;
  button.onclick = function () {
    "use strict";
    time.pos--;
    // Load historic state
    state = Svenjs.deepCopy(time.history[time.pos]);
    Svenjs.updateUI(true, render(state), time);
  };
  button.appendChild(buttonText);
  timeTravelDiv.appendChild(button);

  button = document.createElement("button");
  buttonText = document.createTextNode("Next");
  button.id="next";
  button.disabled =  time.pos >= time.history.length - 1;
  button.onclick = function () {
    "use strict";
    // Move history pointer
    time.pos++;
    // Load historic state
    state = Svenjs.deepCopy(time.history[time.pos]);
    Svenjs.updateUI(true, render(state), time);
  };
  button.appendChild(buttonText);
  timeTravelDiv.appendChild(button);
  var ttP = document.createElement("p");
  ttP.id = "time-pos";
  ttP.textContent=('Position ' + (0 === (time.pos +1) ? 1 : (time.pos +1)) + ' of ' +
    (0 === time.history.length ? 1 : time.history.length));
  timeTravelDiv.appendChild(ttP);

  return docFragment;

}