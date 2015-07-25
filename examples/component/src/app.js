const Svenjs = require('./sven.js');
import MyStore from './store';
var timeTravel = Svenjs.createComponent({
    displayName: "First app",
    initialState: {
        clicks: 0
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

      let svenFunc = () =>{
        this.setState({clicks: (this.state.clicks ? ++this.state.clicks : 1)});
        console.log(this.state.clicks);
      }

     return ({tag: "div", attrs: {id:"row"}, children: [
        {tag: "div", attrs: {id:"app"}, children: [
            {tag: "h3", attrs: {}, children: ["The Click App"]},
            {tag: "button", attrs: {onClick:svenFunc.bind(this)}, children: ["Why not click me?"]}
        ]},
        {tag: "div", attrs: {id:"time-travel"}, children: [
            {tag: "h3", attrs: {}, children: ["Click stats"]},
          {tag: "p", attrs: {}, children: ["You have clicked on the button ", this.state.clicks || 0, " times"]}
        ]}
    ]})
    }

});
module.exports = timeTravel;