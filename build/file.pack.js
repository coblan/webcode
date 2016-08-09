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
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var detail = 'this is file_input field';
	exports.detail = detail;


	Vue.component('file-input', {
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
	                url: this.upload_url,
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
	    template: '\n          <div class=\'up_wrap logo-input\'>\n            <file-input :id=\'id\'\n                accept=\'image/gif,image/jpeg,image/png\'\n                :up_url=\'up_url\'\n                @rt_url= \'get_web_url($event)\'>\n            </file-input>\n            <div style="padding: 40px">\n                <a class=\'choose\'>Choose</a>\n            </div>\n            <div v-if=\'web_url\' class="closeDiv">\n            <div class="close" @click=\'clear()\'>X</div>\n            <img :src="web_url" alt="" class="logoImg">\n            </div>\n            </div>\n        ',
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

/***/ }
/******/ ]);