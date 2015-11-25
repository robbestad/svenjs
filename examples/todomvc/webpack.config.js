'use strict';

var webpack = require('webpack');
var path = require('path');

var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({compress: {warnings: false},minimize: true})
];

module.exports = {
  module: {
    preLoaders: [
      { test: /\.js$/, loaders: ['svenjsx-loader'], exclude: /node_modules/ },
    ],
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  },
  entry: ['webpack/hot/dev-server','webpack-dev-server/client?http://localhost:3000', path.join(__dirname,'src/index.js')],
  output: {
    library: 'Svenjs',
    libraryTarget: 'umd',
    path: 'bundle.js'
  },
  plugins: plugins,
  resolve: {
    extensions: ['', '.js']
  }
};
