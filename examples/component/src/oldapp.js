//const Svenjs = require('../../dist/sven');
const Svenjs = require('../../src/index');
import MyStore from './store';
import App2 from './app2';

var timeTravel = Svenjs.createComponent({
  displayName:"First app",
  initialState:{items: [], message:''},
  componentDidMount(){
    "use strict";
    MyStore.listenTo(this.onEmit);
  },

  componentDidUpdate(){
    "use strict";
  },
  onEmit(data){
    console.log("data from store received!")
    console.log(data);
  },
  handleClick: function (idx) {
    "use strict";
    this.state.items.splice(idx, 1);
    this.state.message = "Spliced!";
    this.setState(this.state);
  },
  goBack(){
      Svenjs.timeTravel(this,-1);
  },
  goForward(){
      Svenjs.timeTravel(this,1);
  },
  getNextString() {
    "use strict";
    var words = 'The quick brown fox jumps over the lazy dog'.split(' ');
    return words[Math.floor(Math.random() * words.length)];
  },
  render(){
    var state= this.state;
    var time = this.time;
    var self = this;

    let myFunc = () =>{
      state.items.push(this.getNextString());
      state.message="BOB"+(1+Math.floor(Math.random()*100))+"!";
      this.setState(state);
    }

    let nextDisabled = time.pos >= time.history.length - 1 ? "disabled" : "false";
    let backDisabled = time.pos <= 0 ? "disabled" : "false";

/*
return this.jsx`<div id="row">
              <div id="app">
                  <h3>{this.state.message || "Sample App"}</h3>
                  <button id="add" onClick=${myFunc}>Add word</button>
                  <div id="ui"></div>
                  <small>(click word to delete)</small>
              </div>
              <div id="time-travel">
                  <h3>Time travel</h3>
                  <button id="back" disabled=${backDisabled} onClick={this.goBack.bind(this)}>Back</button>
                  <button id="next" disabled=${nextDisabled} onClick={this.goForward.bind(this)}>Next</button>
                  <p id="time-pos"></p>
              </div>
        </div>`;

        <div id="row">
              <div id="app">
                  <h3>{this.state.message || "Sample App"}</h3>
                  <button id="add" onClick=${myFunc}>Add word</button>
                  <div id="ui"></div>
                  <small>(click word to delete)</small>
              </div>
              <div id="time-travel">
                  <h3>Time travel</h3>
                  <button id="back" disabled=${backDisabled} onClick={this.goBack.bind(this)}>Back</button>
                  <button id="next" disabled=${nextDisabled} onClick={this.goForward.bind(this)}>Next</button>
                  <p id="time-pos"></p>
              </div>
        </div>
*/


    return (
     Svenjs.createElement("div", {id: "row"}, 
              Svenjs.createElement("div", {id: "app"}, 
                  Svenjs.createElement("h3", null, this.state.message || "Sample App"), 
                  Svenjs.createElement("button", {id: "add", onClick: myFunc}, "Add word"), 
                  Svenjs.createElement("div", {id: "ui"}), 
                  Svenjs.createElement("small", null, "(click word to delete)")
              ), 
              Svenjs.createElement("div", {id: "time-travel"}, 
                  Svenjs.createElement("h3", null, "Time travel"), 
                  Svenjs.createElement("button", {id: "back", disabled: backDisabled, onClick: this.goBack.bind(this)}, "Back"), 
                  Svenjs.createElement("button", {id: "next", disabled: nextDisabled, onClick: this.goForward.bind(this)}, "Next"), 
                  Svenjs.createElement("p", {id: "time-pos"})
              )
        )
        )
  },
 

  _render: function () {
    "use strict";
    var state=this.state;
    var time = this.time;
    var docFragment = document.createDocumentFragment();
    var rowDiv = document.createElement("div");
    rowDiv.id = "row";
    docFragment.appendChild(rowDiv);
    var app = document.createElement("div");
    app.id = "app";
    rowDiv.appendChild(app);
    var h3 = document.createElement("h3");
    var h3Text = document.createTextNode(this.state.message || "Sample App");
    h3.appendChild(h3Text);
    app.appendChild(h3);
    var button = document.createElement("button");
    var buttonText = document.createTextNode("Add Word");
    button.id = "add";
    button.onclick = ()=> {
      "use strict";
      state.items.push(this.getNextString());
      this.setState(state);

    };
    button.appendChild(buttonText);
    app.appendChild(button);
    var smallSpan = document.createElement("small");
    smallSpan.textContent = '(click word to delete)';
    //setInterval(()=>{smallSpan.textContent=Math.random()*50},50)
    app.appendChild(smallSpan);
    var wordSpan = document.createElement("span");
    wordSpan.id = 'count';
    wordSpan.textContent = 'Words: ' + state.items.length;
    app.appendChild(wordSpan);
    var ul = document.createElement("ul");
    state.items.forEach((item, idx)=> {
      var li = document.createElement("li");
      var textContent = document.createTextNode(item);
      li.appendChild(textContent);
      li.onclick =  () => {
        this.handleClick(idx);
      };
      ul.appendChild(li);
    });
    app.appendChild(ul);
    var timeTravelDiv = document.createElement("div");
    timeTravelDiv.id = "time-travel";
    rowDiv.appendChild(timeTravelDiv);
    var ttH3 = document.createElement("h3");
    var ttH3Text = document.createTextNode("Time Travel");
    ttH3.appendChild(ttH3Text);
    timeTravelDiv.appendChild(ttH3);
    button = document.createElement("button");
    buttonText = document.createTextNode("Back");
    button.id = "back";
    button.disabled = time.pos <= 0;
    button.onclick  = ()=> {
      "use strict";
      Svenjs.timeTravel(this,-1);
    }
    
    button.appendChild(buttonText);
    timeTravelDiv.appendChild(button);
    button = document.createElement("button");
    buttonText = document.createTextNode("Next");
    button.id = "next";
    button.disabled = time.pos >= time.history.length - 1;
    button.onclick  =()=> {
      "use strict";
      Svenjs.timeTravel(this,1);
    };
    button.appendChild(buttonText);
    timeTravelDiv.appendChild(button);
    var ttP = document.createElement("p");
    ttP.id = "time-pos";
    ttP.textContent =
      ('Position ' + (time.pos + 1) + ' of ' + time.history.length);
    timeTravelDiv.appendChild(ttP);

/*
var anotherDiv = document.createElement("div");
    anotherDiv.id = "second";
    docFragment.appendChild(anotherDiv);
    document.getElementById('myapp').appendChild(docFragment)
    Svenjs.render(
      App2,
      docFragment.getElementById("second")
    );
    */

    return docFragment;
  }
});
module.exports = timeTravel;