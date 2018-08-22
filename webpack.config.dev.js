'use strict';

var webpack = require('webpack');

var plugins = [
	new webpack.DefinePlugin({
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
	})
];

module.exports = {
	mode:    "development",
	module:  {
		rules: [
			{test: /\.js$/, enforce: 'pre', loaders: ['svenjsx-loader'], exclude: /node_modules/},
			{test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/}
		]
	},
	output:  {
		library:       'Svenjs',
		libraryTarget: 'umd'
	},
	plugins: plugins,
	resolve: {
		extensions: [".js", ".jsx", ".css"],
		alias:      {
			src: path.resolve(__dirname, "src")
		}
	}
};
