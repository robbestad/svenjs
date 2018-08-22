var webpack = require('webpack');
var path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const history = require('connect-history-api-fallback');
const convert = require('koa-connect');

module.exports = {
	mode:    "development",
	module:  {
		rules: [
			{test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/},
			{test: /\.jsx$/, enforce:"pre",  loaders: ['svenjsx-loader'], exclude: /node_modules/}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
		}),
		new HtmlWebpackPlugin(
			{
				template: path.resolve(__dirname, "src/index.html")
			}
		)
	],
	entry:   [path.resolve(__dirname, 'src/index.jsx')],
	output:  {
		path:     path.resolve(__dirname, "build"),
		filename: "bundle.js"
	},
	resolve: {
		extensions: [".js",".jsx"],
		alias:      {
			root: path.resolve(__dirname, "../../src"),
			assets: path.resolve(__dirname, "../../assets")
		}
	}
};
module.exports.serve = {
	content: [__dirname],
	add:     (app, middleware, options) => {
		const historyOptions = {
			rewrites: [
				{from: /\/*bundle.js$/, to: '/bundle.js'}
			],
			index:    '/index.html',
			logger:   console.log.bind(console)
		};
		app.use(convert(history(historyOptions)));
	}
}
