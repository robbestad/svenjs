const Svenjs = require('../../sven.js');

let Sub = Svenjs.create({
  displayName: "Sub",
  render(){
    "use strict";
    return (<div class="l-box">
      <canvas />

    </div>);
  }
});
module.exports = Sub;
