var webpack = require('webpack');
var path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const history = require('connect-history-api-fallback');
const convert = require('koa-connect');

module.exports = {
  mode:    "development",
	devtool: "eval-source-map",
  module:  {
    rules: [
      {test: /\.js$/, loaders: ['babel-loader']},
      {test: /\.jsx?$/, enforce: "pre", loaders: ['svenjsx-loader']}
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
    path:     path.resolve(__dirname, "docs"),
	  libraryTarget: 'umd',
    filename: "bundle.js"
  },
  resolve: {
    extensions: [".js", ".jsx", ".css"],
    alias:      {
      root:   path.resolve(__dirname, "../../src"),
      assets: path.resolve(__dirname, "../../assets")
    }
  }
};
