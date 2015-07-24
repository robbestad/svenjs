const Svenjs = require('./sven.js');
import MyStore from './store';
var timeTravel = Svenjs.createComponent({
    displayName: "First app",
    initialState: {
        items: [],
        message: ''
    },
    componentDidMount() {
        "use strict";
        MyStore.listenTo(this.onEmit);
    },

    componentDidUpdate() {
        "use strict";
    },
    onEmit(data) {
        console.log("data from store received!")
        console.log(data);
    },
    handleClick: function(idx) {
        console.log('handleClick');
        var state = this.state;
        var time = this.time;
        var self = this;
        state.items.push(this.getNextString());
        state.message = "BOB" + (1 + Math.floor(Math.random() * 100)) + "!";
        this.setState(state);
    },
    goBack() {
        Svenjs.timeTravel(this, -1);
    },
    goForward() {
        Svenjs.timeTravel(this, 1);
    },
    getNextString() {
        "use strict";
        var words = 'The quick brown fox jumps over the lazy dog'.split(' ');
        return words[Math.floor(Math.random() * words.length)];
    },
    render(){
      "use strict";

      var state=this.state;
      var time = this.time;
      let backDisabled=true;
      let nextDisabled=true;

     return ({tag: "div", attrs: {id:"row"}, children: [
         {tag: "div", attrs: {id:"app"}, children: [
             {tag: "h3", attrs: {}, children: [state.message || "Svenjs App"]},
             {tag: "button", attrs: {onClick:this.handleClick.bind(this)}, children: ["Add word"]},
             {tag: "div", attrs: {id:"ui"}},
             {tag: "small", attrs: {}, children: ["(click word to delete)"]}
         ]},
         {tag: "div", attrs: {id:"time-travel"}, children: [
             {tag: "h3", attrs: {}, children: ["Time travel"]},
             {tag: "button", attrs: {disabled:backDisabled, onClick:this.goBack.bind(this)}, children: ["Back"]},
             {tag: "button", attrs: {disabled:nextDisabled, onClick:this.goForward.bind(this)}, children: ["Next"]},
             {tag: "p", attrs: {id:"time-pos"}}
         ]}
     ]})
    },

  __render: function () {
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
    return docFragment;
  }
});
module.exports = timeTravel;