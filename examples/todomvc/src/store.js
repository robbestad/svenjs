const Svenjs = require('assets/sven.js');
let _data = ['Do this','Then do this'];
module.exports = Svenjs.createStore({
	init(){
		this.emit(_data);
	}
});
