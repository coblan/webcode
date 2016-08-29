
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

import {use_color} from '../dosome/color.js'
import {hook_ajax_msg,hook_ajax_csrf,show_upload,hide_upload} from '../ajax_fun.js'
import * as f from './file.js'
import * as ck from './ckeditor.js'

hook_ajax_msg()
hook_ajax_csrf()

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
        set:{
            default:function(){
                return {}
            }
        }
    },
    computed:{
        row:function(){return this.kw.row},
        errors:function() {return this.kw.errors},
        head:function(){
            var heads = this.kw.heads
            for (var head  of heads) {
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
        text: {
            props: ['name','model','kw'],


            template: `<input type="text" class="form-control" v-model="model" :id="'id_'+name"
                        :placeholder="kw.placeholder" :autofocus="kw.autofocus" :maxlength='kw.maxlength'>`
        },
        password: {
            props: ['name','model','kw'],
            template: `<input type="password" :id="'id_'+name" class="form-control" v-model="model" :placeholder="kw.placeholder">`
        },
        area: {
            props: ['name','model','kw'],
            template: `<textarea class="form-control" rows="3" :id="'id_'+name" v-model="model" :placeholder="kw.placeholder"></textarea>`
        },
        color:{
            props:['name','model','kw'],
            template: `<input type="text" v-model="model" :id="'id_'+name">`,
            watch:{
                'model':function (){
                    this.sync_to_spec()
                }
            },
            methods:{
                sync_to_spec:function(){
                    var self = this
                    Vue.nextTick(function(){
                        $(self.$el).spectrum({
                            color: this.model,
                            showInitial: true,
                            showInput: true,
                            preferredFormat: "name",
                        });
                    })
                }
            },
            compiled:function(){
                this.sync_to_spec()
            },
        },
        logo:{
            props:['name','model','kw'],
            template:`<logo-input :up_url="kw.up_url" :web_url.sync="model" :id="'id_'+name"></logo-input>`
        }
    }

}

Vue.component('field',{
    mixins:[field_base],

	template:`
	<div for='field' class="form-group field" :class='{"error":error_data(name)}'>
	<label :for="'id_'+name" v-text="head.label" :class='set.label_cls'  control-label"><span class="req_star" v-if='head.required'> *</span>
	</label>
	<div :class="set.input_cls">
        <component :is='head.type'
            :model.sync='row[name]'
            :name='name'
            :kw='head'>
        </component>
	</div>
	<slot> </slot>
	<div v-text='error_data(name)' class='error'></div>
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

export function merge(mains,subs) {
	for(let sub of sub){
		for (let main of mains){
			if(main.name==sub.name){
				for(let k in sub){
					main[k]=sub[k]
				}
				break
			}
		}
	}
}
window.update_vue_obj=update_vue_obj
window.use_color = use_color
window.use_ckeditor= ck.use_ckeditor
window.show_upload =show_upload
window.hide_upload =hide_upload
window.merge=merge;

