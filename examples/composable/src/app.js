const Svenjs = require('../../sven.js');
const Sub1 = require('./sub.js');
const Sub2 = require('./sub2.js');

module.exports = Svenjs.create({
  displayName: "Main",
  render(){
    "use strict";
    return (<div className="pure-g">
      <div className="pure-u-1 pure-u-md-1-3">This is the main file</div>
      <div className="pure-u-1 pure-u-md-1-3">{Sub1.render(Sub1.spec)}</div>
      <div className="pure-u-1 pure-u-md-1-3">{Sub2.render(Sub2.spec)}</div>
    </div>);
  }
});
