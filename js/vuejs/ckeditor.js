
//function import_ckeditor() {
//	document.write("<script src='/static/ckeditor/ckeditor.js'></script>")
//}

//ckEditor={
//		import:import_ckeditor,
//	}
//module.exports=ckEditor

//export function use_ckeditor() {
//	document.write('<script src="//cdn.bootcss.com/ckeditor/4.5.10/ckeditor.js"></script>')
//}


window.ck_complex = {
	// Define changes to default configuration here.
	// For complete reference see:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// The toolbar groups arrangement, optimized for two toolbar rows.
	toolbarGroups : [
		{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
		{ name: 'links' },
		{ name: 'insert' },
		{ name: 'forms' },
		{ name: 'tools' },
		{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'others' },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
		{ name: 'styles' },
		{ name: 'colors' },
		{ name: 'about' },
	],



	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.
	removeButtons : 'Underline,Subscript,Superscript',

	// Set the most common block elements.
	format_tags : 'p;h1;h2;h3;pre',

	// Simplify the dialog windows.
	removeDialogTabs : 'image:advanced;link:advanced',
	image_previewText:'image preview',
	filebrowserImageUploadUrl: '/ckeditor/upload_image',
	extraPlugins : 'justify,codesnippet,lineutils,mathjax,colorbutton', //autogrow,
	mathJaxLib : '//cdn.mathjax.org/mathjax/2.6-latest/MathJax.js?config=TeX-AMS_HTML',
	extraAllowedContent :'img[class]',
	//autoGrow_maxHeight : 800,
	//autoGrow_onStartup:true,
	//autoGrow_bottomSpace:100,
	height:800,
};


Vue.component('ckeditor',{
	template:`<div class='ckeditor'>
		    	<textarea class="form-control" name="ri" ></textarea>
	    	</div>`,
	props:{
		value:{},
		config:{},
		set:{
			default:'complex',
		}
	},
	created:function(){
		var self=this
		bus.$on('sync_data',function(){
			self.$emit('input',self.editor.getData())
		})
	},
	mounted:function () {
		var self=this
		self.input=$(this.$el).find('textarea')[0]
		var config_obj={
			//'complex':'//res.enjoyst.com/js/ck/config_complex.js',
			'complex':ck_complex,
		}
		var config={}
		ex.assign(config,config_obj[self.set]) 
		ex.assign(config,self.config)

		ex.load_js('//cdn.bootcss.com/ckeditor/4.6.2/ckeditor.js',function(){
			CKEDITOR.timestamp='ABCDFDGff'
			var editor = CKEDITOR.replace(self.input,config)
			editor.setData(self.value)
			self.editor = editor

			//var is_changed=false
			//editor.on( 'change', function( evt ) {
			//	// getData() returns CKEditor's HTML content.
			//	is_changed=true
			//	//self.$emit('input',editor.getData())
			//});
            //
			//setInterval(function(){
			//	if(is_changed){
			//		self.$emit('input',editor.getData())
			//		is_changed=false
			//	}
			//},3000)
		})

	},
	//events:{
	//	'sync_data':function () {
	//		this.model=this.editor.getData()
	//	}
	//}
})

