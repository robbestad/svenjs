const Svenjs = require('../../sven.js');
const Sub = require('./sub.js');

module.exports = Svenjs.create({
    displayName: "Main",
    render(){
      "use strict";
      return (<div className="pure-g">
                <div className="pure-u-1 pure-u-md-1-3">This is the main file</div>
                <div className="pure-u-1 pure-u-md-1-3">{Sub.render(Sub.spec)}</div>
                <div className="pure-u-1 pure-u-md-1-3">{Sub.render(Sub.spec)}</div>
            </div>);
    }
});
