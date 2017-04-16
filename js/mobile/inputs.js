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

var date_config_set={
    date:{
        language: "zh-CN",
        format: "yyyy-mm-dd",
        autoclose: true,
        todayHighlight: true,
    },
    month:{
        language: "zh-CN",
        format: "yyyy-mm",
        startView: "months",
        minViewMode: "months",
        autoclose: true,

    },
}

Vue.component('date',{
    //template:'<input type="text" class="form-control">',
    template:`<span class="datetime-picker">
                <input type="text"  class="weui-input"/>
                </span>`,
    props:['value','set','config'],
    mounted:function () {
        var self=this
        if(!this.set){
            var def_conf=date_config_set.date
        }else{
            var def_conf=date_config_set[this.set]
        }
        if(this.config){
            ex.assign(def_conf,this.config)
        }
        self.input=$(this.$el).find('input')

        ex.load_css('//cdn.bootcss.com/bootstrap-datepicker/1.6.4/css/bootstrap-datepicker.min.css')

        ex.load_js('//cdn.bootcss.com/bootstrap-datepicker/1.6.4/js/bootstrap-datepicker.min.js',function(){
            ex.load_js('//cdn.bootcss.com/bootstrap-datepicker/1.6.4/locales/bootstrap-datepicker.zh-CN.min.js',function(){
                self.input.datepicker(def_conf).on('changeDate', function(e) {
                    self.$emit('input',self.input.val())
                })
                // if has init value,then init it
                if(self.value){
                    self.input.datepicker('update',self.value)
                    self.input.val(self.value)
                }
            })
        })
    },
    methods:{
        click_input:function(){
            this.input.focus()
        }
    },
    watch:{
        value:function (n) {
            this.input.datepicker('update',n)
            this.input.val(n)

        }
    }
})


Vue.component('datetime',{
    //data:function(){
    //    return {
    //        input_value:'',
    //    }
    //},
    //template:'<input type="text" class="form-control">',
    template:`<span class="datetime-picker">
                <span class="cross" @click="$emit('input','')">X</span>
                <input type="text" readonly/>
                </span>`,
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
        self.input=$(this.$el).find('input')

        ex.load_css('https://cdn.bootcss.com/smalot-bootstrap-datetimepicker/2.4.3/css/bootstrap-datetimepicker.min.css')
        ex.load_js('https://cdn.bootcss.com/moment.js/2.17.1/moment.min.js')
        ex.load_js('https://cdn.bootcss.com/smalot-bootstrap-datetimepicker/2.4.3/js/bootstrap-datetimepicker.min.js',function(){

            self.input.datetimepicker(def_conf).on('changeDate', function(e) {
                self.$emit('input',self.input.val())
            })

            // if has init value,then init it
            if(self.value){
                self.input.datepicker('update',self.value)
                self.input.val(self.value)
            }

        })
    },

    watch:{
        value:function (n) {
            this.input.val(n)
            this.input.val(n)
        },
        //input_value:function(n){
        //    this.$emit('input',n)
        //}
    }
})

var color={
    props:['value'],
    template: `<input type="text">`,
    methods:{
        init_and_listen:function(){
            var self = this
            Vue.nextTick(function(){
                $(self.$el).spectrum({
                    color: self.value,
                    showInitial: true,
                    showInput: true,
                    preferredFormat: "name",
                    change: function(color) {
                        self.src_color=color.toHexString()
                        self.$emit('input',self.src_color)
                    }
                });
            })
        }
    },
    watch:{
        value:function (value) {
            if(this.src_color !=value){
                this.init_and_listen()
            }
        }
    },
    mounted:function(){
        var self=this;
        ex.load_css('https://cdn.bootcss.com/spectrum/1.8.0/spectrum.min.css')
        ex.load_js('https://cdn.bootcss.com/spectrum/1.8.0/spectrum.min.js',function () {
            self.init_and_listen()
        })
    },
}

Vue.component('color',color)

ex.append_css(
    `<style type="text/css" media="screen">
    .datetime-picker{
        position: relative;
        display: inline-block;
    }
    .datetime-picker input[readonly]{
        background-color: white;
    }
	.datetime-picker .cross{
	    display: none;
	}
	.datetime-picker:hover .cross{
	    display: inline-block;
	    position: absolute;
	    right: 8px;
	    top:3px;
	    cursor: pointer;
	    /*z-index: 10;*/
	}
</style>
 `
)

var forignEdit={
    template:`<div class="forign-key-panel">
        <button v-if="has_pk()" @click="jump_edit(kw.row[name])" title="{% trans 'edit' %}">
            <i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>
        <button @click="jump_edit()" title="{% trans 'new' %}"><i class="fa fa-plus" aria-hidden="true"></i></button>
    </div>`,
    props:['kw','name','page_name'],
    methods:{
        jump_edit:function(pk){
            var name = this.name
            var kw=this.kw
            var page_name=this.page_name || this.name
            var options=ex.findone(kw.heads,{name:name}).options
            var row=kw.row
            var pk= pk || ''

            var url=ex.template('{engine_url}/{page_name}.edit?pk={pk}',{
                engine_url:engine_url,
                page_name:page_name,
                pk:pk
            })
            ln.openWin(url,function(resp){
                if(resp.del_rows){
                    ex.remove(options,function(option){
                        return ex.isin(option,resp.del_rows,function(op,del_row){
                            return op.value==del_row.pk
                        })
                    })
                }else if(resp.row){
                    if(pk){
                        var option =ex.findone(options,{value:pk})
                        option.label=resp.row._label
                    }else{
                        options.push({label:resp.row._label,value:resp.row.pk})
                        row[name]=resp.row.pk
                    }
                }
            })
        },
        has_pk:function(){
            if(this.kw.row[this.name]){
                return true
            }else{
                return false
            }
        }
    }
}

ex.append_css(`
<style type="text/css">
    .forign-key-panel{
        padding: 6px;
    }
</style>`)

Vue.component('forign-edit',forignEdit)

