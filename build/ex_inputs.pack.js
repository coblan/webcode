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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*

>5>extra_input.rst>

catalog
=========
该模块有对应的后端

使用示例::

     <com-catalog ref="catalog" url="/dir_mana" :root="{pk:null,name:'root'}" @dirclick="on_dirclick($event)"
     @itemclick="on_itemclick($event)" @state="set_state($event)" :editable="true"></com-catalog>
<-<
* */

var com_catalog = {
    props: ['url', 'root', 'editable'],
    data: function data() {
        return {
            dirs: [],
            items: [],
            org_parents: [],
            crt_dir: this.root,
            selected: [],
            cut_list: []
        };
    },
    mounted: function mounted() {
        this.dir_data(this.root);
    },
    computed: {
        parents: function parents() {
            if (!this.root.pk) {
                return this.org_parents;
            } else {
                var root_obj = ex.findone(this.org_parents, { pk: root.pk });
                var idx = this.org_parents.indexOf(root_obj);
                return this.org_parents.slice(idx);
            }
        },
        state: function state() {
            return {
                can_cut: this.can_cut,
                can_paste: this.can_paste,
                has_select: this.selected.length > 0
            };
        },
        can_cut: function can_cut() {
            if (this.selected.length > 0) {
                return true;
            }
        },
        can_paste: function can_paste() {
            return this.cut_list.length > 0;
        }
    },
    watch: {
        state: function state(v) {
            this.$emit('state', v);
        }
    },
    methods: {
        dir_data: function dir_data(par) {
            this.crt_dir = par || this.crt_dir;

            var self = this;
            this.selected = [];
            var url = this.url + ex.template('?_op=dir_data:par:{par}', { par: this.crt_dir.pk });
            ex.get(url, function (resp) {
                self.dirs = resp.dir_data.dirs;
                self.items = resp.dir_data.items;
                self.org_parents = resp.dir_data.parents;
            });
        },
        dir_create: function dir_create() {
            var self = this;
            show_upload();
            var url = this.url + ex.template('?_op=dir_create:par:{par}', { par: this.crt_dir.pk });
            ex.get(url, function (resp) {
                self.dirs.push(resp.dir_create);
                hide_upload(200);
            });
        },
        item_create: function item_create() {
            var self = this;
            var url = this.url + ex.template('?_op=item_create:par:{par}', { par: this.crt_dir.pk });
            ex.get(url, function (resp) {
                self.items.push(resp.item_create);
            });
        },
        cut: function cut() {
            this.cut_list = this.selected.slice();
        },
        paste: function paste() {
            var self = this;
            var post_data = [{ fun: 'items_paste', rows: this.cut_list, par: this.crt_dir.pk }];
            self.cut_list = [];
            ex.post(this.url, JSON.stringify(post_data), function (resp) {
                self.dir_data(self.crt_dir);
            });
        },
        item_del: function item_del() {
            var self = this;
            show_upload();
            var obj = {};
            ex.each(this.selected, function (item) {
                if (!obj[item._class]) {
                    obj[item._class] = item.pk;
                } else {
                    obj[item._class] += ':' + item.pk;
                }
            });
            var del_str = '';
            for (var k in obj) {
                del_str += k + ':' + obj[k] + ',';
            }
            location = engine_url + '/del_rows?rows=' + del_str + '&next=' + encodeURIComponent(location.href);
        }
    },
    template: '<div>\n    <div class="flex">\n        <ol class="breadcrumb flex-grow">\n            <li ><a href="javacript:;" @click="dir_data(root)">root</a></li>\n            <li v-for="dir in parents" ><a href="javacript:;" v-text="dir.name" @click="dir_data(dir);$emit(\'dirclick\',dir)" ></a></li>\n        </ol>\n        <slot name="head_end"></slot>\n    </div>\n\n\n\n    <div class="bd">\n        <ul>\n        <li v-for="dir in dirs" class="dir">\n            <input v-if="editable" type="checkbox" :value="dir" v-model="selected"/>\n            <slot name="dir_icon">\n                <i class="fa fa-folder" aria-hidden="true"></i>\n            </slot>\n\n            <span v-text="dir.name" class="clickable" @click="dir_data(dir);$emit(\'dirclick\',dir)"></span>\n        </li>\n        <li v-for="item in items" class="item">\n            <input type="checkbox" :value="item" v-model="selected"/>\n            <slot name="item_icon">\n                <i class="fa fa-file-o" aria-hidden="true"></i>\n            </slot>\n\n            <span v-text="item.name" class="clickable" @click="$emit(\'itemclick\',item)"></span>\n         </li>\n        </ul>\n    </div>\n    </div>'

};

Vue.component('com-catalog', com_catalog);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _catalog = __webpack_require__(0);

var catalog = _interopRequireWildcard(_catalog);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/***/ })
/******/ ]);