const Svenjs = require('dist/index.js').default;
// const Svenjs = require('./sven.js');
let _data = ['Do this','Then do this'];
module.exports = Svenjs.createStore({
	init(){
		this.emit(_data);
	}
});
