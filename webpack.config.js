var webpack = require('webpack');
const path = require('path');

module.exports = {
	//mode: 'production',
	mode: 'development',
	devtool: 'source-map',
	entry: {
		app: './src/js/main.js', // tell webpack which file should it be looking for to bundle it
		//vendors: './src/js/vendors/_vendor.js'
	},
	output: {
		path: path.resolve(__dirname, './dist/js/'),
		filename: '[name].js'
	},
	module: {
		rules: [
			{
				loader: 'babel-loader',
				query: {
					presets: [
						[
							'env',
							{
								targets: {
									browsers: ['last 2 versions', 'safari >= 7']
								}
							}
						]
					]
				},
				test: /\.js$/,
				exclude: /node_modules/
			}
		]
	},
	plugins: [
	]
};

// todo mocha testing after bundling
