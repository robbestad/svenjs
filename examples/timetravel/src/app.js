const Svenjs = require('../../../dist/sven.js');
const MyStore = require('./store');

var timeTravel = Svenjs.createComponent({
  displayName:"Timetravel App",
  initialState:{items: [], message:''},
  componentDidMount(){
    "use strict";
    //MyStore.listenTo(this.onEmit);
  },
  componentDidUpdate(){
    "use strict";
  },
  onEmit(data){
    console.log("data from store received!")
    console.log(data);
  },
  handleClick: function (idx) {
    console.log('handleClick');
      var state= this.state;
      var time = this.time;
      var self = this;
      state.items.push(this.getNextString());
      state.message="BOB"+(1+Math.floor(Math.random()*100))+"!";
      this.setState(state);
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

    let nextDisabled = time.pos >= time.history.length - 1 ? "disabled" : "false";
    let backDisabled = time.pos <= 0 ? "disabled" : "false";

    let myFunc = () =>{
      state.items.push(this.getNextString());
      state.message="BOB"+(1+Math.floor(Math.random()*100))+"!";
      this.setState(state);
    }

    return (<div id="row">
              <div id="app">
                  <h3>{this.state.message || "Sample App"}</h3>
                  <button id="add" onClick={myFunc}>Add word</button>
                  <div id="ui"></div>
                  <small>(click word to delete)</small>
              </div>
              <div id="time-travel">
                  <h3>Time travel</h3>
                  <button id="back" disabled={backDisabled} onClick={this.goBack.bind(this)}>Back</button>
                  <button id="next" disabled={nextDisabled} onClick={this.goForward.bind(this)}>Next</button>
                  <p id="time-pos"></p>
              </div>
        </div>);
    }
});
module.exports = timeTravel;