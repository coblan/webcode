var path = require( 'path' );

const ExtractTextPlugin = require("extract-text-webpack-plugin");
//const extractSass = new ExtractTextPlugin({
//    filename: "[name].[contenthash].css",
//    //disable: process.env.NODE_ENV === "development"
//});

module.exports =
{
    //context:__dirname,
    entry: {
        general: './css/general.js',
        //file:'./js/vuejs/file.js'
    },
    output: {
        path:'./build',
        filename: '[name].pack.js'
    },
    //resolve: {
    //    modules: [path.resolve('./css'),"node_modules"]
    //},
    //resolve: {
    //? root: [
    //??? path.resolve('D:/coblan/webcode/js'),
    //??? path.resolve(sub_root)
    //? ],
    //? extensions: ['', '.js']
    //},
    //externals: {
    //??? 'angular': true,
    //??? 'jquery':true,
    //},
    watch: true,
    //resolve: {
    //? root:[
    //????? path.resolve('D:\\try\\webpack'),
    //??? //path.resolve('D:/coblan/webcode/js'),
    //??? //path.resolve(sub_root)
    //? ],
    //? //fallback:'C:/Users/heyulin/AppData/Roaming/npm/',
    //? //extensions: ['', '.js']
    //},
    // resolveLoader: {
    //??? fallback: 'C:/Users/heyulin/AppData/Roaming/npm/node_modules'
    //},
    plugins: [
        new ExtractTextPlugin("styles.css")
    ],
    module: {
        //rules: [
        //    {
        //        test: /.js$/,
        //        use: [
        //            { loader: 'babel-loader' }
        //        ],
        //    },
        //    {
        //        test: /.less$/,
        //        loader: ExtractTextPlugin.extract({
        //            fallbackLoader: 'style-loader',
        //            loader: "css-loader!less-loader",
        //        }),
        //    },
        //],
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader:'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },

            {
                test: /.scss$/,
                loader: ExtractTextPlugin.extract({ loader:[ 'css-loader', 'sass-loader'], fallbackLoader: 'style-loader' })
                //ExtractTextPlugin.extract('style', 'css!sass')
            }


        ],

        //rules: [{
        //    test: /\.scss$/,
        //    loader: extractSass.extract({
        //        loader: [{
        //            loader: "css-loader"
        //        }, {
        //            loader: "sass-loader"
        //        }],
        //        // use style-loader in development
        //        fallbackLoader: "style-loader"
        //    })
        //}]

    }
}