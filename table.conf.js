var path = require( 'path' );

module.exports = 
{
    //context:__dirname,
    entry: {
        table: './js/vuejs/table.js',
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
	      //loader:'babel-loader'
	      loader: 'babel', // 'babel-loader' is also a legal name to reference
	      query: {
	        presets: ['es2015']
	      }
	    },
	 //   {
		//   test: /.scss$/,
		//   loader: ExtractTextPlugin.extract('style', 'css!sass')
		//}
	    
	  ],
	
	}
}



