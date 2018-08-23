const Svenjs = require('dist/index.js').default;
const Welcome  = require('./welcome');
const Welcome2  = require('./welcome2');
const Counter = require('./counter');
module.exports = Svenjs.create({
  render(){
    return (<div>

      <h1>Hello</h1>
      <div><Welcome greeting="We meet again"/></div>

      <h1>Hello</h1>
      <div><Welcome /></div>

      <h1>Hello</h1>
      <div><Welcome2 greeting="Yeah boi"/></div>

	    <h1>Counter</h1>
      <div><Counter/></div>
    </div>);
  }
});
