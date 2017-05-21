var path = require( 'path' );
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = 
{
    //context:__dirname,
    entry: {
        table: './js/vuejs/table.js',
        //file:'./js/vuejs/file.js'
        },
    output: {
        path:path.resolve(__dirname, './build'),
        filename: '[name].pack.js'
    },
    
    //resolve: {
    //  root: [
    //    path.resolve('D:/coblan/webcode/js'),
    //    path.resolve(sub_root)
    //  ],
    //  extensions: ['', '.js']
    //},
    //externals: {
    //    'angular': true,
    //    'jquery':true,
    //},
    watch: true,
    //resolve: {
    //  root:[
    //  	path.resolve('D:\\try\\webpack'),
    //    //path.resolve('D:/coblan/webcode/js'),
    //    //path.resolve(sub_root)
    //  ],
    //  //fallback:'C:/Users/heyulin/AppData/Roaming/npm/',
    //  //extensions: ['', '.js']
    //},
    // resolveLoader: {
    //    fallback: 'C:/Users/heyulin/AppData/Roaming/npm/node_modules'
    //},
    //plugins: [
    //    new ExtractTextPlugin("styles.css")
    //],
    module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader:'babel-loader',
				query: {
					presets: ['es2015']
				}
			},
			{
				test: /\.scss$/,
				use: [{
					loader: "style-loader" // creates style nodes from JS strings
				}, {
					loader: "css-loader" // translates CSS into CommonJS
				}, {
					loader: "postcss-loader", // translates CSS into CommonJS
					options: {
						plugins: function () {
							return [
								//require('precss'),
								require('autoprefixer')
							];
						}
					}
				},{
					loader: "sass-loader" // compiles Sass to CSS
				}]
			}

		],
	
	},
	//plugins: [
	//	new UglifyJSPlugin()
	//]
}



