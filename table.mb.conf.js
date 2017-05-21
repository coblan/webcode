var path = require( 'path' );

module.exports =
{
    //context:__dirname,
    entry: {
        table_mb: './js/mobile/table.js',
        //file:'./js/vuejs/file.js'
    },
    output: {
        path:path.resolve(__dirname, './build'),
        filename: '[name].pack.js'
    },

    watch: true,

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

    }
}



