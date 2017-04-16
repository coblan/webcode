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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
	if (!window.iclosed) {
		if (jqxhr.status != 0) {
			alert('server has error, error code is ' + jqxhr.status);
		} else {
			alert('maybe server offline,error code is ' + jqxhr.status);
		}
	}
}

//window.__proc_port_error=def_proc_port_msg
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

ex.load_css('//cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css');
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

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
>->front/link.rst>
=========
link
=========
示例::

     var director = '{% url 'director' %}'

     var cache_meta={
     cache:['person.emp_info.row',
            'person.bas_info.row',
            'crt_view'],
     rt_key:{'auth.user':'person.emp_info.row.user'}
     }

    //auth.user 是返回的值在storage中的key，person.emp_info.row.user是还原的对象路径

     ln.cache(cache_meta)

     // 下面是构造跳转的url,其中最重要的是需要appendSearch({cache:1})),表明返回时，需要读取cache
     var back_url=btoa(ex.appendSearch({cache:1}))
     if(pk){
     location=ex.template('{director}model/{name}/edit/{pk}?next={encode_url}',{director:director,name:name,pk:pk,encode_url:back_url})
     }else{
     location=ex.template('{director}model/{name}/edit?next={encode_url}',{director:director,name:name,encode_url:back_url})
     }

readCache
	@root_obj

cache
	@cache_meta
	@root_obj : 如果没写，默认是window


history
========
利用h5的history功能，是的地址栏发生变化，并且不会触发服务器请求。该功能可以用在ajax请求，将ajax请求记录在history中，可以达到前进后退的功能。

pushUrl
    url入栈

popUrlListen:
    监听pop history事件，点击前进后退按钮时，刷新整个页面。如果需要精细的控制，在不刷新页面的情况下，切换状态，需要自定义事件handler

<-<
 */

var ln = {

    readCache: function readCache(root_obj) {
        var root_obj = root_obj || window;
        //if(ex.parseSearch().cache){
        var cache_obj_str = sessionStorage.getItem(location.href);
        sessionStorage.removeItem(location.href);
        if (cache_obj_str) {
            var cache_obj = JSON.parse(cache_obj_str);
            for (var key in cache_obj.window) {
                ex.set(root_obj, key, cache_obj.window[key]);
            }

            var cache_meta = cache_obj.cache_meta;
            if (cache_meta && cache_meta.rt_key) {
                for (var key in cache_meta.rt_key) {
                    var value = sessionStorage.getItem(key);
                    if (value) {
                        var targ_key = cache_meta.rt_key[key];
                        sessionStorage.removeItem(key);
                        ex.set(root_obj, targ_key, value);
                    }
                }
            }
            onload = function onload() {
                setTimeout(function () {
                    console.log(cache_obj._scroll.y);
                    window.scrollTo(cache_obj._scroll.x, cache_obj._scroll.y);
                }, 10);
            };
            $(function () {
                //setTimeout(function(){
                //    console.log(cache_obj._scroll.y)
                //    window.scrollTo(cache_obj._scroll.x,cache_obj._scroll.y)
                //},3000)

            });
        }
        //}
    },

    cache: function cache(cache_meta, root_obj) {

        var root_obj = root_obj || window;
        var cache_obj = {
            cache_meta: cache_meta,
            window: {},
            _scroll: { x: scrollX, y: scrollY }
        };

        if (cache_meta.cache) {
            ex.each(cache_meta.cache, function (key) {
                cache_obj.window[key] = ex.access(root_obj, key);
            });
        }
        sessionStorage.setItem(location.href, JSON.stringify(cache_obj));
    },

    openWin: function openWin(url, callback) {
        /*
          * */
        var norm_url = ex.appendSearch(url, { _pop: 1 });
        window.open(norm_url, url, 'height=500,width=800,resizable=yes,scrollbars=yes,top=200,left=300');
        window.__on_subwin_close = callback;
    },
    rtWin: function rtWin(resp) {
        if (window.opener && window.opener.__on_subwin_close) {
            window.opener.__on_subwin_close(resp);
        }
        window.opener.__on_subwin_close = null;
        window.close();
    },
    pushUrl: function pushUrl(url) {
        window.history.pushState(url, 0, url);
    },
    popUrlListen: function popUrlListen() {
        window.addEventListener('popstate', function (e) {
            /// <summary>
            ///　　　&#10;　在页面初始化加载完成中添加该事件，则可以监听到onpopstate事件，而浏览器进行前进、后退、刷新操作都会触发本事件
            ///　　　&#10;　linkFly原创，引用请注明出处，谢谢
            /// </summary>/// <returns type="void" />
            if (e.state) {
                location = e.state;
                //e.state就是pushState中保存的Data，我们只需要将相应的数据读取下来即可
            }
        });
    }

};

