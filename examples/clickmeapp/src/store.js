const Svenjs = require('dist/index.js');
const getJSON = require('./get-json').getJSON;

module.exports = Svenjs.createStore({
	init(){
		getJSON('http://jsonplaceholder.typicode.com/posts/1')
	    .then((data)=>{
	     this.emit(data);
	    })
	    .catch(console.log.bind(console));
	}
});
