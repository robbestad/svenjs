// const Svenjs = require('assets/index');
const Svenjs = require('dist/index.js');

const Welcome = Svenjs.create({
	initialState: {welcomeString: "Hello World!"},
	_didMount() {
		setTimeout(() => {
			this.setState({
				welcomeString: "I am Santa Claus"
			})
		}, 1500);
	},
	render() {
		const {welcomeString} = this.state;
		return <div>{welcomeString}</div>
	}
});
module.exports = Welcome;