window.ln = ln;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.merge = merge;

var _ajax_fun = __webpack_require__(0);

var _inputs = __webpack_require__(4);

var inputs = _interopRequireWildcard(_inputs);

var _link = __webpack_require__(1);

var ln = _interopRequireWildcard(_link);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//import * as js from './adapt.js'


//require('./fields.scss')

//import * as f from './file.js'
//import * as ck from './ckeditor.js'
//import * as multi from './multi_sel.js'
(0, _ajax_fun.hook_ajax_msg)();
/*
 >->mobile/fields.rst>
 =========
 fields
 =========

 fields模块的目标是利用vuejs快速生成form表单。

 主要结构
 ===========
 1. field_base
 基类，包括操作逻辑，专用input组件。如果需要修改整个field的外观，可以继承field_base，然后自定义wrap template

 2. field
 wrap功能，在field_base外面套上了一层外观template，例如label，error,help_text等的显示。

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


 <-<
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

(0, _ajax_fun.hook_ajax_csrf)();

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
            if (!this.kw.errors) {
                Vue.set(this.kw, 'errors', {});
            }
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
            template: '<div>\n            \t\t\t<span v-if=\'kw.readonly\' v-text=\'row[name]\'></span>\n            \t\t\t<input v-else type="text" class="weui-input" v-model="row[name]" :id="\'id_\'+name"\n                        \t:placeholder="kw.placeholder" :autofocus="kw.autofocus" :maxlength=\'kw.maxlength\'>\n                       </div>'
        },
        number: {
            props: ['name', 'row', 'kw'],

            template: '<div><span v-if=\'kw.readonly\' v-text=\'row[name]\'></span>\n            \t\t<input v-else type="number" class="weui-input" v-model="row[name]" :id="\'id_\'+name"\n                        :placeholder="kw.placeholder" :autofocus="kw.autofocus"></div>'
        },
        password: {
            props: ['name', 'row', 'kw'],
            template: '<input type="password" :id="\'id_\'+name" class="form-control" v-model="row[name]" :placeholder="kw.placeholder" :readonly=\'kw.readonly\'>'
        },
        blocktext: {
            props: ['name', 'row', 'kw'],
            template: '<div>\n            <span v-if=\'kw.readonly\' v-text=\'row[name]\'></span>\n            <textarea v-else class="weui-textarea" rows="3" :id="\'id_\'+name" v-model="row[name]" :placeholder="kw.placeholder" :readonly=\'kw.readonly\'></textarea>\n            </div>'
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
                                self.src_color = color.toHexString();
                                self.row[self.name] = color.toHexString();
                            }
                        });
                    });
                }
            },
            watch: {
                input_value: function input_value(value) {
                    if (this.src_color != value) {
                        this.init_and_listen();
                    }
                }
            },
            computed: {
                input_value: function input_value() {
                    return this.row[this.name];
                }
            },
            mounted: function mounted() {
                var self = this;
                ex.load_css('//cdn.bootcss.com/spectrum/1.8.0/spectrum.min.css');
                ex.load_js('//cdn.bootcss.com/spectrum/1.8.0/spectrum.min.js', function () {
                    self.init_and_listen();
                });
            }
        },
        logo: { // absolate
            props: ['name', 'row', 'kw'],
            template: '<logo-input :up_url="kw.up_url" :web_url.sync="row[name]" :id="\'id_\'+name"></logo-input>'
        },
        picture: {
            props: ['name', 'row', 'kw'],
            template: '<div><img class="img-uploador" v-if=\'kw.readonly\' :src=\'row[name]\'/>\n\t\t\t<img-uploador v-else :up_url="kw.up_url" v-model="row[name]" :id="\'id_\'+name" :config="kw.config"></img-uploador></div>'
        },
        sim_select: {
            props: ['name', 'row', 'kw'],
            data: function data() {
                return {
                    model: this.row[this.name]
                };
            },
            template: ' <div>\n            <span v-if=\'kw.readonly\' v-text=\'get_label(kw.options,row[name])\'></span>\n            <select v-else v-model=\'row[name]\'  :id="\'id_\'+name"  class="weui-select">\n            \t<option v-for=\'opt in kw.options\' :value=\'opt.value\' v-text=\'opt.label\'></option>\n            </select>\n            </div>',
            mounted: function mounted() {
                if (this.kw.default && !this.row[this.name]) {
                    Vue.set(this.row, this.name, this.kw.default);
                    //this.row[this.name]=this.kw.default
                }
            },
            methods: {
                get_label: function get_label(options, value) {
                    var option = ex.findone(options, { value: value });
                    if (!option) {
                        return '---';
                    } else {
                        return option.label;
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
            template: '<div class="checkbox">\n\t        <input type="checkbox" :id="\'id_\'+name" v-model=\'row[name]\' :disabled="kw.readonly">\n\t\t\t <label :for="\'id_\'+name"><span v-text=\'kw.label\'></span></label>\n\t\t\t\t\t  </div>'
        },
        date: {
            props: ['name', 'row', 'kw'],
            template: '<div><span v-if=\'kw.readonly\' v-text=\'row[name]\'></span>\n            \t\t\t<date class="form-control" v-model="row[name]" :id="\'id_\'+name"\n                        \t:placeholder="kw.placeholder"></date>\n                       </div>'
        },
        datetime: {
            props: ['name', 'row', 'kw'],
            template: '<div><span v-if=\'kw.readonly\' v-text=\'row[name]\'></span>\n            \t\t\t<datetime class="form-control" v-model="row[name]" :id="\'id_\'+name"\n                        \t:placeholder="kw.placeholder"></datetime>\n                       </div>'
        },
        richtext: {
            props: ['name', 'row', 'kw'],
            template: '<div><span v-if=\'kw.readonly\' v-text=\'row[name]\'></span>\n            \t\t\t<ckeditor  v-model="row[name]" :id="\'id_\'+name"></ckeditor>\n                       </div>'
        }
    }

};

//    <div for='field' class="form-group field" :class='{"error":error_data(name)}' v-if="head">
//    <label :for="'id_'+name"  class="control-label" v-if='!head.no_auto_label'>
//    <span v-text="head.label"></span><span class="req_star" v-if='head.required'>*</span>
//</label>
//
//<div class="field_input">
//    <component :is='head.type'
//:row='row'
//:name='name'
//:kw='head'>
//    </component>
//    </div>
//    <div class="help_text"><span v-text="head.help_text"></span></div>
//<slot> </slot>
//<div v-for='error in error_data(name)' v-text='error' class='error'></div>
//    </div>

//<div v-if="show_title(head)" class="weui-cells__title" v-text="head.label"></div>

var field = {
    mixins: [field_base],
    methods: {
        show_label: function show_label(head) {
            if (ex.isin(head.type, ['blocktext']) || head.no_auto_label) {
                return false;
            } else {
                return true;
            }
        },
        show_title: function show_title(head) {
            return ex.isin(head.type, ['blocktext']);
        }
    },
    template: '<div class="flex-v"  v-if="head">\n        <span></span>\n        <div v-if="show_title(head)" class="weui-cells__title block-title weui-cell" v-text="head.label"></div>\n        <div :class=\'["weui-cell","field",{"error":error_data(name),"weui-cell_select weui-cell_select-after":head.type=="sim_select"}]\'>\n            <div class="weui-cell__hd" v-if=\'show_label(head)\'>\n                <label  class="weui-label" :for="\'id_\'+name">\n                    <span v-text="head.label"></span>\n                </label>\n            </div>\n            <div class="weui-cell__bd field_input">\n                <component :is=\'head.type\'\n                    :row=\'row\'\n                    :name=\'name\'\n                    :kw=\'head\'>\n                </component>\n             </div>\n        </div>\n        <div v-for=\'error in error_data(name)\' v-text=\'error\' class=\'error\'></div>\n    </div>'

};

Vue.component('field', field);

function update_vue_obj(vue_obj, obj) {
    for (var x in vue_obj) {
        Vue.delete(vue_obj, x);
    }
    for (var _x in obj) {
        Vue.set(vue_obj, _x, obj[_x]);
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
}

var field_fun = {
    data: function data() {
        return {
            kw: {
                heads: heads,
                row: row,
                errors: {}
            },
            menu: menu,

            can_add: can_add,
            can_del: can_del,
            can_log: can_log
        };
    },

    methods: {
        submit: function submit() {
            var self = this;
            (0, _ajax_fun.show_upload)();
            var search = ex.parseSearch(); //parseSearch(location.search)
            var post_data = [{ fun: 'save', row: this.kw.row }];
            ex.post('', JSON.stringify(post_data), function (resp) {
                if (resp.save.errors) {
                    self.kw.errors = resp.save.errors;
                    (0, _ajax_fun.hide_upload)();
                } else if (search._pop == 1) {
                    window.ln.rtWin({ row: resp.save.row });
                } else if (search.next) {

                    location = decodeURIComponent(search.next);
                } else {
                    (0, _ajax_fun.hide_upload)(1000);
                }
            });
        },
        cancel: function cancel() {
            var search = ex.parseSearch(); //parseSearch(location.search)
            if (search._pop) {
                window.close();
            } else {
                history.back();
            }
        },
        del_row: function del_row(path) {
            var search_args = ex.parseSearch();
            location = ex.template('{engine_url}/del_rows?rows={class}:{pk}&next={next}&_pop={pop}', { class: this.kw.row._class,
                engine_url: engine_url,
                pk: this.kw.row.pk,
                next: search_args.next,
                pop: search_args._pop

            });
        },
        log_url: function log_url() {
            var obj = {
                pk: this.kw.row.pk,
                _class: this.kw.row._class,
                engine_url: engine_url,
                page_name: page_name
            };
            return ex.template('{engine_url}/log?rows={_class}:{pk}', obj);
        }
    }
};
Vue.component('com-form-btn', {
    data: function data() {
        return {
            can_add: can_add,
            can_del: can_del
        };
    },
    props: ['submit', 'del_row', 'cancel'],
    template: '<div style=\'overflow: hidden;\'>\n\t\t<div class="btn-group" style=\'float: right;\'>\n\t\t\t<button type="button" class="btn btn-default" @click=\'submit()\' v-if=\'can_add\'>Save</button>\n\t\t\t<button type="button" class="btn btn-default" v-if=\'can_del\' @click=\'del_row()\'>\u5220\u9664</button>\n\t\t\t<button type="button" class="btn btn-default" @click=\'cancel()\' >Cancel</button>\n\t\t</div>\n\t</div>'
});

window.field_fun = field_fun;
window.hook_ajax_msg = _ajax_fun.hook_ajax_msg;
window.update_vue_obj = update_vue_obj;
//window.use_ckeditor= ck.use_ckeditor
window.show_upload = _ajax_fun.show_upload;
window.hide_upload = _ajax_fun.hide_upload;
window.merge = merge;

/***/ }),
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by heyulin on 2017/1/24.
 *
 >->front/input.rst>
 =======
 inputs
 =======

 date
 ========
 ::

 <date v-model='variable'></date>  // 选择默认set=date ,即选择日期

 <date v-model='variable' set='month'></date> // 选择 set=month ,即选择月份

 <date v-model='variable' set='month' :config='{}'></date>  //  config 是自定义的配置对象，具体需要参加帮助文件

 datetime
 ===========
 ::

 <datetime v-model='variable' :config='{}'></datetime> // 选择日期和时间

 color
 ======

 forign-edit
 ============
 示例::

 <forign-edit :kw="person.emp_info" name="user" page_name="user" ></forign-edit>

 <-<
 */

