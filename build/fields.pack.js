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

	var _pkg = __webpack_require__(1);

	var _ajax_fun = __webpack_require__(2);

	var _file = __webpack_require__(3);

	var f = _interopRequireWildcard(_file);

	var _ckeditor = __webpack_require__(4);

	var ck = _interopRequireWildcard(_ckeditor);

	var _multi_sel = __webpack_require__(5);

	var multi = _interopRequireWildcard(_multi_sel);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	(0, _ajax_fun.hook_ajax_msg)();
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
	*配合自家的jsonpost使用，效果最好
	*/

	/*
	自动处理form.errors
	$.post('',JSON.stringify(post_data),function (data) {
		is_valid(data.do_login,self.meta.errors,function () {
			location=next;
	})
	*/

	//import {use_color} from '../dosome/color.js'

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
	        text: {
	            props: ['name', 'model', 'kw'],
	            template: '<input type="text" class="form-control" v-model="model" :id="\'id_\'+name"\n                        :placeholder="kw.placeholder" :autofocus="kw.autofocus" :maxlength=\'kw.maxlength\'>'
	        },
	        password: {
	            props: ['name', 'model', 'kw'],
	            template: '<input type="password" :id="\'id_\'+name" class="form-control" v-model="model" :placeholder="kw.placeholder">'
	        },
	        area: {
	            props: ['name', 'model', 'kw'],
	            template: '<textarea class="form-control" rows="3" :id="\'id_\'+name" v-model="model" :placeholder="kw.placeholder"></textarea>'
	        },
	        color: {
	            props: ['name', 'model', 'kw'],
	            template: '<input type="text" v-model="model" :id="\'id_\'+name">',
	            watch: {
	                'model': function model() {
	                    this.sync_to_spec();
	                }
	            },
	            methods: {
	                sync_to_spec: function sync_to_spec() {
	                    var self = this;
	                    Vue.nextTick(function () {
	                        $(self.$el).spectrum({
	                            color: this.model,
	                            showInitial: true,
	                            showInput: true,
	                            preferredFormat: "name"
	                        });
	                    });
	                }
	            },
	            compiled: function compiled() {
	                var self = this;
	                (0, _pkg.load_css)('http://cdn.bootcss.com/spectrum/1.8.0/spectrum.min.css');
	                (0, _pkg.load_js)('http://cdn.bootcss.com/spectrum/1.8.0/spectrum.min.js', function () {
	                    self.sync_to_spec();
	                });
	            }
	        },
	        logo: {
	            props: ['name', 'model', 'kw'],
	            template: '<logo-input :up_url="kw.up_url" :web_url.sync="model" :id="\'id_\'+name"></logo-input>'
	        },
	        sim_select: {
	            props: ['name', 'model', 'kw'],
	            template: '<select v-model=\'model\'  :id="\'id_\'+name">\n            \t<option :value=\'null\'>----</option>\n            \t<option v-for=\'opt in kw.options\' :value=\'opt.value\' v-text=\'opt.label\'></option>\n            </select>'
	        },
	        tow_col: {
	            props: ['name', 'model', 'kw'],
	            template: '<tow-col-sel :selected.sync=\'model\' :id="\'id_\'+name" :choices=\'kw.options\' :size=\'kw.size\'></tow-col-sel>'
	        },
	        bool: {
	            props: ['name', 'model', 'kw'],
	            template: '<div class="checkbox">\n\t\t\t\t\t    <label><input type="checkbox" :id="\'id_\'+name" v-model=\'model\'>\n\t\t\t\t\t    \t<span v-text=\'kw.label\'></span>\n\t\t\t\t\t    </label>\n\t\t\t\t\t  </div>'
	        }
	    }

	};
	//'set.label_cls'   set.input_cls
	Vue.component('field', {
	    mixins: [field_base],
	    template: '\n\t<div for=\'field\' class="form-group field" :class=\'{"error":error_data(name)}\'>\n\t<label :for="\'id_\'+name" v-text="head.label" class="control-label" v-if=\'!head.no_auto_label\'>\n\t\t<span class="req_star" v-if=\'head.required\'> *</span>\n\t</label>\n\t<div class="field_input">\n        <component :is=\'head.type\'\n            :model.sync=\'row[name]\'\n            :name=\'name\'\n            :kw=\'head\'>\n        </component>\n\t</div>\n\t<slot> </slot>\n\t<div v-text=\'error_data(name)\' class=\'error\'></div>\n    </div>\n'

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
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	        for (var _iterator = sub[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var _sub = _step.value;
	            var _iteratorNormalCompletion2 = true;
	            var _didIteratorError2 = false;
	            var _iteratorError2 = undefined;

	            try {
	                for (var _iterator2 = mains[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                    var main = _step2.value;

	                    if (main.name == _sub.name) {
	                        for (var k in _sub) {
	                            main[k] = _sub[k];
	                        }
	                        break;
	                    }
	                }
	            } catch (err) {
	                _didIteratorError2 = true;
	                _iteratorError2 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                        _iterator2.return();
	                    }
	                } finally {
	                    if (_didIteratorError2) {
	                        throw _iteratorError2;
	                    }
	                }
	            }
	        }
	    } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	                _iterator.return();
	            }
	        } finally {
	            if (_didIteratorError) {
	                throw _iteratorError;
	            }
	        }
	    }
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
	exports.load_js = load_js;
	exports.load_css = load_css;
	function load_js(src, success) {
		success = success || function () {};

		var name = btoa(src);
		if (window['__src_' + name]) {
			return success();
		}
		window['__src_' + name] = true;

		var domScript = document.createElement('script');
		domScript.src = src;

		domScript.onload = domScript.onreadystatechange = function () {
			if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
				success();
				this.onload = this.onreadystatechange = null;
				this.parentNode.removeChild(this);
			}
		};
		document.getElementsByTagName('head')[0].appendChild(domScript);
	}

	function load_css(src) {
		var name = btoa(src);
		if (window['__src_' + name]) {
			return;
		}
		window['__src_' + name] = true;
		$('head').append('<link rel="stylesheet" href="' + src + '" type="text/css" />');
	}

	//var s = document.createElement("script");
	//s.type = "text/javascript";
	//s.src = "http://somedomain.com/somescript";
	//$("head").append(s);

