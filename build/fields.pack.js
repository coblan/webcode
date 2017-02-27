/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = hook_ajax_msg;
/* harmony export (immutable) */ __webpack_exports__["b"] = hook_ajax_csrf;
/* harmony export (immutable) */ __webpack_exports__["c"] = show_upload;
/* harmony export (immutable) */ __webpack_exports__["d"] = hide_upload;
/**
 * Created by zhangrong on 2016/8/6.
 */

/*
新增一个wrap函数，用户封装调用函数
*/
//function proc_msg(func) {
//	function _inn(data) {
//		if(data.status && data.status!='success'){
//			if(data.msg){
//				alert(data.msg)
//			}
//		}else{
//			func(data)
//		}
//	}
//	return _inn
//}

//function has_error(data) {
//	if(data.status && data.status!='success'){
//		if(data.msg){
//			alert(data.msg)
//		}
//		return true
//	}else{
//		return false
//	}
//}



//var org_get=$.get
//$.get=function (url,callback) {
//	var wrap_callback=function (resp) {
//		if(resp.msg){
//			alert(resp.msg)
//		}
//		if(resp.status && resp.status!='success'){
//			return
//		}else{
//			callback(resp)
//		}
//	}
//	org_get(url,wrap_callback)
//}
//var org_post=$.post
//$.post=function (url,data,callback) {
//	var wrap_callback=function (resp) {
//		if(resp.msg){
//			alert(resp.msg)
//		}
//		if(resp.status && resp.status!='success'){
//			return
//		}else{
//			callback(resp)
//		}
//	}
//	org_post(url,data,wrap_callback) 
//}


//function def_proc_port_msg(data,event) {
//	var rt = data.responseJSON
//        if(rt && rt.msg){
//            alert(rt.msg)
//        }
//}

function def_proc_error(jqxhr) {
	if(! window.iclosed){
			if(jqxhr.status !=0){
				alert('server has error, error code is '+jqxhr.status)
			}else{
				alert('maybe server offline,error code is '+jqxhr.status)
			}

		}
}

//window.__proc_port_error=def_proc_port_msg
window.__proc_ajax_error=def_proc_error

function hook_ajax_msg(proc_port_error,proc_ajax_error){
	if(proc_port_error){window.__proc_port_error=proc_port_error}
	if(proc_ajax_error){window.__proc_ajax_error=proc_ajax_error}
	if(window.hook_ajax_msg_mark){
		return
	}
	window.hook_ajax_msg_mark = true
	$(window).bind('beforeunload',function () {
		window.iclosed=true
	})
	
    //$(document).ajaxSuccess(function (event,data) {
    //    window.__proc_port_error(data,event)
    //})
     $(document).ajaxError(function (event,jqxhr, settings, thrownError) {
		window.__proc_ajax_error(jqxhr)
	})
	//hook_ajax_csrf()
}

function hook_ajax_csrf() {
		// needed in django context,because django has csrf system enabled by default
	// used for fetch and generate CSRF code for POST ,used with django CSRF middleware
	function getCookie(name) {
	    var cookieValue = null;
	    if (document.cookie && document.cookie !== '') {
	        var cookies = document.cookie.split(';');
	        for (var i = 0; i < cookies.length; i++) {
	            var cookie = jQuery.trim(cookies[i]);
	            // Does this cookie string begin with the name we want?
	            if (cookie.substring(0, name.length + 1) === (name + '=')) {
	                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
	                break;
	            }
	        }
	    }
	    return cookieValue;
	}
	var csrftoken = getCookie('csrftoken');
	function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
	}
	$.ajaxSetup({
	    beforeSend: function(xhr, settings) {
	        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
	            xhr.setRequestHeader("X-CSRFToken", csrftoken);
	        }
	    }
	});
}



function show_upload(){
	$('#load_wrap').show()
}
function hide_upload(second){
	if(second){
		setTimeout(function () {
			$('#load_wrap').hide()
		}, second);
	}else{
		$('#load_wrap').hide()
	}
}

ex.load_css('//cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css')
//if(!window.__font_awesome){
//	window.__font_awesome=true
//	document.write(`<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">`)
//}

if(!window.__uploading_mark){
	window.__uploading_mark=true
	document.write(`
		<style>
		.popup{
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			display:none;
			z-index: 9000;
		}
		#_upload_inn{
			background: rgba(88, 88, 88, 0.2);
			border-radius: 5px;
			width:180px;
			height:120px;
			z-index: 9500;
			/*padding:30px 80px ;*/
		}
		.imiddle{
		    position: absolute;
	        top: 50%;
	        left: 50%;
	        transform: translate(-50%, -50%);
	        -ms-transform:translate(-50%, -50%); 	/* IE 9 */
			-moz-transform:translate(-50%, -50%); 	/* Firefox */
			-webkit-transform:translate(-50%, -50%); /* Safari 和 Chrome */
			-o-transform:translate(-50%, -50%); 
			
	        text-align: center;
			/*display: table;*/
	        z-index: 10000;
    	}
    	#_upload_mark{
    		float: left;

    	}
		</style>`)
	$(function(){
		$('body').append(`<div class="popup" id="load_wrap"><div id='_upload_inn' class="imiddle">
		<div  id="_upload_mark" class="imiddle"><i class="fa fa-spinner fa-spin fa-3x"></i></div></div></div>`)
	})
}