var date_config_set = {
    date: {
        language: "zh-CN",
        format: "yyyy-mm-dd",
        autoclose: true,
        todayHighlight: true
    },
    month: {
        language: "zh-CN",
        format: "yyyy-mm",
        startView: "months",
        minViewMode: "months",
        autoclose: true

    }
};

Vue.component('date', {
    //template:'<input type="text" class="form-control">',
    template: "<span class=\"datetime-picker\">\n                <input type=\"text\"  class=\"weui-input\"/>\n                </span>",
    props: ['value', 'set', 'config'],
    mounted: function mounted() {
        var self = this;
        if (!this.set) {
            var def_conf = date_config_set.date;
        } else {
            var def_conf = date_config_set[this.set];
        }
        if (this.config) {
            ex.assign(def_conf, this.config);
        }
        self.input = $(this.$el).find('input');

        ex.load_css('//cdn.bootcss.com/bootstrap-datepicker/1.6.4/css/bootstrap-datepicker.min.css');

        ex.load_js('//cdn.bootcss.com/bootstrap-datepicker/1.6.4/js/bootstrap-datepicker.min.js', function () {
            ex.load_js('//cdn.bootcss.com/bootstrap-datepicker/1.6.4/locales/bootstrap-datepicker.zh-CN.min.js', function () {
                self.input.datepicker(def_conf).on('changeDate', function (e) {
                    self.$emit('input', self.input.val());
                });
                // if has init value,then init it
                if (self.value) {
                    self.input.datepicker('update', self.value);
                    self.input.val(self.value);
                }
            });
        });
    },
    methods: {
        click_input: function click_input() {
            this.input.focus();
        }
    },
    watch: {
        value: function value(n) {
            this.input.datepicker('update', n);
            this.input.val(n);
        }
    }
});

