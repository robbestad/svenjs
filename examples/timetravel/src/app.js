const Svenjs = require('../../../dist/sven.js');
const MyStore = require('./store');

var timeTravel = Svenjs.createComponent({
  displayName:"Timetravel App",
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
      let items= this.state.items;
      items.push(this.getNextString());
      this.setState({items:items,message:"Wordsworth"});
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
    let state= this.state;
    let time = this.time;
    let self = this;
console.log(time);
    let nextDisabled = time.pos >= time.history.length - 1 ? true : false;
    let backDisabled = time.pos <= 0 ? true : false;

    let words = this.state.items.map((item)=>{
        return <li>{item}</li>;
    });

    return (<div id="row">
              <div id="app">
                  <h3>{this.state.message || "Sample App"}</h3>
                  <button id="add" onClick={this.handleClick.bind(this)}>Add Word</button>
                  <ul id="ui">{words}</ul>
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