/***/ }),
/* 1 */
/***/ (function(module, exports) {


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


var ck_complex = {
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
		{name:'font'},
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
	imageUploadUrl:'/ckeditor/upload_image',
	filebrowserImageUploadUrl: '/ckeditor/upload_image', // Will be replace by imageUploadUrl when upload_image
	extraPlugins : 'justify,codesnippet,lineutils,mathjax,colorbutton,uploadimage,font,autogrow', //autogrow,
	mathJaxLib : '//cdn.mathjax.org/mathjax/2.6-latest/MathJax.js?config=TeX-AMS_HTML',
	extraAllowedContent :'img[class]',
	autoGrow_maxHeight : 600,
	autoGrow_minHeight:200,
	autoGrow_onStartup:true,
	autoGrow_bottomSpace:50,
	//height:800,
};


Vue.component('ckeditor',{
	template:`<div class='ckeditor'>
		    	<textarea class="form-control" name="ri" ></textarea>
	    	</div>`,
	props:{
		value:{},
		config:{},
		set:{
			default:'edit',
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
			'edit':edit_level,
		}
		var config={}
		ex.assign(config,config_obj[self.set]) 
		ex.assign(config,self.config)
		// 4.5.10   4.6.2
		ex.load_js('//cdn.bootcss.com/ckeditor/4.6.2/ckeditor.js',function(){
			//CKEDITOR.timestamp='GABCDFDGff'
			//self.input.value=self.value

			var editor = CKEDITOR.replace(self.input,config)
			editor.setData(self.value)
			editor.checkDirty()
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


var edit_level = {
	// Define changes to default configuration here.
	// For complete reference see:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// The toolbar groups arrangement, optimized for two toolbar rows.
	toolbarGroups : [
		//{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
		//{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
		{ name: 'tools' },

		//'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
		{ name: 'styles' },
		{name:'font'},
		{ name: 'colors' },

		{ name: 'links' },
		{ name: 'insert' },
		{ name: 'forms' },

		{ name: 'others' },
		{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
		//{ name: 'about' },
	],



	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.
	removeButtons : 'Underline,Subscript,Superscript',

	// Set the most common block elements.
	format_tags : 'p;h1;h2;h3;pre',

	// Simplify the dialog windows.
	removeDialogTabs : 'image:advanced;link:advanced',
	image_previewText:'image preview',
	imageUploadUrl:'/ckeditor/upload_image',
	filebrowserImageUploadUrl: '/ckeditor/upload_image', // Will be replace by imageUploadUrl when upload_image
	extraPlugins : 'justify,lineutils,colorbutton,uploadimage,font,autogrow', //,mathjax,codesnippet
	//mathJaxLib : '//cdn.mathjax.org/mathjax/2.6-latest/MathJax.js?config=TeX-AMS_HTML',
	extraAllowedContent :'img[class]',
	autoGrow_maxHeight : 600,
	autoGrow_minHeight:200,
	autoGrow_onStartup:true,
	autoGrow_bottomSpace:50,
	//height:800,
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/*

主要内容
========
fl
    包含可以操作file对象的函数，例如上传upload,批量上传uploads.

file-input
    该组件用户收集用户输入。只能返回file list 。所以，如果使用upload上传文件，必须取 [0] 第一个file对象。

img-uploador
    图片选择，自动上传。

多个文件上传步骤
==============

1. Vue.data设置
 data:{
    files:[],
 },

2. 在html中插入Vue组件 <file-input id='jjyy' v-model='files' multiple></file-input>

3. 在Methods中上传
fl.uploads(files,url,function(resp){  // url 可以忽略，默认url为 /face/upload
    resp ....
})

单个文件
=======
1.Vue.data设置
 data:{
    files:[],
 },

2. 在html中插入Vue组件 <file-input id='jjyy' v-model='files'></file-input>

3. 在Methods中上传
 fl.uploads(this.files[0],url,function(resp){
    resp ....
 })

.. Note:: 默认上传url是/face/upload ，该接口返回的是 file_url_list。

上传进度
=========
进度只是上传进度，判断文件是否被后端接收成功，需要判断是否success回调被调用。
 fl.upload(this.file2[0],'/face/upload',function(url_list){

 },function(progress){
    console.log(progress)
 })

预览图片
=========
从file-input读出数据，然后赋予图片的src ::

    f1.read(this.files[0],function (data) {
            $('#haha')[0].src = data
    }


上传图片
==========

<img-uploador v-model='xxx_url_variable'></img-uploador>   //默认上传，使用的是 fl.upload默认地址 /face/upload
<img-uploador v-model='xxx_url_variable' up_url='xxx'></img-uploador>

具备裁剪性质:

 <img-uploader v-model='xxx' :config='{crop:true,aspectRatio: 8 / 10}'></img-uploader>


样式技巧
========
1. 自定义样式

    <file-inpu>不支持直接自定义样式。但是可以通过其他方式自定义。最简单的方式是：

    * 隐藏<file-input> ，
    * 然后触发其click事件('.file-input').click()

*/



__webpack_require__(11)


var fl={
	read:function (file,callback) {
        // 读完文件后，调用callback
		var reader = new FileReader();
    	reader.onloadend = function () {
	        // 图片的 base64 格式, 可以直接当成 img 的 src 属性值
	        var dataURL = reader.result;
	        //var img = new Image();
	        //img.src = dataURL;
	        // 插入到 DOM 中预览
	        //$('#haha')[0].src=dataURL
	        callback(dataURL) 
	    };
	    reader.readAsDataURL(file); // 读出 base64
	},
	upload:function (file,url,success,progress) {
            if(ex.is_fun(url)){
                var progress = success
                var success = url
                var url='/face/upload'
            }else{
                var url=url||'/face/upload'
            }

            var fd = new FormData();
            fd.append('file',file);
            $.ajax({
                url:url,
                type:'post',
                data:fd,
                contentType: false,
                success:success,
                //success:function (data) {
                //    success(data)
                //},
                processData:false, 
		       xhr:function() {
			        var xhr = new window.XMLHttpRequest();
			        xhr.upload.addEventListener("progress", function(evt) {
			            if (progress && evt.lengthComputable) {
			                var percentComplete = evt.loaded / evt.total;
                            progress(percentComplete)
			                //console.log('进度', percentComplete);
			            }
			        }, false);

			        return xhr;
			}
		})
	},
	uploads:function (files,url,success,progress) {
            if(ex.is_fun(url)){
                var progress = success
                var success = url
                var url='/face/upload'
            }else{
                var url=url||'/face/upload'
            }

        	var fd = new FormData();
        	for(var x=0;x<files.length;x++){
	        	var file=files[x]
	        	 fd.append(file.name,file);
        	}
            $.ajax({
                url:url,
                type:'post',
                data:fd,
                contentType: false,
                success:success,
                processData:false, 
		       xhr:function() {
			        var xhr = new window.XMLHttpRequest();
			        xhr.upload.addEventListener("progress", function(evt) {
			            if (progress &&evt.lengthComputable) {
			                var percentComplete = evt.loaded / evt.total;
                            progress(percentComplete)
			                //console.log('进度', percentComplete);
			            }
			        }, false);

			        return xhr;
				}
			})
        }
}

file_input= {
    template: "<input class='file-input' type='file' @change='on_change($event)'>",
    props: ['value'],
    data: function () {
        return {
            files: []
        }
    },
    watch: {
        value: function (v) {
            // when input clear selected file, Component file-input need clear too.
            // Brower prohebit to set to Un-none string
            if (v == '') {
                this.$el.value = v
            }
        }
        ,
    },
    methods: {
        on_change: function (event) {
            this.files = event.target.files
            this.$emit('input', this.files)
        },
    }
}

Vue.component('file-input',file_input)


/*
<img-uploader v-model='xxx'></img-uploader>
 <img-uploader v-model='xxx' :config='{crop:true,aspectRatio: 8 / 10}'></img-uploader>
*/

img_uploader={
    props:['value','up_url','config'],
    data:function(){
        return {
            img_files:'',
            url:this.value,
        }
    },
    computed:{
        is_crop:function(){
            return this.config && this.config.crop
        },
        crop_config:function(){
            if(this.config && this.config.crop){
                var temp_config=ex.copy(this.config)
                delete temp_config.crop
                return temp_config
            }else{
                return {}
            }
        }
    },
    template:`
          <div class='up_wrap logo-input img-uploader'>
            <file-input v-if="!is_crop"
                accept='image/gif,image/jpeg,image/png'
                v-model= 'img_files'>
            </file-input>
            <img-crop class='input' v-if='is_crop' v-model='img_files' :config="crop_config">
            </img-crop>
            <div style="padding: 40px" @click="select()">
                <a class='choose'>Choose</a>
            </div>
            <div v-if='url' class="closeDiv">
            <div class="close" @click='clear()'>X</div>
            <img :src="url" alt="" class="logoImg">
            </div>
            </div>
        `,
    watch:{
        img_files:function(v){
            var self=this
            fl.upload(v[0],this.up_url,function(url_list){
                self.url=url_list[0]
                self.$emit('input',self.url)
            })
        }
    },
    methods:{
        clear:function () {
            this.img_files=''
            this.url=''
            this.$emit('input','')
            //$(this.$el).find('input[type=file]').val('')
            //$('#'+this.id).val('')
        },
        select:function(){
            $(this.$el).find('input[type=file]').click()
        }
    }
}

Vue.component('img-uploador',img_uploader)


/*
具备裁剪功能
==============

*  <img-crop v-model='xxx' :config='{aspectRatio: 8 / 10}'></img-crop>
*
*  上传:
*  ======
*  fl.upload(xxx[0],function(urls){
*         ...
*  ))
* */

img_crop={
    template: `<div class="img-crop">
    <input class='img-crop' type='file' @change='on_change($event)'
            accept='image/gif,image/jpeg,image/png'>
    <modal v-show='cropping' >
        <div class="total-wrap" style="width:80vw;height: 80vh;background-color: white;">
            <div class="crop-wrap">
                <img class="crop-img" :src="org_img" >

            </div>

            <button @click="rotato_90()">rotato 90</button>
            <button @click="zoom_in()">zoom in</button>
            <button @click="zoom_out()">zoom out</button>
            <button @click="make_sure()">确定</button>
            <button @click="cancel()">取消</button>

        </div>
    </modal>
    </div>`,
    props: ['value','config'],
    data: function () {
        var inn_config={
            size:{}
        }
        ex.assign(inn_config,this.config)

        return {
            files: [],
            org_img:'',
            cropping:false,
            inn_config:inn_config
        }
    },
    mounted:function(){
        ex.load_css('http://cdn.bootcss.com/cropper/2.3.4/cropper.min.css')
        ex.load_js('http://cdn.bootcss.com/cropper/2.3.4/cropper.min.js')
    },
    watch: {
        value: function (v) {
            // when input clear selected file, Component file-input need clear too.
            // Brower prohebit to set to Un-none string
            if (v == '') {
                this.$el.value = v
            }

        }
        ,
    },

    methods: {
        cancel:function(){
            this.cropping=false
            $(this.$el).find('input[type=file]').val('')
        },
        zoom_in:function(){
            $(this.$el).find('.crop-img').cropper('zoom', 0.1);
        },
        zoom_out:function(){
            $(this.$el).find('.crop-img').cropper('zoom', -0.1);
        },
        rotato_90:function(){
            $(this.$el).find('.crop-img').cropper('rotate', 90);
        },
        move_img:function(){
            $(this.$el).find('.crop-img').cropper('setDragMode','move')
        },
        move_crop:function(){
            $(this.$el).find('.crop-img').cropper('setDragMode','crop')
        },
        on_change: function (event) {
            var self=this
            this.cropping=true
            var img_file = event.target.files[0]
            //fl.read(img_file)
            //this.$emit('input', this.files)
            fl.read(img_file,function (data) {
                self.org_img = data
                Vue.nextTick(function(){
                    self.init_crop()
                })
            })
        },
        init_crop:function(){
            //$(this.$el).find('.crop-img').cropper({
            //    aspectRatio: 8 / 10,
            //});
            if(this.inn_config.aspectRatio){
                $(this.$el).find('.crop-img').cropper({aspectRatio:this.inn_config.aspectRatio});
            }

            $(this.$el).find('.crop-img').cropper('replace',this.org_img)
            $(this.$el).find('.crop-img').cropper('setDragMode','move')
        },
        make_sure:function(){
            var self=this
            // Upload cropped image to server if the browser supports `HTMLCanvasElement.toBlob`

            $(this.$el).find('.crop-img').cropper('getCroppedCanvas',this.inn_config.size).toBlob(function (blob) {
                //var formData = new FormData();
                self.$emit('input',[blob])
                self.cropping=false

            });
        }
    }

}

Vue.component('img-crop',img_crop)





/*
* 下面是为了老代码的兼容性，以后不会用了。
*
*/

Vue.component('file-obj',{
    template:"<input model='filebody' type='file' @change='changed'>",
    props:{
        up_url:{
            type: String,
            required: true
        },
        //url:{
        //    type: String,
        //    twoWay:true
        //},
        ready:{}
    },
    methods:{
        changed:function (changeEvent) {
            var file=changeEvent.target.files[0];
            if(!file)
                return
            this.fd = new FormData();
            this.fd.append('file', file);
            this.ready=true;
            this.upload()
        },
        upload:function () {
            var self =this;
            $.ajax({
                url:this.up_url,
                type:'post',
                data:this.fd,
                contentType: false,
                cache: false,
                success:function (data) {
                    if(data.url){
                        self.$dispatch('rt_url',data.url)
                    }

                    //alert(data);
                    //self.url=data.url;
                    //self.$emit('url.changed',data.url)
                },
                //error:function (data) {
                //	alert(data.responseText)
                //},
                processData:false
            })
        }
    }
})


    Vue.component('logo-input',{
        props:['up_url','web_url','id'],
        template:`
          <div class='up_wrap logo-input'>
            <file-obj :id='id'
                accept='image/gif,image/jpeg,image/png'
                :up_url='up_url'
                @rt_url= 'get_web_url'>
            </file-obj>
            <div style="padding: 40px">
                <a class='choose'>Choose</a>
            </div>
            <div v-if='web_url' class="closeDiv">
            <div class="close" @click='clear()'>X</div>
            <img :src="web_url" alt="" class="logoImg">
            </div>
            </div>
        `,
        methods:{
            get_web_url:function(e){
                this.web_url=e
            },
            clear:function () {
                this.web_url=''
                $('#'+this.id).val('')
            }
        }
    })



//  if(!window._logo_input_css){
//      document.write(`
//
//<style type="text/css" media="screen" >

/*.img-uploader input{*/
    /*display: none;*/
/*}*/

/*.up_wrap{*/
    /*position: relative;*/
    /*text-align: center;*/
    /*border: 2px dashed #ccc;*/
    /*background: #FDFDFD;*/
    /*width:300px;*/
/*}*/

/*.closeDiv{*/
    /*width: 100%;*/
    /*height: 100%;*/
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 0;*/
    /*background-color: #ffffff;*/
/*}*/
/*.choose{*/
    /*display: inline-block;*/
    /*text-decoration: none;*/
    /*padding: 5px;*/
    /*border: 1px solid #0092F2;*/
    /*border-radius: 4px;*/
    /*font-size: 14px;*/
    /*color: #0092F2;*/
    /*cursor: pointer;*/
/*}*/
/*.choose:hover,.choose:active{*/
    /*text-decoration: none;*/
    /*color: #0092F2;*/
/*}*/
/*.close{*/
    /*position: absolute;*/
    /*top: 5px;*/
    /*right: 10px;*/
    /*cursor: pointer;*/
    /*font-size: 14px;*/
    /*color: #242424;*/
/*}*/
/*.logoImg{*/
    /*max-height: 100px !important;*/
    /*vertical-align: middle;*/
    /*margin-top: 5px;*/
/*}*/
/*.req_star{*/
    /*color: red;*/
    /*font-size: 200%;*/
/*}*/

/*.total-wrap{*/
    /*padding: 30px;*/
/*}*/

/*.crop-wrap{*/
    /*max-width: 100%;*/
    /*max-height: 90%;*/
    /*overflow: hidden;*/
/*}*/
/*.crop-img{*/
    /*max-width:100%;*/
    /*max-height: 100%;*/
/*}*/
//</style>
//
//      `)
//  }


window.fl=fl

/***/ }),
/* 3 */
/***/ (function(module, exports) {

/**
 * Created by heyulin on 2017/1/24.
 *
 *
 * date
 * ========
 * <date v-model='variable'></date>  // ѡ��Ĭ��set=date ,��ѡ������
 *
 * <date v-model='variable' set='month'></date> // ѡ�� set=month ,��ѡ���·�
 *
 * <date v-model='variable' set='month' :config='{}'></date>  //  config ���Զ��������ö��󣬾�����Ҫ�μӰ����ļ�
 *
 * datetime
 * ===========
 * <datetime v-model='variable' :config='{}'></datetime> // ѡ�����ں�ʱ��
 *
 */

var date_config_set={
    date:{
        language: "zh-CN",
        format: "yyyy-mm-dd",
        autoclose: true,
        todayHighlight: true,
    },
    month:{
        language: "zh-CN",
        format: "yyyy-mm",
        startView: "months",
        minViewMode: "months",
        autoclose: true,

    },
}

Vue.component('date',{
    template:'<input type="text" class="form-control">',
    props:['value','set','config'],
    mounted:function () {
        var self=this
        if(!this.set){
            var def_conf=date_config_set.date
        }else{
            var def_conf=date_config_set[this.set]
        }
        if(this.config){
            ex.assign(def_conf,this.config)
        }
        self.input=$(this.$el)

        ex.load_css('//cdn.bootcss.com/bootstrap-datepicker/1.6.4/css/bootstrap-datepicker.min.css')

        ex.load_js('//cdn.bootcss.com/bootstrap-datepicker/1.6.4/js/bootstrap-datepicker.min.js',function(){
            ex.load_js('//cdn.bootcss.com/bootstrap-datepicker/1.6.4/locales/bootstrap-datepicker.zh-CN.min.js',function(){
                self.input.datepicker(def_conf).on('changeDate', function(e) {
                    self.$emit('input',self.input.val())
                })
            })

        })
    },
    watch:{
        value:function (n) {
            this.input.datepicker('update',n)
            this.input.val(n)

        }
    }
})


Vue.component('datetime',{
    data:function(){
        return {
            input_value:'',
        }
    },
    template:'<input type="text" class="form-control" v-model="input_value">',
    props:['value','config'],
    mounted:function () {
        var self=this
        var def_conf={
            language: "zh-CN",
            format: "yyyy-mm-dd hh:ii",
            autoclose: true,
            todayHighlight: true,
        }
        if(self.config){
            ex.assign(def_conf,this.config)
        }
        self.input=$(this.$el)

        ex.load_css('//cdn.bootcss.com/smalot-bootstrap-datetimepicker/2.4.3/css/bootstrap-datetimepicker.min.css')
        ex.load_js('//cdn.bootcss.com/moment.js/2.17.1/moment.min.js')
        ex.load_js('//cdn.bootcss.com/smalot-bootstrap-datetimepicker/2.4.3/js/bootstrap-datetimepicker.min.js',function(){

                self.input.datetimepicker(def_conf).on('changeDate', function(e) {
                    self.$emit('input',self.input.val())
                })

        })
    },

    watch:{
        value:function (n) {
            this.input.val(n)
        },
        input_value:function(n){
            this.$emit('input',n)
        }
    }
})



/***/ }),
/* 4 */
/***/ (function(module, exports) {

ln={
    /*
     var director = '{% url 'director' %}'

     var cache_meta={
     cache:['person.emp_info.row',
     'person.bas_info.row',
     'crt_view'],
     rt_key:{'auth.user':'person.emp_info.row.user'}
     }

     ln.cache(cache_meta)
     var back_url=btoa(ex.appendSearch({cache:1}))
     if(pk){
     location=ex.template('{director}model/{name}/edit/{pk}?next={encode_url}',{director:director,name:name,pk:pk,encode_url:back_url})
     }else{
     location=ex.template('{director}model/{name}/edit?next={encode_url}',{director:director,name:name,encode_url:back_url})
     }

    */
    readCache:function(){
        if(ex.parseSearch().cache){
            var cache_obj_str=sessionStorage.getItem(btoa(location.pathname))
            sessionStorage.removeItem(btoa(location.pathname))
            if(cache_obj_str){
                cache_obj=JSON.parse(cache_obj_str)
                for(var key in cache_obj.window){
                    ex.set(window,key,cache_obj.window[key])
                }

                var cache_meta=cache_obj.cache_meta
                if(cache_meta && cache_meta.rt_key){
                    for(var key in cache_meta.rt_key){
                        var value = sessionStorage.getItem(key)
                        var targ_key=cache_meta.rt_key[key]
                        sessionStorage.removeItem(key)
                        ex.set(window,targ_key,value)
                    }
                }
            }
        }
    },

    cache:function(cache_meta){

        var cache_obj={
            cache_meta:cache_meta,
            window:{}
        }

        if(cache_meta.cache){
            ex.each(cache_meta.cache,function(key){
                cache_obj.window[key]=ex.access(window,key)
            })
        }
        sessionStorage.setItem(btoa(location.pathname),JSON.stringify(cache_obj))
    }
}


window.ln=ln

/***/ }),
/* 5 */
/***/ (function(module, exports) {

if(!window.__multi_sel){
	document.write(`
	
<style type="text/css" media="screen" id="test">

._tow-col-sel{
	display: flex;
	align-items: stretch;

}

._tow-col-sel .sel{
	min-width:250px;
	max-width: 400px;

	display: flex;
	flex-direction: column;
	/*display: inline-block;*/
	/*vertical-align: middle;*/
}
._tow-col-sel .sel select{
	width: 100%;

	flex: 1;
}
._tow-col-sel .sel.right{
	border-width:2px;
}
._tow-col-sel .arrow{
	display: flex;
	flex-direction: column;
	justify-content:center;
	padding: 5px;
}
._tow-col-sel ._small_icon{
	width:15px;
}
._tow-col-sel ._small_icon.deactive{
	opacity: 0.5;
	-moz-opacity: 0.5;
	filter:alpha(opacity=50);
}
</style>

	`)
}

var temp_tow_col_sel=`
<div class='_tow-col-sel'>
		<div class="sel">
			<b>可选项</b>
			<select name="" id="" multiple="multiple" :size="size" class='left' v-model='left_sel' >
				<option v-for='opt in orderBy(can_select,"label")' :value="opt.value" v-text='opt.label' @dblclick='add(opt)' ></option>
			</select>
		</div>

		<div class="arrow">
			<img src="//res.enjoyst.com/image/right_02.png" alt=""
				:class='["_small_icon",{"deactive":left_sel.length==0}]' @click='batch_add()'>
			<br>
			<img src="//res.enjoyst.com/image/left_02.png" alt=""
				:class='["_small_icon",{"deactive":right_sel.length==0}]' @click='batch_rm()'>
		</div>
		<div class="sel">
			<b>选中项</b>
			<select name="" id="" multiple="multiple" :size="size" class='right' v-model='right_sel' >
				<option v-for='opt in orderBy(selected,"label")' :value="opt.value" v-text='opt.label' @dblclick='rm(opt)'></option>
			</select>
		</div>

</div>
`


Vue.component('tow-col-sel',{
	template:temp_tow_col_sel,
	props:{
		choices:{},
		value:{
			default:function () {
				return []
			}
		},
		size:{
			default:6
		},
	},
	data:function () {

		return {
			//selected:this.value,
			selected:this.value,
			can_select:JSON.parse(JSON.stringify(this.choices)),
			left_sel:[],
			right_sel:[]
		}
	},
	mounted:function () {
		var self=this
		this.can_select=ex.filter(this.can_select,function(choice){
			return !ex.isin(choice,self.selected)
		})
		//this.selected__ = ex.remove(this.can_select,function (item) {
		//		return ex.isin(item.value,self.value)
		//	})
	},
	watch:{
		selected:function (v) {
			this.$emit('input',v)
		}
	},
	
	methods:{
		orderBy:function (array,key) {
			return  array.slice().sort(function (a,b) {
				if(a[key]>b[key]){
					return 1
				}else if(a[key]<b[key]){
					return -1
				}else{
					return 0
				}
			})
		},
		add:function (opt) {
			if(!ex.isin(opt,this.selected)){
				this.selected.push(opt)
			}

			ex.remove(this.can_select,opt)
			//this.selected__.push(opt)
			//this.selected.push(opt.value)
			//var index = this.can_select.indexOf(opt)
			//if(index!=-1){
			//	this.can_select.splice(index,1)
			//}
			this.left_sel=[]
		},
		rm:function (opt) {
			ex.remove(this.selected,opt)
			this.can_select.push(opt)
			//var index = this.selected__.indexOf(opt)
			//if(index!=-1){
			//	this.selected__.splice(index,1)
			//}
			//var index_2 = this.selected.indexOf(opt.value)
			//if(index_2!=-1){
			//	this.selected.splice(index_2,1)
			//}
			//this.can_select.push(opt)
			this.right_sel=[]
		},
		batch_add:function () {
			//var tmp_ls = this.left_sel
			var self=this
			var added_choice= ex.remove(this.can_select,function(choice){
				return ex.isin(choice.value,self.left_sel)
			})
			ex.extend(this.selected,added_choice)
			//for(var x=0;x<tmp_ls.length;x++){
			//	for(var y=0;y<this.choices.length;y++){
			//		if(this.choices[y].value==tmp_ls[x]){
			//			this.add(this.choices[y])
			//			break;
			//		}
			//	}
			//}
		},
		batch_rm:function () {
			var self=this
			var del_choice=ex.remove(this.selected,function(choice){
				return ex.isin(choice.value,self.right_sel)
			})
			ex.extend(this.can_select,del_choice)
			//var tmp_ls = this.right_sel
			//for(var x=0;x<tmp_ls.length;x++){
			//	for(var y=0;y<this.selected__.length;y++){
			//		if(this.selected__[y].value==tmp_ls[x]){
			//			this.rm(this.selected__[y])
			//			break;
			//		}
			//	}
			//}
		}
	}
})



/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(8);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(7)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../node_modules/.0.26.1@css-loader/index.js!./../../node_modules/.6.0.0@sass-loader/lib/loader.js!./fields.scss", function() {
			var newContent = require("!!./../../node_modules/.0.26.1@css-loader/index.js!./../../node_modules/.6.0.0@sass-loader/lib/loader.js!./fields.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(9)();
// imports


// module
exports.push([module.i, ".error {\n  color: red; }\n\n.field-panel {\n  background-color: #F5F5F5;\n  max-width: 80%;\n  margin: 20px;\n  padding: 20px 30px;\n  border-radius: 6px;\n  position: relative;\n  border: 1px solid #D9D9D9;\n  overflow: auto; }\n  .field-panel:after {\n    content: '';\n    display: block;\n    position: absolute;\n    top: 0px;\n    left: 0px;\n    bottom: 0px;\n    width: 180px;\n    border-radius: 6px;\n    background-color: #fff;\n    z-index: 0; }\n  .field-panel .form-group.field {\n    display: flex;\n    align-items: flex-start; }\n    .field-panel .form-group.field .field_input {\n      flex-grow: 0;\n      padding: 5px 20px; }\n      .field-panel .form-group.field .field_input .ckeditor {\n        padding: 20px; }\n    .field-panel .form-group.field:first-child .control-label {\n      border-top: 5px solid #FFF; }\n    .field-panel .form-group.field .control-label {\n      width: 150px;\n      text-align: right;\n      padding: 5px 30px;\n      z-index: 100;\n      flex-shrink: 0;\n      border-top: 1px solid #EEE; }\n  .field-panel .form-group.field .field_input ._tow-col-sel {\n    /*width:750px;*/ }\n  .field-panel .field.error .error {\n    display: inline-block; }\n", ""]);

// exports


/***/ }),
/* 9 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ajax_fun_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__file_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__file_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__file_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ckeditor_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ckeditor_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__ckeditor_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__multi_sel_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__multi_sel_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__multi_sel_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__inputs_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__inputs_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__inputs_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__link_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__link_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__link_js__);
/* harmony export (immutable) */ __webpack_exports__["merge"] = merge;

/*
基本内容
==============
1. field_base
    基类，几乎有所逻辑都在里面。如果需要特殊的field，可以继承field_base，然后修改template

2. field
    Vue组件，在field_base外面套上了一层外观，例如label，error等。

参数结构
==============
field_base的参数都是采用的关键字参数，结构如下：
使用的 kw 结构
 kw={
     errors:{},
     row:{
         username:'',
         password:'',
         pas2:'',
    },
     heads:[
     	{name:'username',label:'用户名',type:'text',required:true,autofocus:true},
     ]
  }
 <field name='username' :kw='kw' ></field>






*配合jsonpost使用，效果最好
*/

/*
自动处理form.errors
$.post('',JSON.stringify(post_data),function (data) {
	is_valid(data.do_login,self.meta.errors,function () {
		location=next;
})
*/

//import {use_color} from '../dosome/color.js'
//import {load_js,load_css} from '../dosome/pkg.js'








__webpack_require__(6)

__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__ajax_fun_js__["a" /* hook_ajax_msg */])()
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__ajax_fun_js__["b" /* hook_ajax_csrf */])()

function is_valid(form_fun_rt,errors_obj,callback) {
	if(form_fun_rt){
		if(form_fun_rt.errors){
			for(x in errors_obj){
				Vue.delete(errors_obj,x)
			}
			for (x in form_fun_rt.errors){
				Vue.set(errors_obj,x,form_fun_rt.errors[x])
			}
		}else{
			callback()
		}
	}
}


var field_base={
    props: {
        name:{
            required:true
        },
        kw:{
            required:true
        },
    },
    computed:{
        row:function(){return this.kw.row},
        errors:function() {
			if(!this.kw.errors){
				Vue.set(this.kw,'errors',{})
			}
			return this.kw.errors
		},
        head:function(){
            var heads = this.kw.heads
            for (var x=0;x<heads.length;x++) {
	            var head = heads[x]
                if (head.name == this.name) {
                    return head
                }
            }

        }
    },
    methods: {
        error_data: function (name) {
            if (this.errors[name]) {
                return this.errors[name]
            } else {
                return ''
            }
        }
    },
    components: {
        linetext: {
	        props:['name','row','kw'],
            template:`<div>
            			<span v-if='kw.readonly' v-text='row[name]'></span>
            			<input v-else type="text" class="form-control" v-model="row[name]" :id="'id_'+name"
                        	:placeholder="kw.placeholder" :autofocus="kw.autofocus" :maxlength='kw.maxlength'>
                       </div>`,
        },
        number: {
	        props:['name','row','kw'],

            template: `<div><span v-if='kw.readonly' v-text='row[name]'></span>
            		<input v-else type="number" class="form-control" v-model="row[name]" :id="'id_'+name"
                        :placeholder="kw.placeholder" :autofocus="kw.autofocus"></div>`
        },
        password: {
	        props:['name','row','kw'],
            template: `<input type="password" :id="'id_'+name" class="form-control" v-model="row[name]" :placeholder="kw.placeholder" :readonly='kw.readonly'>`
        },
        blocktext: {
	        props:['name','row','kw'],
            template: `<div>
            <span v-if='kw.readonly' v-text='row[name]'></span>
            <textarea v-else class="form-control" rows="3" :id="'id_'+name" v-model="row[name]" :placeholder="kw.placeholder" :readonly='kw.readonly'></textarea>
            </div>`
        },
        color:{
	        props:['name','row','kw'],
            template: `<input type="text" v-model="row[name]" :id="'id_'+name" :readonly='kw.readonly'>`,
            methods:{
                init_and_listen:function(){
                    var self = this
                    Vue.nextTick(function(){
                        $(self.$el).spectrum({
                            color: self.row[self.name],
                            showInitial: true,
                            showInput: true,
                            preferredFormat: "name",
                            change: function(color) {
	                            	self.src_color=color.toHexString()
								    self.row[self.name] = color.toHexString();
								}
                        });
                    })
                }
            },
            watch:{
	          	input_value:function (value) {
	          		if(this.src_color !=value){
		          		this.init_and_listen()
	          		}
	          	}  
            },
            computed:{
	            input_value:function () {
	            	return this.row[this.name]
	            }
            },
            mounted:function(){
	            var self=this;
	            ex.load_css('//cdn.bootcss.com/spectrum/1.8.0/spectrum.min.css')
	            ex.load_js('//cdn.bootcss.com/spectrum/1.8.0/spectrum.min.js',function () {
	            	self.init_and_listen()
	            })
            },
        },
        logo:{
	        props:['name','row','kw'],
            template:`<logo-input :up_url="kw.up_url" :web_url.sync="row[name]" :id="'id_'+name"></logo-input>`
        },
		picture:{
			props:['name','row','kw'],
			template:`<img-uploador :up_url="kw.up_url" v-model="row[name]" :id="'id_'+name" :config="kw.config"></img-uploador>`
		},
        sim_select:{
	        props:['name','row','kw'],
	        data:function(){
		        return {
			        model:this.row[this.name]
		        }
	        },
            template:`<div>
            <span v-if='kw.readonly' v-text='get_label(kw.options,row[name])'></span>
            <select v-else v-model='row[name]'  :id="'id_'+name"  class="form-control">
            	<option v-for='opt in kw.options' :value='opt.value' v-text='opt.label'></option>
            </select>
            </div>`,
            // 添加，修改，删除的按钮代码，暂时不用。<option :value='null'>----</option>
            //`<div><select v-model='model'  :id="'id_'+name" :readonly='kw.readonly'>
            //	<option :value='null'>----</option>
            //	<option v-for='opt in kw.options' :value='opt.value' v-text='opt.label'></option>
            //</select>
            //<span v-if='kw.add_url' @click='add()'><img src='http://res.enjoyst.com/image/add.png' /></span>
            //<span v-if='kw.change_url' @click='edit()'><img src='http://res.enjoyst.com/image/edit.png' /></span>
            //<span v-if='kw.del_url' @click='del_row()'><img src='http://res.enjoyst.com/image/delete.png' /></a>
            //</div>`,
			mounted:function(){
				if(this.kw.default && !this.row[this.name]){
					Vue.set(this.row,this.name,this.kw.default)
					//this.row[this.name]=this.kw.default
				}
			},
            methods:{
            	//get_label:function(options,value){
            	//	var option = ex.findone(options,{value:value})
            	//	if(!option){
            	//		return '---'
            	//	}else{
            	//		return option.label
            	//	}
            	//},
	            //add:function () {
		         //   var self=this
	            //	window.open(this.kw.add_url+'edit/?_pop=1',location.pathname,'height=500,width=800,resizable=yes,scrollbars=yes,top=200,left=300')
	            //	window.on_subwin_close=function (row) {
		         //   		var post_data=[{fun:'get_rows_info',rows:[row]}]
				 //           $.post('',JSON.stringify(post_data),function (data) {
				 //           	var rows = data.get_rows_info
				 //           	for(var i =0;i<rows.length;i++){
					//            	var row=rows[i]
					//            	self.kw.options.push({value:row.pk,label:row.label})
					//            	self.model=row.pk
					//            	break
				 //           	}
				 //           })
				 //           window.on_subwin_close=null
			     //   }
	            //},
	            //edit:function () {
		         //   if(this.model){
			     //       var self=this
			     //       window.open(this.kw.add_url+'edit/'+this.model+'?_pop=1',location.pathname,'height=500,width=800,resizable=yes,scrollbars=yes,top=200,left=300')
			     //       window.on_subwin_close=function (row) {
				 //           var post_data=[{fun:'get_rows_info',rows:[row]}]
				 //           $.post('',JSON.stringify(post_data),function (data) {
				 //           	var rows = data.get_rows_info
				 //           	for(var i =0;i<rows.length;i++){
					//            	var row=rows[i]
					//            	for(var j=0;j<self.kw.options.length;j++){
					//	            	var option=self.kw.options[j]
					//	            	if(row.pk==option.value){
					//		            	option.label=row.label
					//	            	}
					//            	}
				 //           	}
				 //           })
				 //           window.on_subwin_close=null
			     //       }
		         //   }
	            //},
	            //del_row:function () {
		         //   if (this.model){
			     //       var self=this
			     //       var rows=[{pk:this.model,_class:this.kw._class}]
			     //       window.open(this.kw.del_url+'?rows='+btoa(JSON.stringify(rows))+'&_pop=1',location.pathname,'height=500,width=800,resizable=yes,scrollbars=yes,top=200,left=300')
			     //       window.on_subwin_close=function (rows) {
				 //           for(var i=0;i<rows.length;i++){
					//            var row=rows[i]
					//            if(row._class==self.kw._class){
					//	            for(var j=0;j<self.kw.options.length;j++){
					//		            var option=self.kw.options[j]
					//		            if(option.value==row.pk){
					//			            self.kw.options.splice(j,1)
					//		            }
					//	            }
					//            }
				 //           }
				 //          	window.on_subwin_close=null
			     //       }
		         //   }
	            //}
            }
        },
        tow_col:{
	        props:['name','row','kw'],
	        template:`<div>
	        	<ul v-if='kw.readonly'><li v-for='value in row[name]' v-text='get_label(value)'></li></ul>
	        	<tow-col-sel v-else v-model='row[name]' :id="'id_'+name" :choices='kw.options' :size='kw.size' ></tow-col-sel>
	        	</div>`,
	        methods:{
		        get_label:function (value) {
		        	for(var i =0;i<this.kw.options.length;i++){
			        	if(this.kw.options[i].value==value){
				        	return this.kw.options[i].label
			        	}
		        	}
		        }
	        }
        },
        bool:{
	        props:['name','row','kw'],
	        template:`<div class="checkbox">
					    <label><input type="checkbox" :id="'id_'+name" v-model='row[name]' :disabled="kw.readonly">
					    	<span v-text='kw.label'></span>
					    </label>
					  </div>`
        },
		date: {
			props:['name','row','kw'],
			template:`<div><span v-if='kw.readonly' v-text='row[name]'></span>
            			<date class="form-control" v-model="row[name]" :id="'id_'+name"
                        	:placeholder="kw.placeholder"></date>
                       </div>`,
		},
		datetime:{
			props:['name','row','kw'],
			template:`<div><span v-if='kw.readonly' v-text='row[name]'></span>
            			<datetime class="form-control" v-model="row[name]" :id="'id_'+name"
                        	:placeholder="kw.placeholder"></datetime>
                       </div>`,
		},
		richtext:{
			props:['name','row','kw'],
			template:`<div><span v-if='kw.readonly' v-text='row[name]'></span>
            			<ckeditor  v-model="row[name]" :id="'id_'+name"></ckeditor>
                       </div>`,
		},
    }

}
//'set.label_cls'   set.input_cls

var field={
		mixins:[field_base],
		template:`
		<div for='field' class="form-group field" :class='{"error":error_data(name)}' v-if="head">
		<label :for="'id_'+name" v-text="head.label" class="control-label" v-if='!head.no_auto_label'>
			<span class="req_star" v-if='head.required'> *</span>
		</label>
		<div class="field_input">
			<component :is='head.type'
				:row='row'
				:name='name'
				:kw='head'>
			</component>
		</div>
		<slot> </slot>
		<div v-for='error in error_data(name)' v-text='error' class='error'></div>
		</div>
	`,

}

Vue.component('field',field)


function update_vue_obj(vue_obj,obj) {
	for(let x in vue_obj){
		Vue.delete(vue_obj,x)
	}
	for(let x in obj){
		Vue.set(vue_obj,x,obj[x])
	}
}

function merge(mains,subs) {
	mains.each(function (first) {
		subs.each(function (second) {
			if(first.name==second.name){
				for(var x in second){
					first[x]=second[x]
				}
			}
		})
	})
	//for(let sub of sub){
	//	for (let main of mains){
	//		if(main.name==sub.name){
	//			for(let k in sub){
	//				main[k]=sub[k]
	//			}
	//			break
	//		}
	//	}
	//}
}

window.hook_ajax_msg=__WEBPACK_IMPORTED_MODULE_0__ajax_fun_js__["a" /* hook_ajax_msg */]
window.update_vue_obj=update_vue_obj
//window.use_color = use_color
window.use_ckeditor= __WEBPACK_IMPORTED_MODULE_2__ckeditor_js__["use_ckeditor"]
window.show_upload =__WEBPACK_IMPORTED_MODULE_0__ajax_fun_js__["c" /* show_upload */]
window.hide_upload =__WEBPACK_IMPORTED_MODULE_0__ajax_fun_js__["d" /* hide_upload */]
window.merge=merge;



/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(12);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(7)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.6.0.0@sass-loader/lib/loader.js!./file.scss", function() {
			var newContent = require("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.6.0.0@sass-loader/lib/loader.js!./file.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(9)();
// imports


// module
exports.push([module.i, ".img-uploader input {\n  display: none; }\n\n.up_wrap {\n  position: relative;\n  text-align: center;\n  border: 2px dashed #ccc;\n  background: #FDFDFD;\n  width: 300px; }\n\n.closeDiv {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  background-color: #ffffff; }\n\n.choose {\n  display: inline-block;\n  text-decoration: none;\n  padding: 5px;\n  border: 1px solid #0092F2;\n  border-radius: 4px;\n  font-size: 14px;\n  color: #0092F2;\n  cursor: pointer; }\n\n.choose:hover, .choose:active {\n  text-decoration: none;\n  color: #0092F2; }\n\n.close {\n  position: absolute;\n  top: 5px;\n  right: 10px;\n  cursor: pointer;\n  font-size: 14px;\n  color: #242424; }\n\n.logoImg {\n  max-height: 100px !important;\n  vertical-align: middle;\n  margin-top: 5px; }\n\n.req_star {\n  color: red;\n  font-size: 200%; }\n\n.img-crop .total-wrap {\n  padding: 30px; }\n\n.img-crop .crop-wrap {\n  max-width: 100%;\n  max-height: 90%;\n  overflow: hidden; }\n\n.img-crop .crop-img {\n  max-width: 100%;\n  max-height: 100%; }\n", ""]);

// exports


/***/ })
/******/ ]);