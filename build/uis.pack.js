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

	var template_str = '\n<div class=\'_expand_menu\'>\n\t<ul>\n\t\t<li v-for=\'act in menu\'>\n\t\t\t<a :class=\'["menu_item",{"selected":act.selected,"opened_submenu":opened_submenu==act.submenu}]\' \n\t\t\t\t:href=\'act.url\'\n\t\t\t\t@click=\'opened_submenu==act.submenu?opened_submenu="":opened_submenu=act.submenu\'>\n\t\t\t\t<span v-html=\'act.icon\' class=\'_icon\'></span><span v-text=\'act.label\'></span>\n\t\t\t\t<span class=\'left-arrow\' v-if=\'act.selected\'></span>\n\t\t\t</a>\n\t\t\t\n\t\t\t<ul class=\'submenu\' v-show=\'opened_submenu==act.submenu ||act.selected\' transition="expand">\n\t\t\t\t<li v-for=\'sub_act in act.submenu\' :class=\'{"active":sub_act.active}\'>\n\t\t\t\t\t<a :href=\'sub_act.url\' class=\'sub_item\'>\n\t\t\t\t\t\t<span v-text=\'sub_act.label\'></span>\n\t\t\t\t\t</a>\n\t\t\t\t\t\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t</li>\n\t</ul>\n</div>\n';

	Vue.component('expand_menu', {
		template: template_str,
		props: {
			menu: {
				coerce: function coerce(val) {
					var path = location.pathname;

					var matched = { url: '' };
					var matched_menu = { url: '' };
					var matched_submenu = { url: '' };

					for (var x = 0; x < val.length; x++) {
						var url = val[x].url;
						if (path.startsWith(url) && url.length > matched.url.length) {
							matched = val[x];
							matched_menu = val[x];
							matched_submenu = { url: '' };
						}
						var submenu = val[x].submenu || [];
						for (var y = 0; y < submenu.length; y++) {
							var url = submenu[y].url;
							if (path.startsWith(url) && url.length >= matched.url.length) {
								matched = submenu[y];
								matched_menu = val[x];
								matched_submenu = submenu[y];
							}
						}
					}
					if (matched_menu.url) {
						matched_menu.selected = true;
					}
					if (matched_submenu) {
						matched_submenu.active = true;
					}
					return val;
				}
			},
			data: function data() {
				return {
					opened_submenu: ''
				};
			}

		}
	});
	Vue.transition('expand', {
		beforeEnter: function beforeEnter(el) {
			$(el).slideDown(300);
		},

		leave: function leave(el) {
			$(el).slideUp(300);
		}

	});

	if (!window.__expand_menu) {
		document.write('\n <style type="text/css" media="screen" id="test">\n\t._expand_menu{\n\t\tbackground-color: #364150;\n\t}\n\t._expand_menu a{\n\t\tcolor: #8f97a3;\n\t}\n\t._expand_menu a:hover{\n\t\ttext-decoration: none;\n\t}\n\t._expand_menu ul{\n\t\tpadding: 0px;\n\t}\n\t._expand_menu ._icon{\n\t\tpadding: 0px 10px;\n\t}\n\t._expand_menu li{\n\t\tlist-style-type:none;\n\t\tcursor: pointer;\n\t\tposition: relative;\n\t\tpadding: 0px;\n\t}\n\t._expand_menu ul.submenu li{\n\t\tpadding: 5px 0px;\n\t}\n\t._expand_menu .menu_item{\n\t\tborder-top:1px solid #475563;\n\t\tpadding: 5px 0px;\n\t\tdisplay:block;\n\t}\n\t._expand_menu .sub_item{\n\t\tdisplay:block;\n\t}\n\t._expand_menu .opened_submenu{\n\t\tbackground-color: #2C3542;\n\t}\n\t._expand_menu ul.submenu{\n\t\tpadding:0px;\n\t}\n\t\n\t._expand_menu ul.submenu li{\n\t\tpadding-left: 20px;\n\t\tcolor: #B4BCC8;\n\t}\n\n\t._expand_menu .menu_item:hover{\n\t\tbackground-color: #2C3542;\n\t\tcolor: #A7BCAE;\n\t}\n\t._expand_menu ul.submenu li:hover , ._expand_menu .submenu .active{\n\t\tbackground-color: #3E4B5C;\n\t}\n\t._expand_menu .menu_item.selected{\n\t\tbackground-color: #1CAF9A;\n\t\tcolor: white;\n\t}\n   \t._expand_menu .left-arrow{\n\t   \tposition: absolute;\n\t   \tright:0px;\n\t   \tborder-top:12px solid transparent;\n\t   \tborder-bottom:12px solid transparent;\n\t   \tborder-right: 12px solid white;\n   \t}\n   \t.expand-transition {\n\t\t  transition: max-height .3s ease;\n\t\t\n\t}\n   </style>\n');
		window.__expand_menu = true;
	}

/***/ }
/******/ ]);