Vue.component('datetime', {
    //data:function(){
    //    return {
    //        input_value:'',
    //    }
    //},
    //template:'<input type="text" class="form-control">',
    template: "<span class=\"datetime-picker\">\n                <span class=\"cross\" @click=\"$emit('input','')\">X</span>\n                <input type=\"text\" readonly/>\n                </span>",
    props: ['value', 'config'],
    mounted: function mounted() {
        var self = this;
        var def_conf = {
            language: "zh-CN",
            format: "yyyy-mm-dd hh:ii",
            autoclose: true,
            todayHighlight: true
        };
        if (self.config) {
            ex.assign(def_conf, this.config);
        }
        self.input = $(this.$el).find('input');

        ex.load_css('https://cdn.bootcss.com/smalot-bootstrap-datetimepicker/2.4.3/css/bootstrap-datetimepicker.min.css');
        ex.load_js('https://cdn.bootcss.com/moment.js/2.17.1/moment.min.js');
        ex.load_js('https://cdn.bootcss.com/smalot-bootstrap-datetimepicker/2.4.3/js/bootstrap-datetimepicker.min.js', function () {

            self.input.datetimepicker(def_conf).on('changeDate', function (e) {
                self.$emit('input', self.input.val());
            });

            // if has init value,then init it
            if (self.value) {
                self.input.datepicker('update', self.value);
                self.input.val(self.value);
            }
        });
    },

    watch: {
        value: function value(n) {
            this.input.val(n);
            this.input.val(n);
        }
    }
});

