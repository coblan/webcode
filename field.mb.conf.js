var path = require( 'path' );
//var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports =
{
    //context:__dirname,
    entry: {
        fields_mb: './js/mobile/fields.js',
        //file:'./js/vuejs/file.js'
    },
    output: {
        path:'./build',
        filename: '[name].pack.js'
    },

    watch: true,

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

    }
}



