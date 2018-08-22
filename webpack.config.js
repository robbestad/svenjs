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
		// libraryTarget: 'umd',
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


// 'use strict';
//
// var webpack = require('webpack');
// var path = require('path');
// var nodeRoot = path.resolve(__dirname, "node_modules");
//
// var plugins = [
//   new webpack.DefinePlugin({
//     'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
//   })
// ];
//
// /*
//  var commonsPlugin =
//  new webpack.optimize.CommonsChunkPlugin('common.js');
//  plugins.push(commonsPlugin);
//  */
// var config = {
//   mode: "production",
//   devtool: 'source-map',
// 	module:  {
// 		rules: [
// 			{test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/},
// 			{test: /\.jsx$/,  loaders: ['svenjsx-loader'], exclude: /node_modules/}
// 		]
// 	},
//   entry: [
//     './src/index'
//   ],
//   output: {
//     library: 'Svenjs',
//     libraryTarget: 'umd'
//   },
//   plugins: plugins,
// 	resolve: {
// 		extensions: [".js", ".jsx", ".css"],
// 		alias:      {
// 			root: path.resolve(__dirname, "src")
// 		}
// 	}
// };
// // if (process.env.NODE_ENV !== 'production') {
// //   config.devtool = 'sourcemap';
// //   config.output = {
// //     publicPath: "/assets/",
// //     path: "./build/assets",
// //     filename: 'index.min.js'
// //   };
// //   config.noParse = [
// //     nodeRoot,
// //     path.resolve(__dirname, 'build/assets/')
// //   ];
// // }
// // else {
// //   config.output = {
// //     path: path.join(__dirname, 'assets'),
// //     filename: 'index.js'
// //   };
// // }
//
// module.exports = config;
