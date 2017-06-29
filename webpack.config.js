'use strict';

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin('../css/index.css');
const extractHTML = new ExtractTextPlugin('../html/index.php');

const NODE_ENV = process.env.NODE_ENV || "dev";
const MIN = (NODE_ENV == "dev") ? false : true;

module.exports = {
	context: __dirname + '/dev',

	entry: {
    index: './js/index'
	},

	output: {
		path: __dirname + '/prod/js',
		filename: '[name].js',
		library: '[name]'
	},

	watch: NODE_ENV == "dev",

	watchOptions: {
		aggregateTimeout: 100
	},

	devtool: NODE_ENV == "dev" ? "source-map" : false,

	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.DefinePlugin({
			NODE_ENV: JSON.stringify(NODE_ENV)
		})
	],

	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			use: [{
				loader: 'babel-loader',
				options: {
					presets: ['es2015']
				}
			}]
		},{
			test: /\.pug$/,
			use: extractHTML.extract({
				use: ['html-loader', 'pug-html-loader']
			})
		},{
			test: /.html$/,
			use: [{
				loader: 'html-loader',
				options: {
					minimize: MIN,
	        removeComments: MIN,
	        collapseWhitespace: MIN
				}
			}]
		},{
			test: /.scss$/,
			use: extractCSS.extract({
				use: ['css-loader', 'sass-loader']
			})
		}]
	},

	plugins: [
		extractCSS,
		extractHTML,
		new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery'
    })
	]
};

if(NODE_ENV == "prod"){
	module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings:     false,
        drop_console: true,
        unsafe:       true
      }
    })
  );
}
