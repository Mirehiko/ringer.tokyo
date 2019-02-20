// Basic vars
const path = require('path');
const webpack = require('webpack');

// additional plugins
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin'); //minify js
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

var isProduction = (process.env.NODE_ENV === 'production');

module.exports = {
	context: path.resolve(__dirname, 'src'),
	entry: {
		mousewheel: [
			'./js/scripts/jquery-mousewheel-3.1.12/jquery.mousewheel.js',
		],
		common: [
			'./css/main.css',
			'./css/header.css',
			'./js/bundles/common.js',
		],
		talent: [
			'./css/talent.css',
		],
		news: [
			'./css/news.css',
		],
		homepage: [
			'./js/bundles/homepage.js',
			'./css/index.css',
		],
		workpage: [
			'./js/bundles/workpage.js',
			'./css/works.css',
		],
		content: [
			'./css/content.css',
		],
		contact: [
			'./css/contact.css',
		],
	},
	output: {
		filename: 'js/[name].js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '../'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: '/node_modules/'
			},
			{
				test: /\.css$/,
				// test: /\.scss$/,
				use: [
					{ loader: MiniCssExtractPlugin.loader },
					{
						loader: "css-loader",
						options: { sourceMap: true }
					},
					// {
					// 	loader: "style-loader",
					// },
					{
						loader: "postcss-loader",
						options: { sourceMap: true, config: { path: 'src/js/postcss.config.js' } }
					},
				]
			},
			// images
			{
				test: /\.(png|gif|jpe?g)$/,
				loaders: [
					{
						loader: 'file-loader',
						options: {
							name: '[path][name].ext',
						},
					},
					'img-loader',
				]
			},
		]
	},
	devServer: {
		overlay: true,
		contentBase: './app'
	},
	devtool: (isProduction) ? '' : 'inline-source-map',
	plugins: [
		new MiniCssExtractPlugin({
			filename: "./css/[name].css",
			// filename: "./css/[name].css",
			// chunkFilename: "[id].css"
		}),

		new CleanWebpackPlugin(['dist']),

		new CopyWebpackPlugin([
			{ from:'./images', to: 'images' }
		],{
			ignore: [
				{ glob: 'system/*' }
			]
		}),

	],
};

// Production only
if ( isProduction ) {
	// module.exports.plugins.push(
	// 	new UglifyJSPlugin({
	// 		sourceMap: true
	// 	}),
	// ); not supports ES6
	module.exports['optimization'] = {
		minimizer: [new TerserPlugin()]
	}

	module.exports.plugins.push(
		new ImageminPlugin({
			test: /\.(png|jpe?g|gif|svg)$/
		}),
	);

	module.exports.plugins.push(
		new webpack.LoaderOptionsPlugin({
			minimize: true
		})
	);
}
