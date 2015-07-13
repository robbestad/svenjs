var state = {items: ['dog', 'cat']};
var time = {history: [], pos: -1};

// app events
function handleClick(idx) {
  "use strict";
  state.items.splice(idx, 1);
  Svenjs.updateUI(false,render(state),time);
}

function getNextString() {
  var words = 'The quick brown fox jumps over the lazy dog'.split(' ');
  return words[Math.floor(Math.random() * words.length)];
}

function updateTimeUI() {
  if(null !== document.querySelector('#time-pos')) document.querySelector('#time-pos').innerHTML =
    ('Position ' + (time.pos + 1) + ' of ' + time.history.length);
  if(null !== document.querySelector('#next'))
    document.querySelector('#next').disabled = time.pos >= time.history.length - 1;
}

// on did mount
updateTimeUI();
Svenjs.updateUI(false,render(state),time);

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
    state.items.push(getNextString());
    Svenjs.updateUI(false,render(state),time);
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
  state.items.forEach(function(item){
    var li = document.createElement("li");
    var textContent = document.createTextNode(item);
    li.appendChild(textContent);
    li.onclick = function () {
      handleClick(item);
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
    time.pos--;
    updateTimeUI();
    // Load historic state
    state = Svenjs.deepCopy(time.history[time.pos]);
    Svenjs.updateUI(true, render(state),time);
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
    updateTimeUI();
    // Load historic state
    state = Svenjs.deepCopy(time.history[time.pos]);
    Svenjs.updateUI(true, render(state), time);
  };
  button.appendChild(buttonText);
  timeTravelDiv.appendChild(button);
  
  var ttP = document.createElement("p");
  ttP.id = "time-pos";
  ttP.textContent=('Position ' + (time.pos + 1) + ' of ' + time.history.length);
  timeTravelDiv.appendChild(ttP);

  return docFragment;

}