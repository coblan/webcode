var path = require( 'path' );

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
    module: {
	  loaders: [
	    {
	      test: /\.js$/,
	      exclude: /(node_modules|bower_components)/,
	      loader: 'babel', // 'babel-loader' is also a legal name to reference
	      query: {
	        presets: ['es2015']
	      }
	    },
	  ],
	
	}
}