var color = {
    props: ['value'],
    template: "<input type=\"text\">",
    methods: {
        init_and_listen: function init_and_listen() {
            var self = this;
            Vue.nextTick(function () {
                $(self.$el).spectrum({
                    color: self.value,
                    showInitial: true,
                    showInput: true,
                    preferredFormat: "name",
                    change: function change(color) {
                        self.src_color = color.toHexString();
                        self.$emit('input', self.src_color);
                    }
                });
            });
        }
    },
    watch: {
        value: function value(_value) {
            if (this.src_color != _value) {
                this.init_and_listen();
            }
        }
    },
    mounted: function mounted() {
        var self = this;
        ex.load_css('https://cdn.bootcss.com/spectrum/1.8.0/spectrum.min.css');
        ex.load_js('https://cdn.bootcss.com/spectrum/1.8.0/spectrum.min.js', function () {
            self.init_and_listen();
        });
    }
};

Vue.component('color', color);

ex.append_css("<style type=\"text/css\" media=\"screen\">\n    .datetime-picker{\n        position: relative;\n        display: inline-block;\n    }\n    .datetime-picker input[readonly]{\n        background-color: white;\n    }\n\t.datetime-picker .cross{\n\t    display: none;\n\t}\n\t.datetime-picker:hover .cross{\n\t    display: inline-block;\n\t    position: absolute;\n\t    right: 8px;\n\t    top:3px;\n\t    cursor: pointer;\n\t    /*z-index: 10;*/\n\t}\n</style>\n ");

