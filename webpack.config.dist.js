'use strict';

var webpack = require('webpack');
var path = require('path');
var nodeRoot = path.resolve(__dirname, "node_modules");

var plugins = [
	new webpack.DefinePlugin({
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
	}),
	new webpack.optimize.OccurenceOrderPlugin()
];

if (process.env.NODE_ENV === 'production') {
	plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				screw_ie8: true,  // don't care about full compliance with Internet Explorer 6-8 quirks
				sequences: true,  // join consecutive statemets with the “comma operator”
				properties: true,  // optimize property access: a["foo"] → a.foo
				dead_code: true,  // discard unreachable code
				drop_debugger: true,  // discard “debugger” statements
				unsafe: false, // some unsafe optimizations (see below)
				conditionals: true,  // optimize if-s and conditional expressions
				comparisons: true,  // optimize comparisons
				evaluate: true,  // evaluate constant expressions
				booleans: true,  // optimize boolean expressions
				loops: true,  // optimize loops
				unused: true,  // drop unused variables/functions
				hoist_funs: true,  // hoist function declarations
				hoist_vars: false, // hoist variable declarations
				if_return: true,  // optimize if-s followed by return/continue
				join_vars: true,  // join var declarations
				cascade: true,  // try to cascade `right` into `left` in sequences
				side_effects: true,  // drop side-effect-free statements
				warnings: true,  // warn about potentially dangerous optimizations/code
				drop_console: true,  // discard console statements
			}
		})
	);
}
/*
 var commonsPlugin =
 new webpack.optimize.CommonsChunkPlugin('common.js');
 plugins.push(commonsPlugin);
 */
var config = {
	devtool: 'source-map',
	module: {
		preLoaders: [
			{test: /\.js$/, loaders: ['svenjsx-loader'], exclude: /node_modules/}
		],
		loaders: [
			{test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/}
		]
	},
	entry: [
		'./es5/index'
	],
	output: {
		library: 'Svenjs',
		libraryTarget: 'umd'
	},
	plugins: plugins,
	resolve: {
		root: [path.resolve(__dirname, "src")]
	},
	extensions: ['', '.js']
};
if (process.env.NODE_ENV !== 'production') {
	config.devtool = 'sourcemap';
	config.output = {
		publicPath: "/assets/",
		path: "./build/assets",
		filename: 'index.min.js'
	};
	config.noParse = [
		nodeRoot,
		path.resolve(__dirname, 'build/assets/')
	];
}
else {
	config.output = {
		path: path.join(__dirname, 'assets'),
		filename: 'index.js'
	};
}

module.exports = config;
