const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')


module.exports = {
	context: path.resolve(__dirname, 'src'),
	entry: {
		app: './js/index.js',
	},
	output: {
		filename: 'js/[name].js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '../'
	},
	module: {
		rules: [{
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: '/node_modules/'
		}, {
			test: /\.css$/,
			use: [
				MiniCssExtractPlugin.loader,
				{
					loader: "css-loader",
					options: { sourceMap: true }
				}, {
					loader: "postcss-loader",
					options: { sourceMap: true, config: { path: 'src/js/postcss.config.js' } }
				},
			]
		}]
	},
	devServer: {
		overlay: true
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "[name].css"
		})
	]
}

// const path = require('path')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//
//
// module.exports = {
// 	entry: {
// 		app: './src/index.js',
// 	},
// 	output: {
// 		filename: '[name].js',
// 		path: path.resolve(__dirname, './dist'),
// 		publicPath: '/dist'
// 	},
// 	module: {
// 		rules: [{
// 			test: /\.js$/,
// 			loader: 'babel-loader',
// 			exclude: '/node_modules/'
// 		}, {
// 			test: /\.css$/,
// 			use: [
// 				MiniCssExtractPlugin.loader,
// 				{
// 					loader: "css-loader",
// 					options: { sourceMap: true }
// 				}, {
// 					loader: "postcss-loader",
// 					options: { sourceMap: true, config: { path: 'src/js/postcss.config.js' } }
// 				},
// 			]
// 		}]
// 	},
// 	devServer: {
// 		overlay: true
// 	},
// 	plugins: [
// 		new MiniCssExtractPlugin({
// 			filename: "[name].css"
// 		})
// 	]
// }
//
