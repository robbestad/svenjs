const Svenjs = require('dist/index.js').default;

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
		const {greeting} = this.props;
		return <div>{welcomeString} {greeting}</div>
	}
});
module.exports = Welcome;

