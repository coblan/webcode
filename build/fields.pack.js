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
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
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

ex.load_css('https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css')
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
	extraPlugins : 'justify,codesnippet,lineutils,mathjax,colorbutton,uploadimage,font', //autogrow,
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
		// 4.5.10   4.6.2
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



/***/ }),
/* 2 */
/***/ (function(module, exports) {

/*
file-input
===========
预览图片
	从file-input读出数据，然后赋予图片的src ::
	
		f1.read(file,function (data) {
				$('#haha')[0].src = data
				}



*/
var fl={
	read:function (file,callback) {
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
	upload:function (file,url,success) {
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
			            if (evt.lengthComputable) {
			                var percentComplete = evt.loaded / evt.total;
			                console.log('进度', percentComplete);
			            }
			        }, false);

			        return xhr;
			}
		})
	},
	uploads:function (files,url,success) {
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
			            if (evt.lengthComputable) {
			                var percentComplete = evt.loaded / evt.total;
			                console.log('进度', percentComplete);
			            }
			        }, false);

			        return xhr;
				}
			})
        }
}

Vue.component('file-input',{
    template:"<input class='file-input' type='file' @change='on_change($event)'>",
   	props:['value'],
    data:function () {
    	return {
	    	files:[]
    	}
    },
    watch:{
	    value:function (v) {
		    if(v==''){
			    this.$el.value=v
		    }
	    },
    },
    methods:{
	    on_change:function (event) {
	    	this.files=event.target.files
	    	this.$emit('input',this.files)
	    },
        _changed:function (changeEvent) {
            var file=changeEvent.target.files[0];
            if(!file)
                return
            this.file=file
            this.fd = new FormData();
            this.fd.append('file', file);
            this.$dispatch('ready')
            //this.ready=true;
        },
        read:function (callback) {
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

		    reader.readAsDataURL(this.file); // 读出 base64
        },
        upload:function (up_url,success,error) {
            var self =this;
            $.ajax({
                url:up_url,
                type:'post',
                data:this.fd,
                contentType: false,
                cache: false,
                success:function (data,textStatus,jqXHR ) {
	                success(data,textStatus,jqXHR)
                    //self.$dispatch('response',data)
                    
                },
                error:function (jqXHR, textStatus,errorThrown) {
                	error(jqXHR, textStatus,errorThrown)
                },
                processData:false
            })
        },
    }
})





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

  if(!window._logo_input_css){
      document.write(`

<style type="text/css" media="screen" >
.up_wrap{
    position: relative;
    text-align: center;
    border: 2px dashed #ccc;
    background: #FDFDFD;
    width:300px;
}
.logo-input input[type="file"]{
    opacity: 0;
    position: absolute;
    top: 40px;
    left: 40px;
    display: block;
    cursor: pointer;
}
.closeDiv{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #ffffff;
}
.choose{
    display: inline-block;
    text-decoration: none;
    padding: 5px;
    border: 1px solid #0092F2;
    border-radius: 4px;
    font-size: 14px;
    color: #0092F2;
    cursor: pointer;
}
.choose:hover,.choose:active{
    text-decoration: none;
    color: #0092F2;
}
.close{
    position: absolute;
    top: 5px;
    right: 10px;
    cursor: pointer;
    font-size: 14px;
    color: #242424;
}
.logoImg{
    max-height: 100px !important;
    vertical-align: middle;
    margin-top: 5px;
}
.req_star{
    color: red;
    font-size: 200%;
}
</style>

      `)
  }


window.fl=fl