/***/ },
/* 2 */
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

	function def_proc_port_msg(data) {
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

		$(document).ajaxSuccess(function (event, data) {
			window.__proc_port_error(data);
		}).ajaxError(function (event, jqxhr, settings, thrownError) {
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
	function hide_upload() {
		$('#load_wrap').hide();
	}

	if (!window.__font_awesome) {
		window.__font_awesome = true;
		document.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">');
	}

	if (!window.__uploading_mark) {
		window.__uploading_mark = true;
		document.write('\n\t\t<style>\n\t\t.popup{\n\t\t\tposition: fixed;\n\t\t\ttop: 0;\n\t\t\tleft: 0;\n\t\t\tright: 0;\n\t\t\tbottom: 0;\n\t\t\tdisplay:none;\n\t\t}\n\t\t#_upload_inn{\n\t\t\tbackground: rgba(88, 88, 88, 0.2);\n\t\t\tborder-radius: 5px;\n\t\t\twidth:180px;\n\t\t\theight:120px;\n\t\t\t/*padding:30px 80px ;*/\n\t\t}\n\t\t.imiddle{\n\t    position: absolute;\n        top: 50%;\n        left: 50%;\n        transform: translate(-50%, -50%);\n        -ms-transform:translate(-50%, -50%); \t/* IE 9 */\n\t\t-moz-transform:translate(-50%, -50%); \t/* Firefox */\n\t\t-webkit-transform:translate(-50%, -50%); /* Safari �� Chrome */\n\t\t-o-transform:translate(-50%, -50%); \n\t\t\n        text-align: center;\n\t\t/*display: table;*/\n        z-index: 1000;\n    \t}\n    \t#_upload_mark{\n    \t\tfloat: left;\n\n    \t}\n\t\t</style>');
		$(function () {
			$('body').append('<div class="popup" id="load_wrap"><div id=\'_upload_inn\' class="imiddle">\n\t\t<div  id="_upload_mark" class="imiddle"><i class="fa fa-spinner fa-spin fa-3x"></i></div></div></div>');
		});
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	/*
	file-input
	===========


	*/

	Vue.component('file-input', {
	    template: "<input type='file' @change='_changed'>",
	    props: {},
	    methods: {
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

/***/ },
/* 4 */
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
/* 5 */
/***/ function(module, exports) {

	'use strict';

	if (!window.__multi_sel) {
		document.write('\n\t\n<style type="text/css" media="screen" id="test">\n._tow-col-sel .sel{\n\twidth:250px;\n\tdisplay: inline-block;\n\tvertical-align: middle;\n}\n._tow-col-sel .sel.right{\n\tborder-width:2px;\n}\n._tow-col-sel ._small_icon{\n\twidth:15px;\n}\n._tow-col-sel ._small_icon.deactive{\n\topacity: 0.5;\n\t-moz-opacity: 0.5;\n\tfilter:alpha(opacity=50);\n}\n</style>\n\n\t');
	}

	var temp_tow_col_sel = '\n<div class=\'_tow-col-sel\'>\n\t\t<select name="" id="" multiple="multiple" :size="size" class=\'sel left\' v-model=\'left_sel\'>\n\t\t\t<option v-for=\'opt in choices |orderBy "label"\' :value="opt.value" v-text=\'opt.label\' @dblclick=\'add(opt)\' ></option>\n\t\t</select>\n\t\t<div style=\'display: inline-block;vertical-align: middle;\'>\n\t\t\t<img src="http://oe8wu3kqs.bkt.clouddn.com/image/right_02.png" alt="" \n\t\t\t\t:class=\'["_small_icon",{"deactive":left_sel.length==0}]\' @click=\'batch_add()\'>\n\t\t\t<br>\n\t\t\t<img src="http://oe8wu3kqs.bkt.clouddn.com/image/left_02.png" alt="" \n\t\t\t\t:class=\'["_small_icon",{"deactive":right_sel.length==0}]\' @click=\'batch_rm()\'>\n\t\t</div>\n\t\t\n\t\t<select name="" id="" multiple="multiple" :size="size" class=\'sel right\' v-model=\'right_sel\'>\n\t\t\t<option v-for=\'opt in selected__ |orderBy "label"\' :value="opt.value" v-text=\'opt.label\' @dblclick=\'rm(opt)\'></option>\n\t\t</select>\n</div>\n';

	Vue.component('tow-col-sel', {
		template: temp_tow_col_sel,
		props: {
			choices: {},
			selected: {
				twoWay: true
			},
			size: {
				default: 6
			}
		},
		data: function data() {
			return {
				selected__: [],
				left_sel: [],
				right_sel: []
			};
		},
		compiled: function compiled() {
			for (var x = 0; x < this.selected.length; x++) {
				for (var y = 0; y < this.choices.length; y++) {
					if (this.choices[y].value == this.selected[x]) {
						this.selected__.push(this.choices[y]);
						this.choices.splice(y, 1);
						break;
					}
				}
			}
		},
		methods: {
			add: function add(opt) {
				this.selected__.push(opt);
				this.selected.push(opt.value);
				var index = this.choices.indexOf(opt);
				if (index != -1) {
					this.choices.splice(index, 1);
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
				this.choices.push(opt);
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