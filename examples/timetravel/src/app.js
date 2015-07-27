const Svenjs = require('../../../dist/sven.js');

var timeTravel = Svenjs.createComponent({
  displayName:"First app",
  initialState:{items: [], message:''},
  componentDidMount(){
    "use strict";
  },
  componentDidUpdate(){
    "use strict";
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
    var words = 'Pack my box with five dozen liquor jugs'.split(' ');
    return words[Math.floor(Math.random() * words.length)];
  },
  render(){
    let state= this.state;
    let time = this.time;
    let self = this;

    let nextDisabled = time.pos >= time.history.length - 1 ? "disabled" : false;
    let backDisabled = time.pos <= 0 ? "disabled" : false;

    let words = this.state.items.map((item)=>{
        return <li>{item}</li>;
    });

    return (<div id="row">
              <div id="app">
                  <h3>{this.state.message || "Sample App"}</h3>
                  <button id="add" onClick={this.handleClick.bind(this)}>Add Word</button>
                  <div id="ui"><ul>{words}</ul></div>
              </div>
              <div id="time-travel">
                  <h3>Time travel</h3>
                  <button id="back" disabled={backDisabled} onClick={this.goBack.bind(this)}>Back</button>
                  <button id="next" disabled={nextDisabled} onClick={this.goForward.bind(this)}>Next</button>
                  <p id="time-pos">
                    Position {time.pos + 1} of {time.history.length}
                  </p>
              </div>
        </div>);
    }
});
module.exports = timeTravel;