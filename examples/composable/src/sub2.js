const Svenjs = require('../../sven.js');

let Sub = Svenjs.create({
  displayName: "Sub",
  initialState:{count:0},
  componentDidMount(){
    "use strict";
    setInterval(()=>{this.upCount()},500);
  },
  upCount(){
    this.setState({count:this.state.count+1});
  },
  componentDidUpdate(){
    "use strict";
  },
  render(){
    "use strict";
    let count=this.state.count;
    console.log(this.state);
    return (<div class="l-box">This is subcomponent 2 {count}</div>);
  }
});
module.exports = Sub;
