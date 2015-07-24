const Svenjs = require('./sven.min');
const MyStore = require('./store');

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
      console.log('clicking myFunc');
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

    return ({tag: "div", attrs: {id:"row"}, children: [
        {tag: "div", attrs: {id:"app"}, children: [
            {tag: "h3", attrs: {}, children: [this.state.message || "Svenjs App"]},
            {tag: "button", attrs: {onClick:this.handleClick}, children: ["Add word"]},
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
    }
});
module.exports = timeTravel;
