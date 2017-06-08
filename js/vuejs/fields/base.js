export var field_base={
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
            template: `<div>
            <span v-if='kw.readonly' v-text='row[name]'></span>
            <textarea v-else class="form-control" rows="3" :id="'id_'+name" v-model="row[name]" :placeholder="kw.placeholder" :readonly='kw.readonly'></textarea>
            </div>`
        },
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
                ex.load_css('/static/lib/spectrum1.8.0.min.css')
                ex.load_js('/static/lib/spectrum1.8.0.min.js',function () {
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
            // 添加，修改，删除的按钮代码，暂时不用。<option :value='null'>----</option>
            //`<div><select v-model='model'  :id="'id_'+name" :readonly='kw.readonly'>
            //	<option :value='null'>----</option>
            //	<option v-for='opt in kw.options' :value='opt.value' v-text='opt.label'></option>
            //</select>
            //<span v-if='kw.add_url' @click='add()'><img src='http://res.enjoyst.com/image/add.png' /></span>
            //<span v-if='kw.change_url' @click='edit()'><img src='http://res.enjoyst.com/image/edit.png' /></span>
            //<span v-if='kw.del_url' @click='del_row()'><img src='http://res.enjoyst.com/image/delete.png' /></a>
            //</div>`,
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
        check_select:{
            props:['name','row','kw'],
            computed:{
              selected:{
                  get:function(){
                      var data=this.row[this.name]
                      if(data){
                          return data.split(',')
                      }else{
                          return []
                      }

                  },
                  set:function(v){
                      this.row[this.name]=v.join(',')
                  }

              }
            },
            template:`<div>
                <ul>
                <li v-for='option in kw.options' v-if="option.value"><input type="checkbox" :value="option.value" v-model="selected"/><span v-text="option.label"></span></li>
                </ul>
            </div>`,
        },
        tow_col:{
            props:['name','row','kw'],
            template:`<div>
	        	<ul v-if='kw.readonly'><li v-for='value in row[name]' v-text='get_label(value)'></li></ul>
	        	<tow-col-sel v-else v-model='row[name]' :id="'id_'+name" :choices='kw.options' :size='kw.size' ></tow-col-sel>
	        	</div>`,
            methods:{
                get_label:function (value) {
                    for(var i =0;i<this.kw.options.length;i++){
                        if(this.kw.options[i].value==value){
                            return this.kw.options[i].label
                        }
                    }
                }
            }
        },
        bool:{
            props:['name','row','kw'],
            template:`<div class="checkbox">
	        <input type="checkbox" :id="'id_'+name" v-model='row[name]' :disabled="kw.readonly">
			 <label :for="'id_'+name"><span v-text='kw.label'></span></label>
					  </div>`
        },
        date: {
            props:['name','row','kw'],
            template:`<div><span v-if='kw.readonly' v-text='row[name]'></span>
            			<date v-else v-model="row[name]" :id="'id_'+name"
                        	:placeholder="kw.placeholder"></date>
                       </div>`,
        },
        datetime:{
            props:['name','row','kw'],
            template:`<div><span v-if='kw.readonly' v-text='row[name]'></span>
            			<datetime  v-model="row[name]" :id="'id_'+name"
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