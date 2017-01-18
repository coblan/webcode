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
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.merge = merge;

	var _ajax_fun = __webpack_require__(1);

	var _file = __webpack_require__(2);

	var f = _interopRequireWildcard(_file);

	var _ckeditor = __webpack_require__(3);

	var ck = _interopRequireWildcard(_ckeditor);

	var _multi_sel = __webpack_require__(4);

	var multi = _interopRequireWildcard(_multi_sel);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
	(0, _ajax_fun.hook_ajax_msg)();
	(0, _ajax_fun.hook_ajax_csrf)();

	function is_valid(form_fun_rt, errors_obj, callback) {
		if (form_fun_rt) {
			if (form_fun_rt.errors) {
				for (x in errors_obj) {
					Vue.delete(errors_obj, x);
				}
				for (x in form_fun_rt.errors) {
					Vue.set(errors_obj, x, form_fun_rt.errors[x]);
				}
			} else {
				callback();
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

	var field_base = {
		props: {
			name: {
				required: true
			},
			kw: {
				required: true
			}
		},
		computed: {
			row: function row() {
				return this.kw.row;
			},
			errors: function errors() {
				return this.kw.errors;
			},
			head: function head() {
				var heads = this.kw.heads;
				for (var x = 0; x < heads.length; x++) {
					var head = heads[x];
					if (head.name == this.name) {
						return head;
					}
				}
			}
		},
		methods: {
			error_data: function error_data(name) {
				if (this.errors[name]) {
					return this.errors[name];
				} else {
					return '';
				}
			}
		},
		components: {
			linetext: {
				props: ['name', 'row', 'kw'],
				template: '<div>\n            \t\t\t<span v-if=\'kw.readonly\' v-text=\'row[name]\'></span>\n            \t\t\t<input v-else type="text" class="form-control" v-model="row[name]" :id="\'id_\'+name"\n                        \t:placeholder="kw.placeholder" :autofocus="kw.autofocus" :maxlength=\'kw.maxlength\'>\n                       </div>'
			},
			number: {
				props: ['name', 'row', 'kw'],

				template: '<div><span v-if=\'kw.readonly\' v-text=\'row[name]\'></span>\n            \t\t<input v-else type="number" class="form-control" v-model="row[name]" :id="\'id_\'+name"\n                        :placeholder="kw.placeholder" :autofocus="kw.autofocus"></div>'
			},
			password: {
				props: ['name', 'row', 'kw'],
				template: '<input type="password" :id="\'id_\'+name" class="form-control" v-model="row[name]" :placeholder="kw.placeholder" :readonly=\'kw.readonly\'>'
			},
			blocktext: {
				props: ['name', 'row', 'kw'],
				template: '<div>\n            <span v-if=\'kw.readonly\' v-text=\'row[name]\'></span>\n            <textarea v-else class="form-control" rows="3" :id="\'id_\'+name" v-model="row[name]" :placeholder="kw.placeholder" :readonly=\'kw.readonly\'></textarea>\n            </div>'
			},
			color: {
				props: ['name', 'row', 'kw'],
				template: '<input type="text" v-model="row[name]" :id="\'id_\'+name" :readonly=\'kw.readonly\'>',
				methods: {
					init_and_listen: function init_and_listen() {
						var self = this;
						Vue.nextTick(function () {
							$(self.$el).spectrum({
								color: self.row[self.name],
								showInitial: true,
								showInput: true,
								preferredFormat: "name",
								change: function change(color) {
									self.row[self.name] = color.toHexString();
								}
							});
						});
					}
				},
				mounted: function mounted() {
					var self = this;
					ex.load_css('http://cdn.bootcss.com/spectrum/1.8.0/spectrum.min.css');
					ex.load_js('http://cdn.bootcss.com/spectrum/1.8.0/spectrum.min.js', function () {
						self.init_and_listen();
					});
				}
			},
			logo: {
				props: ['name', 'row', 'kw'],
				template: '<logo-input :up_url="kw.up_url" :web_url.sync="row[name]" :id="\'id_\'+name"></logo-input>'
			},
			sim_select: {
				props: ['name', 'row', 'kw'],
				data: function data() {
					return {
						model: this.row[this.name]
					};
				},
				template: '<div>\n            <span v-if=\'kw.readonly\' v-text=\'get_label(kw.options,row[name])\'></span>\n            <select v-else v-model=\'row[name]\'  :id="\'id_\'+name" :readonly=\'kw.readonly\' class="form-control">\n            \t<option :value=\'null\'>----</option>\n            \t<option v-for=\'opt in kw.options\' :value=\'opt.value\' v-text=\'opt.label\'></option>\n            </select>\n            </div>',
				// 添加，修改，删除的按钮代码，暂时不用。
				//`<div><select v-model='model'  :id="'id_'+name" :readonly='kw.readonly'>
				//	<option :value='null'>----</option>
				//	<option v-for='opt in kw.options' :value='opt.value' v-text='opt.label'></option>
				//</select>
				//<span v-if='kw.add_url' @click='add()'><img src='http://res.enjoyst.com/image/add.png' /></span>
				//<span v-if='kw.change_url' @click='edit()'><img src='http://res.enjoyst.com/image/edit.png' /></span>
				//<span v-if='kw.del_url' @click='del_row()'><img src='http://res.enjoyst.com/image/delete.png' /></a>
				//</div>`,
				methods: {
					get_label: function get_label(options, value) {
						var option = ex.findone(options, { value: value });
						if (!option) {
							return '---';
						} else {
							return option.label;
						}
					},
					add: function add() {
						var self = this;
						window.open(this.kw.add_url + 'edit/?_pop=1', location.pathname, 'height=500,width=800,resizable=yes,scrollbars=yes,top=200,left=300');
						window.on_subwin_close = function (row) {
							var post_data = [{ fun: 'get_rows_info', rows: [row] }];
							$.post('', JSON.stringify(post_data), function (data) {
								var rows = data.get_rows_info;
								for (var i = 0; i < rows.length; i++) {
									var row = rows[i];
									self.kw.options.push({ value: row.pk, label: row.label });
									self.model = row.pk;
									break;
								}
							});
							window.on_subwin_close = null;
						};
					},
					edit: function edit() {
						if (this.model) {
							var self = this;
							window.open(this.kw.add_url + 'edit/' + this.model + '?_pop=1', location.pathname, 'height=500,width=800,resizable=yes,scrollbars=yes,top=200,left=300');
							window.on_subwin_close = function (row) {
								var post_data = [{ fun: 'get_rows_info', rows: [row] }];
								$.post('', JSON.stringify(post_data), function (data) {
									var rows = data.get_rows_info;
									for (var i = 0; i < rows.length; i++) {
										var row = rows[i];
										for (var j = 0; j < self.kw.options.length; j++) {
											var option = self.kw.options[j];
											if (row.pk == option.value) {
												option.label = row.label;
											}
										}
									}
								});
								window.on_subwin_close = null;
							};
						}
					},
					del_row: function del_row() {
						if (this.model) {
							var self = this;
							var rows = [{ pk: this.model, _class: this.kw._class }];
							window.open(this.kw.del_url + '?rows=' + btoa(JSON.stringify(rows)) + '&_pop=1', location.pathname, 'height=500,width=800,resizable=yes,scrollbars=yes,top=200,left=300');
							window.on_subwin_close = function (rows) {
								for (var i = 0; i < rows.length; i++) {
									var row = rows[i];
									if (row._class == self.kw._class) {
										for (var j = 0; j < self.kw.options.length; j++) {
											var option = self.kw.options[j];
											if (option.value == row.pk) {
												self.kw.options.splice(j, 1);
											}
										}
									}
								}
								window.on_subwin_close = null;
							};
						}
					}
				}
			},
			tow_col: {
				props: ['name', 'row', 'kw'],
				template: '<div>\n\t        \t<ul v-if=\'kw.readonly\'><li v-for=\'value in row[name]\' v-text=\'get_label(value)\'></li></ul>\n\t        \t<tow-col-sel v-else v-model=\'row[name]\' :id="\'id_\'+name" :choices=\'kw.options\' :size=\'kw.size\' ></tow-col-sel>\n\t        \t</div>',
				methods: {
					get_label: function get_label(value) {
						for (var i = 0; i < this.kw.options.length; i++) {
							if (this.kw.options[i].value == value) {
								return this.kw.options[i].label;
							}
						}
					}
				}
			},
			bool: {
				props: ['name', 'row', 'kw'],
				template: '<div class="checkbox">\n\t\t\t\t\t    <label><input type="checkbox" :id="\'id_\'+name" v-model=\'row[name]\' :disabled="kw.readonly">\n\t\t\t\t\t    \t<span v-text=\'kw.label\'></span>\n\t\t\t\t\t    </label>\n\t\t\t\t\t  </div>'
			}
		}

	};
	//'set.label_cls'   set.input_cls
	Vue.component('field', {
		mixins: [field_base],
		template: '\n\t<div for=\'field\' class="form-group field" :class=\'{"error":error_data(name)}\'>\n\t<label :for="\'id_\'+name" v-text="head.label" class="control-label" v-if=\'!head.no_auto_label\'>\n\t\t<span class="req_star" v-if=\'head.required\'> *</span>\n\t</label>\n\t<div class="field_input">\n        <component :is=\'head.type\'\n            :row=\'row\'\n            :name=\'name\'\n            :kw=\'head\'>\n        </component>\n\t</div>\n\t<slot> </slot>\n\t<div v-for=\'error in error_data(name)\' v-text=\'error\' class=\'error\'></div>\n    </div>\n'

	});

	function update_vue_obj(vue_obj, obj) {
		for (var _x in vue_obj) {
			Vue.delete(vue_obj, _x);
		}
		for (var _x2 in obj) {
			Vue.set(vue_obj, _x2, obj[_x2]);
		}
	}

	function merge(mains, subs) {
		mains.each(function (first) {
			subs.each(function (second) {
				if (first.name == second.name) {
					for (var x in second) {
						first[x] = second[x];
					}
				}
			});
		});
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

	window.hook_ajax_msg = _ajax_fun.hook_ajax_msg;
	window.update_vue_obj = update_vue_obj;
	//window.use_color = use_color
	window.use_ckeditor = ck.use_ckeditor;
	window.show_upload = _ajax_fun.show_upload;
	window.hide_upload = _ajax_fun.hide_upload;
	window.merge = merge;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.hook_ajax_msg = hook_ajax_msg;
	exports.hook_ajax_csrf = hook_ajax_csrf;
	exports.show_upload = show_upload;
	exports.hide_upload = hide_upload;
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

	function has_error(data) {
		if (data.status && data.status != 'success') {
			if (data.msg) {
				alert(data.msg);
			}
			return true;
		} else {
			return false;
		}
	}

	window.has_error = has_error;

	function def_proc_port_msg(data, event) {
		var rt = data.responseJSON;
		if (rt && rt.msg) {
			alert(rt.msg);
		}
	}

	function def_proc_error(jqxhr) {
		if (!window.iclosed) {
			if (jqxhr.status != 0) {
				alert('server has error, error code is ' + jqxhr.status);
			} else {
				alert('maybe server offline,error code is ' + jqxhr.status);
			}
		}
	}

	window.__proc_port_error = def_proc_port_msg;
	window.__proc_ajax_error = def_proc_error;

	function hook_ajax_msg(proc_port_error, proc_ajax_error) {
		if (proc_port_error) {
			window.__proc_port_error = proc_port_error;
		}
		if (proc_ajax_error) {
			window.__proc_ajax_error = proc_ajax_error;
		}
		if (window.hook_ajax_msg_mark) {
			return;
		}
		window.hook_ajax_msg_mark = true;
		$(window).bind('beforeunload', function () {
			window.iclosed = true;
		});

		//$(document).ajaxSuccess(function (event,data) {
		//    window.__proc_port_error(data,event)
		//})
		$(document).ajaxError(function (event, jqxhr, settings, thrownError) {
			window.__proc_ajax_error(jqxhr);
		});
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
					if (cookie.substring(0, name.length + 1) === name + '=') {
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
			return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method)
			);
		}
		$.ajaxSetup({
			beforeSend: function beforeSend(xhr, settings) {
				if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
					xhr.setRequestHeader("X-CSRFToken", csrftoken);
				}
			}
		});
	}

	function show_upload() {
		$('#load_wrap').show();
	}
	function hide_upload(second) {
		if (second) {
			setTimeout(function () {
				$('#load_wrap').hide();
			}, second);
		} else {
			$('#load_wrap').hide();
		}
	}

	ex.load_css('https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css');
	//if(!window.__font_awesome){
	//	window.__font_awesome=true
	//	document.write(`<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">`)
	//}

	if (!window.__uploading_mark) {
		window.__uploading_mark = true;
		document.write('\n\t\t<style>\n\t\t.popup{\n\t\t\tposition: fixed;\n\t\t\ttop: 0;\n\t\t\tleft: 0;\n\t\t\tright: 0;\n\t\t\tbottom: 0;\n\t\t\tdisplay:none;\n\t\t\tz-index: 9000;\n\t\t}\n\t\t#_upload_inn{\n\t\t\tbackground: rgba(88, 88, 88, 0.2);\n\t\t\tborder-radius: 5px;\n\t\t\twidth:180px;\n\t\t\theight:120px;\n\t\t\tz-index: 9500;\n\t\t\t/*padding:30px 80px ;*/\n\t\t}\n\t\t.imiddle{\n\t\t    position: absolute;\n\t        top: 50%;\n\t        left: 50%;\n\t        transform: translate(-50%, -50%);\n\t        -ms-transform:translate(-50%, -50%); \t/* IE 9 */\n\t\t\t-moz-transform:translate(-50%, -50%); \t/* Firefox */\n\t\t\t-webkit-transform:translate(-50%, -50%); /* Safari \u548C Chrome */\n\t\t\t-o-transform:translate(-50%, -50%); \n\t\t\t\n\t        text-align: center;\n\t\t\t/*display: table;*/\n\t        z-index: 10000;\n    \t}\n    \t#_upload_mark{\n    \t\tfloat: left;\n\n    \t}\n\t\t</style>');
		$(function () {
			$('body').append('<div class="popup" id="load_wrap"><div id=\'_upload_inn\' class="imiddle">\n\t\t<div  id="_upload_mark" class="imiddle"><i class="fa fa-spinner fa-spin fa-3x"></i></div></div></div>');
		});
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	/*
	file-input
	===========
	预览图片
		从file-input读出数据，然后赋予图片的src ::
		
			f1.read(file,function (data) {
					$('#haha')[0].src = data
					}



	*/
	var fl = {
	    read: function read(file, callback) {
	        var reader = new FileReader();
	        reader.onloadend = function () {
	            // 图片的 base64 格式, 可以直接当成 img 的 src 属性值
	            var dataURL = reader.result;
	            //var img = new Image();
	            //img.src = dataURL;
	            // 插入到 DOM 中预览
	            //$('#haha')[0].src=dataURL
	            callback(dataURL);
	        };
	        reader.readAsDataURL(file); // 读出 base64
	    },
	    upload: function upload(file, url, success) {
	        var fd = new FormData();
	        fd.append('file', file);
	        $.ajax({
	            url: url,
	            type: 'post',
	            data: fd,
	            contentType: false,
	            success: success,
	            //success:function (data) {
	            //    success(data)
	            //},
	            processData: false,
	            xhr: function xhr() {
	                var xhr = new window.XMLHttpRequest();
	                xhr.upload.addEventListener("progress", function (evt) {
	                    if (evt.lengthComputable) {
	                        var percentComplete = evt.loaded / evt.total;
	                        console.log('进度', percentComplete);
	                    }
	                }, false);

	                return xhr;
	            }
	        });
	    },
	    uploads: function uploads(files, url, success) {
	        var fd = new FormData();
	        for (var x = 0; x < files.length; x++) {
	            var file = files[x];
	            fd.append(file.name, file);
	        }
	        $.ajax({
	            url: url,
	            type: 'post',
	            data: fd,
	            contentType: false,
	            success: success,
	            processData: false,
	            xhr: function xhr() {
	                var xhr = new window.XMLHttpRequest();
	                xhr.upload.addEventListener("progress", function (evt) {
	                    if (evt.lengthComputable) {
	                        var percentComplete = evt.loaded / evt.total;
	                        console.log('进度', percentComplete);
	                    }
	                }, false);

	                return xhr;
	            }
	        });
	    }
	};

	Vue.component('file-input', {
	    template: "<input class='file-input' type='file' @change='on_change($event)'>",
	    props: ['value'],
	    data: function data() {
	        return {
	            files: []
	        };
	    },
	    watch: {
	        value: function value(v) {
	            if (v == '') {
	                this.$el.value = v;
	            }
	        }
	    },
	    methods: {
	        on_change: function on_change(event) {
	            this.files = event.target.files;
	            this.$emit('input', this.files);
	        },
	        _changed: function _changed(changeEvent) {
	            var file = changeEvent.target.files[0];
	            if (!file) return;
	            this.file = file;
	            this.fd = new FormData();
	            this.fd.append('file', file);
	            this.$dispatch('ready');
	            //this.ready=true;
	        },
	        read: function read(callback) {
	            var reader = new FileReader();
	            reader.onloadend = function () {
	                // 图片的 base64 格式, 可以直接当成 img 的 src 属性值
	                var dataURL = reader.result;
	                //var img = new Image();
	                //img.src = dataURL;
	                // 插入到 DOM 中预览
	                //$('#haha')[0].src=dataURL
	                callback(dataURL);
	            };

	            reader.readAsDataURL(this.file); // 读出 base64
	        },
	        upload: function upload(up_url, _success, _error) {
	            var self = this;
	            $.ajax({
	                url: up_url,
	                type: 'post',
	                data: this.fd,
	                contentType: false,
	                cache: false,
	                success: function success(data, textStatus, jqXHR) {
	                    _success(data, textStatus, jqXHR);
	                    //self.$dispatch('response',data)
	                },
	                error: function error(jqXHR, textStatus, errorThrown) {
	                    _error(jqXHR, textStatus, errorThrown);
	                },
	                processData: false
	            });
	        }
	    }
	});

	Vue.component('file-obj', {
	    template: "<input model='filebody' type='file' @change='changed'>",
	    props: {
	        up_url: {
	            type: String,
	            required: true
	        },
	        //url:{
	        //    type: String,
	        //    twoWay:true
	        //},
	        ready: {}
	    },
	    methods: {
	        changed: function changed(changeEvent) {
	            var file = changeEvent.target.files[0];
	            if (!file) return;
	            this.fd = new FormData();
	            this.fd.append('file', file);
	            this.ready = true;
	            this.upload();
	        },
	        upload: function upload() {
	            var self = this;
	            $.ajax({
	                url: this.up_url,
	                type: 'post',
	                data: this.fd,
	                contentType: false,
	                cache: false,
	                success: function success(data) {
	                    if (data.url) {
	                        self.$dispatch('rt_url', data.url);
	                    }

	                    //alert(data);
	                    //self.url=data.url;
	                    //self.$emit('url.changed',data.url)
	                },
	                //error:function (data) {
	                //	alert(data.responseText)
	                //},
	                processData: false
	            });
	        }
	    }
	});

	Vue.component('logo-input', {
	    props: ['up_url', 'web_url', 'id'],
	    template: '\n          <div class=\'up_wrap logo-input\'>\n            <file-obj :id=\'id\'\n                accept=\'image/gif,image/jpeg,image/png\'\n                :up_url=\'up_url\'\n                @rt_url= \'get_web_url\'>\n            </file-obj>\n            <div style="padding: 40px">\n                <a class=\'choose\'>Choose</a>\n            </div>\n            <div v-if=\'web_url\' class="closeDiv">\n            <div class="close" @click=\'clear()\'>X</div>\n            <img :src="web_url" alt="" class="logoImg">\n            </div>\n            </div>\n        ',
	    methods: {
	        get_web_url: function get_web_url(e) {
	            this.web_url = e;
	        },
	        clear: function clear() {
	            this.web_url = '';
	            $('#' + this.id).val('');
	        }
	    }
	});

	if (!window._logo_input_css) {
	    document.write('\n\n<style type="text/css" media="screen" >\n.up_wrap{\n    position: relative;\n    text-align: center;\n    border: 2px dashed #ccc;\n    background: #FDFDFD;\n    width:300px;\n}\n.logo-input input[type="file"]{\n    opacity: 0;\n    position: absolute;\n    top: 40px;\n    left: 40px;\n    display: block;\n    cursor: pointer;\n}\n.closeDiv{\n    width: 100%;\n    height: 100%;\n    position: absolute;\n    top: 0;\n    left: 0;\n    background-color: #ffffff;\n}\n.choose{\n    display: inline-block;\n    text-decoration: none;\n    padding: 5px;\n    border: 1px solid #0092F2;\n    border-radius: 4px;\n    font-size: 14px;\n    color: #0092F2;\n    cursor: pointer;\n}\n.choose:hover,.choose:active{\n    text-decoration: none;\n    color: #0092F2;\n}\n.close{\n    position: absolute;\n    top: 5px;\n    right: 10px;\n    cursor: pointer;\n    font-size: 14px;\n    color: #242424;\n}\n.logoImg{\n    max-height: 100px !important;\n    vertical-align: middle;\n    margin-top: 5px;\n}\n.req_star{\n    color: red;\n    font-size: 200%;\n}\n</style>\n\n      ');
	}

	window.fl = fl;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.use_ckeditor = use_ckeditor;

	//function import_ckeditor() {
	//	document.write("<script src='/static/ckeditor/ckeditor.js'></script>")
	//}

	//ckEditor={
	//		import:import_ckeditor,
	//	}
	//module.exports=ckEditor

	function use_ckeditor() {
		document.write('<script src="http://cdn.bootcss.com/ckeditor/4.5.10/ckeditor.js"></script>');
	}

	Vue.component('ckeditor', {
		template: '<div class=\'ckeditor\'>\n\t\t    \t<textarea class="form-control" class="form-control" name="ri" ></textarea>\n\t    \t</div>',
		props: {
			model: {
				twoWay: true
			},
			config: {
				default: '',
				coerce: function coerce(val) {
					if (val == 'complex') {
						return 'http://ocm6l2tt6.bkt.clouddn.com/config_complex.js';
					} else {
						return val;
					}
				}

			}
		},
		compiled: function compiled() {
			var editor = CKEDITOR.replace($(this.$el).find('textarea')[0], { customConfig: this.config });
			editor.setData(this.model);
			this.editor = editor;
		},
		events: {
			'sync_data': function sync_data() {
				this.model = this.editor.getData();
			}
		}
	});

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	if (!window.__multi_sel) {
		document.write('\n\t\n<style type="text/css" media="screen" id="test">\n._tow-col-sel .sel{\n\twidth:250px;\n\tdisplay: inline-block;\n\tvertical-align: middle;\n}\n._tow-col-sel .sel.right{\n\tborder-width:2px;\n}\n._tow-col-sel ._small_icon{\n\twidth:15px;\n}\n._tow-col-sel ._small_icon.deactive{\n\topacity: 0.5;\n\t-moz-opacity: 0.5;\n\tfilter:alpha(opacity=50);\n}\n</style>\n\n\t');
	}

	var temp_tow_col_sel = '\n<div class=\'_tow-col-sel\'>\n\t\t<select name="" id="" multiple="multiple" :size="size" class=\'sel left\' v-model=\'left_sel\' >\n\t\t\t<option v-for=\'opt in orderBy(can_select,"label")\' :value="opt.value" v-text=\'opt.label\' @dblclick=\'add(opt)\' ></option>\n\t\t</select>\n\t\t<div style=\'display: inline-block;vertical-align: middle;\'>\n\t\t\t<img src="http://oe8wu3kqs.bkt.clouddn.com/image/right_02.png" alt="" \n\t\t\t\t:class=\'["_small_icon",{"deactive":left_sel.length==0}]\' @click=\'batch_add()\'>\n\t\t\t<br>\n\t\t\t<img src="http://oe8wu3kqs.bkt.clouddn.com/image/left_02.png" alt="" \n\t\t\t\t:class=\'["_small_icon",{"deactive":right_sel.length==0}]\' @click=\'batch_rm()\'>\n\t\t</div>\n\t\t\n\t\t<select name="" id="" multiple="multiple" :size="size" class=\'sel right\' v-model=\'right_sel\' >\n\t\t\t<option v-for=\'opt in orderBy(selected__,"label")\' :value="opt.value" v-text=\'opt.label\' @dblclick=\'rm(opt)\'></option>\n\t\t</select>\n</div>\n';

	Vue.component('tow-col-sel', {
		template: temp_tow_col_sel,
		props: {
			choices: {},
			value: {
				default: function _default() {
					return [];
				}
			},
			size: {
				default: 6
			}
		},
		data: function data() {
			return {
				selected: this.value,
				selected__: [],
				can_select: JSON.parse(JSON.stringify(this.choices)),
				left_sel: [],
				right_sel: []
			};
		},
		mounted: function mounted() {
			var self = this;
			this.selected__ = ex.remove(this.can_select, function (item) {
				return ex.isin(item.value, self.value);
			});
		},
		watch: {
			selected: function selected(v) {
				this.$emit('input', v);
			}
		},

		methods: {
			orderBy: function orderBy(array, key) {
				return array.slice().sort(function (a, b) {
					if (a[key] > b[key]) {
						return 1;
					} else if (a[key] < b[key]) {
						return -1;
					} else {
						return 0;
					}
				});
			},
			add: function add(opt) {
				this.selected__.push(opt);
				this.selected.push(opt.value);
				var index = this.can_select.indexOf(opt);
				if (index != -1) {
					this.can_select.splice(index, 1);
				}
				this.left_sel = [];
			},
			rm: function rm(opt) {
				var index = this.selected__.indexOf(opt);
				if (index != -1) {
					this.selected__.splice(index, 1);
				}
				var index_2 = this.selected.indexOf(opt.value);
				if (index_2 != -1) {
					this.selected.splice(index_2, 1);
				}
				this.can_select.push(opt);
				this.right_sel = [];
			},
			batch_add: function batch_add() {
				var tmp_ls = this.left_sel;
				for (var x = 0; x < tmp_ls.length; x++) {
					for (var y = 0; y < this.choices.length; y++) {
						if (this.choices[y].value == tmp_ls[x]) {
							this.add(this.choices[y]);
							break;
						}
					}
				}
			},
			batch_rm: function batch_rm() {
				var tmp_ls = this.right_sel;
				for (var x = 0; x < tmp_ls.length; x++) {
					for (var y = 0; y < this.selected__.length; y++) {
						if (this.selected__[y].value == tmp_ls[x]) {
							this.rm(this.selected__[y]);
							break;
						}
					}
				}
			}
		}
	});

/***/ }
/******/ ]);