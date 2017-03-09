/**
 * Created by heyulin on 2017/1/24.
 *
 >>>front/input.rst>
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
 <<<<
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
                <span class="cross" @click="$emit('input','')">X</span>
                <input type="text" readonly class="form-control"/>
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

        ex.load_css('//cdn.bootcss.com/smalot-bootstrap-datetimepicker/2.4.3/css/bootstrap-datetimepicker.min.css')
        ex.load_js('//cdn.bootcss.com/moment.js/2.17.1/moment.min.js')
        ex.load_js('//cdn.bootcss.com/smalot-bootstrap-datetimepicker/2.4.3/js/bootstrap-datetimepicker.min.js',function(){

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

document.write(`
<style type="text/css" media="screen">
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
`)