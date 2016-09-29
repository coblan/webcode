
//function import_ckeditor() {
//	document.write("<script src='/static/ckeditor/ckeditor.js'></script>")
//}

//ckEditor={
//		import:import_ckeditor,
//	}
//module.exports=ckEditor

export function use_ckeditor() {
	document.write('<script src="http://cdn.bootcss.com/ckeditor/4.5.10/ckeditor.js"></script>')
}

Vue.component('ckeditor',{
	template:`<div class='ckeditor'>
		    	<textarea class="form-control" class="form-control" name="ri" ></textarea>
	    	</div>`,
	props:{
		model:{
			twoWay:true
		},
		config:{
			default:'',
			coerce:function (val) {
				if(val=='complex'){
					return 'http://ocm6l2tt6.bkt.clouddn.com/config_complex.js'
				}else{
					return ''
				}
			}

		}
	},
	compiled:function () {
		editor = CKEDITOR.replace($(this.$el).find('textarea')[0],{customConfig:this.config})
		editor.setData(this.model)
		this.editor = editor
	},
	events:{
		'sync_data':function () {
			this.model=this.editor.getData()
		}
	}
})