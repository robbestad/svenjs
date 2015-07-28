const Svenjs = require('../../sven.js');
const Sub = require('./sub.js');

let MainApp = Svenjs.createComponent({
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
module.exports = MainApp;