/***/ }),
/* 3 */
/***/ (function(module, exports) {

/**
 * Created by heyulin on 2017/1/24.
 */

Vue.component('date',{
    template:'<input type="text" class="form-control">',
    props:['value','config'],
    mounted:function () {
        var self=this
        var def_conf={
            language: "zh-CN",
            format: "yyyy-mm-dd",
            autoclose: true,
            todayHighlight: true,
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

if(!window.__multi_sel){
	document.write(`
	
<style type="text/css" media="screen" id="test">
._tow-col-sel .sel{
	width:250px;
	display: inline-block;
	vertical-align: middle;
}
._tow-col-sel .sel.right{
	border-width:2px;
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
		<select name="" id="" multiple="multiple" :size="size" class='sel left' v-model='left_sel' >
			<option v-for='opt in orderBy(can_select,"label")' :value="opt.value" v-text='opt.label' @dblclick='add(opt)' ></option>
		</select>
		<div style='display: inline-block;vertical-align: middle;'>
			<img src="http://oe8wu3kqs.bkt.clouddn.com/image/right_02.png" alt="" 
				:class='["_small_icon",{"deactive":left_sel.length==0}]' @click='batch_add()'>
			<br>
			<img src="http://oe8wu3kqs.bkt.clouddn.com/image/left_02.png" alt="" 
				:class='["_small_icon",{"deactive":right_sel.length==0}]' @click='batch_rm()'>
		</div>
		
		<select name="" id="" multiple="multiple" :size="size" class='sel right' v-model='right_sel' >
			<option v-for='opt in orderBy(selected__,"label")' :value="opt.value" v-text='opt.label' @dblclick='rm(opt)'></option>
		</select>
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
			selected:this.value,
			selected__:[],
			can_select:JSON.parse(JSON.stringify(this.choices)),
			left_sel:[],
			right_sel:[]
		}
	},
	mounted:function () {
		var self=this
		this.selected__ = ex.remove(this.can_select,function (item) {
				return ex.isin(item.value,self.value)
			})
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
			this.selected__.push(opt)
			this.selected.push(opt.value)
			var index = this.can_select.indexOf(opt)
			if(index!=-1){
				this.can_select.splice(index,1)
			}
			this.left_sel=[]
		},
		rm:function (opt) {
			var index = this.selected__.indexOf(opt)
			if(index!=-1){
				this.selected__.splice(index,1)
			}
			var index_2 = this.selected.indexOf(opt.value)
			if(index_2!=-1){
				this.selected.splice(index_2,1)
			}
			this.can_select.push(opt)
			this.right_sel=[]
		},
		batch_add:function () {
			var tmp_ls = this.left_sel
			for(var x=0;x<tmp_ls.length;x++){
				for(var y=0;y<this.choices.length;y++){
					if(this.choices[y].value==tmp_ls[x]){
						this.add(this.choices[y])
						break;
					}
				}
			}
		},
		batch_rm:function () {
			var tmp_ls = this.right_sel
			for(var x=0;x<tmp_ls.length;x++){
				for(var y=0;y<this.selected__.length;y++){
					if(this.selected__[y].value==tmp_ls[x]){
						this.rm(this.selected__[y])
						break;
					}
				}
			}
		}
	}
})



/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(6);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(8)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/lib/loader.js!./fields.scss", function() {
			var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/lib/loader.js!./fields.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)();
// imports


// module
exports.push([module.i, ".error {\n  color: red; }\n\n.field-panel {\n  background-color: #F5F5F5;\n  max-width: 80%;\n  margin: 20px;\n  padding: 20px 30px;\n  border-radius: 6px;\n  position: relative;\n  border: 1px solid #D9D9D9; }\n  .field-panel:after {\n    content: '';\n    display: block;\n    position: absolute;\n    top: 0px;\n    left: 0px;\n    bottom: 0px;\n    width: 180px;\n    border-radius: 6px;\n    background-color: #fff;\n    z-index: 0; }\n  .field-panel .form-group.field {\n    display: flex; }\n    .field-panel .form-group.field .field_input {\n      flex-grow: 1;\n      padding: 5px 20px; }\n      .field-panel .form-group.field .field_input .ckeditor {\n        padding: 20px; }\n    .field-panel .form-group.field:first-child .control-label {\n      border-top: 5px solid #FFF; }\n    .field-panel .form-group.field .control-label {\n      width: 150px;\n      text-align: right;\n      padding: 5px 30px;\n      z-index: 100;\n      flex-shrink: 0;\n      border-top: 1px solid #EEE; }\n  .field-panel .form-group.field .field_input ._tow-col-sel {\n    /*width:750px;*/ }\n  .field-panel ._tow-col-sel .sel {\n    width: 350px; }\n  .field-panel .field.error .error {\n    display: inline-block; }\n", ""]);

// exports


/***/ }),
/* 7 */
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
/* 8 */
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
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ajax_fun_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__file_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__file_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__file_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ckeditor_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ckeditor_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__ckeditor_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__multi_sel_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__multi_sel_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__multi_sel_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__inputs_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__inputs_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__inputs_js__);
/* harmony export (immutable) */ __webpack_exports__["merge"] = merge;

/*
基本内容
==============
1. field_base
    基类，几乎有所逻辑都在里面。如果需要特殊的field，可以继承field_base，然后修改template

2. field
    本页面，实现了基本的field功能。

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

 如果需要水平排列的field，
 <field name='username' :kw='kw' :set="{label_cls:'col-md-2',input_cls:'col-md-10'}"></field>

 */




/*
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






__webpack_require__(5)

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

//var watch_model={
//	props: ['name','value','kw'],
//	data:function () {
//		return {
//			model:this.value
//		}
//	},
//	watch:{
//        model:function (v) {
//        	this.$emit('input',v)
//        	console.log('from mixin')
//        }
//       }
//}

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
        errors:function() {return this.kw.errors},
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
Vue.component('field',{
    mixins:[field_base],
	template:`
	<div for='field' class="form-group field" :class='{"error":error_data(name)}'>
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

})


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



/***/ })
/******/ ]);