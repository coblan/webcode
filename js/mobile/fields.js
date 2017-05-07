
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
import {hook_ajax_msg,hook_ajax_csrf,show_upload,hide_upload} from '../ajax_fun.js'
import * as f from '../vuejs/file.js'
//import * as ck from './ckeditor.js'
//import * as multi from './multi_sel.js'
import * as inputs from '../vuejs/inputs.js'
import * as ln from '../vuejs/link.js'
//import * as js from './adapt.js'


require('./css/fields.scss')
require('./css/input.scss')

hook_ajax_msg()
hook_ajax_csrf()



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
    //<input v-else type="number"  v-model="row[name]" :id="'id_'+name" :placeholder="kw.placeholder" :autofocus="kw.autofocus">
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
            data:function(){
                return {
                    org_height:0,
                }
            },
            mounted:function(){
                var self=this
                Vue.nextTick(function(){
                    self.on_input()
                })

            },
            methods:{
                on_input:function(){
                    var textarea = $(this.$el).find('textarea')[0]
                    if(this.org_height!=textarea.scrollHeight){
                        $(textarea).height(textarea.scrollHeight-12)
                        this.org_height=textarea.scrollHeight
                    }
                }
            },
            computed:{
                value:function(){
                    return this.row[this.name]
                }
            },
            watch:{
                value:function(v){
                    var self=this
                    Vue.nextTick(function(){
                        self.on_input()
                    })
                }
            },
            template:  `<div>
            <span v-if='kw.readonly' v-text='row[name]'></span>
            <textarea v-else class="form-control" rows="2" :id="'id_'+name" v-model="row[name]" :placeholder="kw.placeholder"
                :readonly='kw.readonly'></textarea>
            </div>`
        },//
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
        logo:{// absolate
            props:['name','row','kw'],
            template:`<logo-input :up_url="kw.up_url" :web_url.sync="row[name]" :id="'id_'+name"></logo-input>`
        },
        picture:{
            props:['name','row','kw'],
            template:`<div><img class="img-uploador" v-if='kw.readonly' :src='row[name]'/>
			<img-uploador v-else :up_url="kw.up_url" v-model="row[name]" :id="'id_'+name" :config="kw.config"></img-uploador></div>`
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
            mounted:function(){
                if(this.kw.default && !this.row[this.name]){
                    Vue.set(this.row,this.name,this.kw.default)
                    //this.row[this.name]=this.kw.default
                }
            },
            methods:{
                get_label:function(options,value){
                    var option = ex.findone(options,{value:value})
                    if(!option){
                        return '---'
                    }else{
                        return option.label
                    }
                },
            }
        },
        tow_col:{
            props:['name','row','kw'],
            data:function(){
                return {
                    view:'main'
                }
            },
            template:`<div class="two-col">
                <i v-if='!kw.readonly' @click="view='sel'" class="fa fa-pencil-square-o" aria-hidden="true"></i>
	        	<ul><li v-for='value in row[name]' v-text='get_label(value)'></li></ul>
	        	<!--<tow-col-sel v-model='row[name]' :id="'id_'+name" :choices='kw.options' :size='kw.size' ></tow-col-sel>-->

	        	<modal v-show="view=='sel'" @click.native='view="main"'>
                    <div @click.stop="" class="pop-wrap">
                        <div class="sel-item" v-for="choice in kw.options" v-text=choice.label :class='{"selected":is_selected(choice.value)}'
                            @click="toggle(choice.value)"></div>
                    </div>
	        	</modal>
	        	</div>`,
            methods:{
                get_label:function (value) {
                    for(var i =0;i<this.kw.options.length;i++){
                        if(this.kw.options[i].value==value){
                            return this.kw.options[i].label
                        }
                    }
                },
                is_selected:function(v){
                    return  ex.isin(v,this.row[this.name])
                },
                toggle:function(v){
                    if(ex.isin(v,this.row[this.name])){
                        ex.remove(this.row[this.name],function(item){
                            return item==v
                        })
                    }else{
                        this.row[this.name].push(v)
                    }
                }
            }
        },
    //<input type="checkbox" :id="'id_'+name" v-model='row[name]' :disabled="kw.readonly">
    //<label :for="'id_'+name"><span v-text='kw.label'></span></label>
        bool:{
            props:['name','row','kw'],
            template:`<div class="mb-btn">
              <input type="checkbox" name="checkbox1" :id="'id_'+name" :disabled="kw.readonly" v-model='row[name]'/>
              <span @click='row[name]= !row[name]' style="font-size: 1.5em;">
                  <i class="fa fa-check-circle" aria-hidden="true" v-if='row[name]'></i>
                  <i class="fa fa-circle-thin" aria-hidden="true" v-else></i>
              </span>
              <span :for="'id_'+name" @click='row[name]= !row[name]'><span v-text='kw.label'></span></span>
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

//  <el-form-item :label="head.label" > </el-form-item>

var field={
    mixins:[field_base],
    created:function(){
        if(!this.head.placeholder){
            this.head.placeholder='请输入'+this.head.label
        }
    },
    methods:{

    },
    template:`
		<div for='field' class="form-group field" :class='{"error":error_data(name)}' v-if="head">
		<label :for="'id_'+name"  class="control-label" v-if='!head.no_auto_label'>
			<span v-text="head.label"></span><span class="req_star" v-if='head.required'>*</span>
		</label>

		<div class="field_input">
			<component :is='head.type'
				:row='row'
				:name='name'
				:kw='head'>
			</component>
			<div class="help_text"><span v-text="head.help_text"></span></div>
		    <slot></slot>
		    <div v-for='error in error_data(name)' v-text='error' class='error'></div>
		</div>

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

var field_fun={
    data:function(){
        return {
            kw:{
                heads:heads,
                row:row,
                errors:{},
            },
            menu:menu,
            namelist:namelist,
            can_add:can_add,
            can_del:can_del,
            can_log:can_log,
            can_edit:can_edit,
        }
    },
    created:function(){
        ex.each(this.kw.heads,function(head){
            if(!head.placeholder){
                head.placeholder='请输入'+head.label
            }
        })
    },
    methods:{
        after_sub:function(){
            location=document.referrer
        },
        submit:function () {
            var self =this;
            show_upload()
            var search =ex.parseSearch()
            var post_data=[{fun:'save',row:this.kw.row}]
            ex.post('',JSON.stringify(post_data),function (resp) {
                hide_upload(500)
                if( resp.save.errors){
                    self.kw.errors = resp.save.errors
                }else if(search._pop==1){
                    window.ln.try_rt({row:resp.save.row})
                }else if(search.next){
                    location=decodeURIComponent(search.next)
                }else{
                    self.after_sub()
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
            var search_args=ex.parseSearch()
            location=ex.template('{engine_url}/del_rows?rows={class}:{pk}&next={next}&_pop={pop}',{class:this.kw.row._class,
                engine_url:engine_url,
                pk:this.kw.row.pk,
                next:search_args.next,
                pop:search_args._pop,

            })
        },
        log_url:function(){
            var obj={
                pk:this.kw.row.pk,
                _class:this.kw.row._class,
                engine_url:engine_url,
                page_name:page_name,
            }
            return ex.template('{engine_url}/log?rows={_class}:{pk}',obj)
        },
    }
}
Vue.component('com-form-btn',{
    data:function(){
        return {
            can_add:can_add,
            can_del:can_del,
        }
    },
    props:['submit','del_row','cancel'],
    template:`<div style='overflow: hidden;'>
		<div class="btn-group" style='float: right;'>
			<button type="button" class="btn btn-default" @click='submit()' v-if='can_add'>Save</button>
			<button type="button" class="btn btn-default" v-if='can_del' @click='del_row()'>删除</button>
			<button type="button" class="btn btn-default" @click='cancel()' >Cancel</button>
		</div>
	</div>`
})

var fieldset_fun={
    data:function(){
        return {
            fieldset:fieldset,
            namelist:namelist,
            menu:menu,

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
                    if(document.referrer){
                        location=document.referrer
                    }
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
            var obj={
                pk:this.kw.row.pk,
                _class:this.kw.row._class,
                engine_url:engine_url,
                page_name:page_name,
            }
            return ex.template('{engine_url}/log?rows={_class}:{pk}',obj)
        },
    }
}
window.fieldset_fun=fieldset_fun
window.field_fun=field_fun

window.hook_ajax_msg=hook_ajax_msg
window.update_vue_obj=update_vue_obj
//window.use_ckeditor= ck.use_ckeditor
window.show_upload =show_upload
window.hide_upload =hide_upload
window.merge=merge;

