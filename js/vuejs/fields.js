
/*
>->front/fields.rst>
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
import {hook_ajax_msg,hook_ajax_csrf,show_upload,hide_upload} from '../ajax_fun.js'
import * as f from './file.js'
import * as ck from './ckeditor.js'
import * as multi from './multi_sel.js'
import * as inputs from './inputs.js'
import * as ln from './link.js'

//import * as fb from './field_base.js'
//import * as js from './adapt.js'
import  {field_base} from  './fields/base.js'
import  {field_fun} from './fields/field_page.js'
import  {BackOps,back_ops} from './fields/backend.js'
import  {order_by_key} from './fields/order.js'
require('./fields.scss')

hook_ajax_msg()
hook_ajax_csrf()



var field={
		mixins:[field_base],
		template:`
		<div for='field' class="form-group field" :class='{"error":error_data(name)}' v-if="head">
		<label :for="'id_'+name"  class="control-label" v-if='head.label && head.label!=""'>
			<span v-text="head.label"></span><span class="req_star" v-if='head.required'>*</span>
		</label>

		<div class="field_input">
			<component :is='head.type'
				:row='row'
				:name='name'
				:kw='head'>
			</component>
		</div>
		<div class="help_text"><span v-text="head.help_text"></span></div>
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

export function merge(mains,subs) {
	mains.each(function (first) {
		subs.each(function (second) {
			if(first.name==second.name){
				for(var x in second){
					first[x]=second[x]
				}
			}
		})
	})
}



Vue.component('com-form-btn',{
	data:function(){
		return {
			can_add:can_add,
			can_del:can_del,
		}
	},
	props:['submit','del_row','cancel'],
	computed:{
		del_link:function(){
			return this.del_row()
		}
	},
	template:`<div style='overflow: hidden;'>
		<div class="btn-group" style='float: right;'>
			<button type="button" class="btn btn-default" @click='submit()' v-if='can_add'>保存</button>
			<a type="button" class="btn btn-default" v-if='can_del &&del_link' :href='del_link'>删除</a>
			<button type="button" class="btn btn-default" @click='cancel()' >取消</button>
		</div>
	</div>`
})

var fieldset_fun={
	data:function(){
		return {
			fieldset:fieldset,
			namelist:namelist,
			menu:menu,
			search_args:ex.parseSearch(),
			can_add:can_add,
			can_del:can_del,
			can_log:can_log,
		}
	},

	methods:{
		submit:function () {
			var self =this;
			show_upload()
			var search =ex.parseSearch()
			var fieldset_row={}
			for(var k in this.fieldset){
				fieldset_row[k]=this.fieldset[k].row
			}

			var post_data=[{fun:'save_fieldset',fieldset:fieldset_row,save_step:save_step}]
			ex.post('',JSON.stringify(post_data),function (resp) {
				if( resp.save_fieldset.errors ){
					var error_path =resp.save_fieldset.path
					ex.set(self.fieldset,error_path,resp.save_fieldset.errors)
					hide_upload(200)
				}else if(search._pop==1){
					window.ln.rtWin({row:resp.save_fieldset.fieldset})
				}else if(search.next){

					location=decodeURIComponent(search.next)
				}else{
					hide_upload(200)

				}
			})
		},
		cancel:function () {
			var search =ex.parseSearch() //parseSearch(location.search)
			if(search._pop){
				window.close()
			}else{
				history.back()
			}
		},
		del_row:function (path) {
			var self=this
			var search_args=ex.parseSearch()
			var rows=[]
			ex.each(delset,function(name){
				var row = self.fieldset[name].row
				if (row.pk){
					rows.push(row._class+':'+row.pk)
				}
			})
			if(rows.length>1){
				return ex.template('{engine_url}/del_rows?rows={rows}&next={next}&_pop={pop}',
					{engine_url:engine_url,
						rows:rows,
						next:search_args.next,
						pop:search_args._pop,
					})
			}else{
				return null
			}

		},
		log_url:function(){
			var rows=[]
			for(var k in this.fieldset){
				var kw=this.fieldset[k]
				rows.push(kw.row._class+':'+kw.row.pk)
			}
			var obj={
				rows:rows.join(','),
				engine_url:engine_url,
				//page_name:page_name,
			}
			return ex.template('{engine_url}/log?rows={rows}',obj)
		},
	}
}
window.fieldset_fun=fieldset_fun

window.field_fun=field_fun
window.hook_ajax_msg=hook_ajax_msg
window.update_vue_obj=update_vue_obj
window.use_ckeditor= ck.use_ckeditor
window.show_upload =show_upload
window.hide_upload =hide_upload
window.merge=merge;
window.BackOps=BackOps
window.back_ops=back_ops
window.order_by_key=order_by_key

