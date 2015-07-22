const Svenjs = require('../../dist/sven.js');
import {getJSON} from './get-json';
let _data="_content+emitted_";

module.exports = Svenjs.createStore({
	init(){
		const self = this;
		getJSON('http://www.reddit.com/r/javascript/.json')
	    .then(function (data) {
	     self.emit(data);
	    })
	    .catch(console.log.bind(console));
	
	    
	    //.catch((reason) =>{
        //	console.log('oh no, this happened:'+reason);
    	//});
		/*
		setInterval(()=>{
			_data = Math.random()*1000;
			this.emit(_data);
		},10e3);
		*/
	}
});
