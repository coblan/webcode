var pro_dir='D:/coblan/web/first'
var path = require( 'path' );

module.exports = {
	context:pro_dir,
    entry: {
	    'blog/static/js/blog':'./blog/static/js/blog.js',
	    'blog/static/admin/blog_ck':'./blog/static/admin/blog_ck.js'
	    },
    output: {
	    path:pro_dir,
        filename: '[name].pack.js'
    },
   
    resolve: {
	  root: [
	    path.resolve('D:/coblan/webpack/'),
	  ],
	  extensions: ['', '.js']
	},

	externals: {
    	'angular': true,
    	'jquery':true,
	},
	watch: true,
};