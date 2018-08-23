const Svenjs = require('dist/index.js').default;

const App = Svenjs.create({
	initialState: {count: 0},
	_didMount() {
		setInterval(() => {
			this.upCount()
		}, 500);
	},
	upCount() {
		this.setState({count: this.state.count + 1});
	},
	_didUpdate() {
	},
	render() {
		let count = this.state.count;
		return (<div class="l-box">Hello from subcomponent 2 -- I can update my counter ({count})!</div>);
	}
});
module.exports = App;
