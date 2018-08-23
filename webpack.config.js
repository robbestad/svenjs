var webpack = require('webpack');
var path = require('path');

module.exports = {
	mode:    "production",
	module:  {
		rules: [
			{test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/},
			{test: /\.jsx$/, enforce: "pre", loaders: ['svenjsx-loader'], exclude: /node_modules/}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
		})
	],
	entry:   [path.resolve(__dirname, 'src/index.js')],
	output:  {
		library:       'Svenjs',
		libraryTarget: 'commonjs-module',
		path:          path.resolve(__dirname, "dist"),
		filename:      "index.js"
	},
	resolve: {
		extensions: [".js", ".jsx"],
		alias:      {
			root: path.resolve(__dirname, "src")
		}
	}
};