var forignEdit = {
    template: "<div class=\"forign-key-panel\">\n        <button v-if=\"has_pk()\" @click=\"jump_edit(kw.row[name])\" title=\"{% trans 'edit' %}\">\n            <i class=\"fa fa-pencil-square-o\" aria-hidden=\"true\"></i></button>\n        <button @click=\"jump_edit()\" title=\"{% trans 'new' %}\"><i class=\"fa fa-plus\" aria-hidden=\"true\"></i></button>\n    </div>",
    props: ['kw', 'name', 'page_name'],
    methods: {
        jump_edit: function jump_edit(pk) {
            var name = this.name;
            var kw = this.kw;
            var page_name = this.page_name || this.name;
            var options = ex.findone(kw.heads, { name: name }).options;
            var row = kw.row;
            var pk = pk || '';

            var url = ex.template('{engine_url}/{page_name}.edit?pk={pk}', {
                engine_url: engine_url,
                page_name: page_name,
                pk: pk
            });
            ln.openWin(url, function (resp) {
                if (resp.del_rows) {
                    ex.remove(options, function (option) {
                        return ex.isin(option, resp.del_rows, function (op, del_row) {
                            return op.value == del_row.pk;
                        });
                    });
                } else if (resp.row) {
                    if (pk) {
                        var option = ex.findone(options, { value: pk });
                        option.label = resp.row._label;
                    } else {
                        options.push({ label: resp.row._label, value: resp.row.pk });
                        row[name] = resp.row.pk;
                    }
                }
            });
        },
        has_pk: function has_pk() {
            if (this.kw.row[this.name]) {
                return true;
            } else {
                return false;
            }
        }
    }
};

ex.append_css("\n<style type=\"text/css\">\n    .forign-key-panel{\n        padding: 6px;\n    }\n</style>");

Vue.component('forign-edit', forignEdit);

/***/ })
/******/ ]);