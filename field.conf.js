var path = require( 'path' );
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
//var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = 
{
    //context:__dirname,
    entry: {
        fields: './js/vuejs/fields.js',
        //file:'./js/vuejs/file.js'
        },
    output: {
        path:'./build',
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
	  loaders: [
	    {
	      test: /\.js$/,
	      exclude: /(node_modules|bower_components)/,
	      loader:'babel-loader',
	      //loader: 'babel', // 'babel-loader' is also a legal name to reference
	      query: {
			  presets: ['es2015'],
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
		//rules: [{
		//	test: /\.scss$/,
		//	use: [{
		//		loader: "style-loader" // creates style nodes from JS strings
		//	}, {
		//		loader: "css-loader" // translates CSS into CommonJS
		//	}, {
		//		loader: "sass-loader" // compiles Sass to CSS
		//	}]
		//}]
	
	},
	//plugins: [
	//	new UglifyJSPlugin()
	//]
}



