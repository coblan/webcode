/*

>->comp/catalog.rst>

=============
catalog
=============
用于显示和编辑树状结构。该模块有对应的后端，用于编辑数据库。

前端组件
=========

使用示例::

     <com-catalog ref="catalog" url="/dir_mana" :root="{pk:null,name:'root'}" @dirclick="on_dirclick($event)"
     @itemclick="on_itemclick($event)" @state="set_state($event)" :editable="true"></com-catalog>

url:
    连接后端的地址

root:
    根元素，如果没有，就虚拟一个
editable:
    目前决定了catalog是否显示checkbox

使用时，在外部捕捉dirclick,itemclick,state事件。其中state事件会传出com-catalog的各种状态，这些状态用于告诉parent，可以执行的命令。

。。Note:: com-catalog自带create和delete功能，但是不具备修改save功能，（因为验证错误无处显示），所以client需要自己定义保存函数。

<-<
* */

require('./css/catalog.scss')

var com_catalog={
    props:['url','root','editable'],
    data:function(){
        return {
            dirs:[],
            items:[],
            org_parents:[],
            crt_dir:this.root,
            selected:[],
            cut_list:[],
        }
    },
    mounted:function(){
        this.dir_data(this.root)
    },
    computed:{
        parents:function(){
            if(!this.root.pk){
                return this.org_parents
            }else{
                var root_obj = ex.findone(this.org_parents,{pk:root.pk})
                var idx= this.org_parents.indexOf(root_obj)
                return this.org_parents.slice(idx)
            }
        },
        state:function(){
            return {
                can_cut:this.can_cut,
                can_paste:this.can_paste,
                has_select:this.selected.length>0,
            }
        },
        can_cut:function(){
            if(this.selected.length>0 ){
                return true
            }
        },
        can_paste:function(){
            return this.cut_list.length>0
        },
    },
    watch:{
        state:function(v){
            this.$emit('state',v)
        }
    },
    methods:{
        dir_data:function(par){
            this.crt_dir= par || this.crt_dir

            var self=this
            this.selected=[]
            var url=this.url+ex.template('?_op=dir_data:par:{par}',{par:this.crt_dir.pk})
            ex.get(url,function(resp){
                self.dirs=resp.dir_data.dirs
                self.items=resp.dir_data.items
                self.org_parents=resp.dir_data.parents
            })
        },
        dir_create:function(){
            var self=this
            show_upload()
            var url=this.url+ex.template('?_op=dir_create:par:{par}',{par:this.crt_dir.pk})
            ex.get(url,function(resp){
                self.dirs.push(resp.dir_create)
                hide_upload(200)
            })
        },
        item_create:function(){
            var self=this
            var url=this.url+ex.template('?_op=item_create:par:{par}',{par:this.crt_dir.pk})
            ex.get(url,function(resp){
                self.items.push(resp.item_create)
            })
        },
        cut:function(){
            this.cut_list=this.selected.slice()
        },
        paste:function(){
            var self=this
            var post_data=[{fun:'items_paste',rows:this.cut_list,par:this.crt_dir.pk}]
            self.cut_list=[]
            ex.post(this.url,JSON.stringify(post_data),function(resp){
                self.dir_data(self.crt_dir)
            })
        },
        item_del:function(){
            var self=this
            show_upload()
            var obj={}
            ex.each(this.selected,function(item){
                if(!obj[item._class]){
                    obj[item._class]=item.pk
                }else{
                    obj[item._class]+=':'+item.pk
                }
            })
            var del_str=''
            for(var k in obj){
                del_str +=k+':'+obj[k]+','
            }
            location=engine_url+'/del_rows?rows='+del_str+'&next='+encodeURIComponent(location.href)
        },

        set_sel:function(v){
            this.selected=v
        },
    },
    template:`<div class="com-catalog">
    <div class="flex">
        <ol class="breadcrumb flex-grow">
            <li ><a href="javacript:;" @click="dir_data(root)">root</a></li>
            <li v-for="dir in parents" ><a href="javacript:;" v-text="dir.name" @click="dir_data(dir);$emit('dirclick',dir)" ></a></li>
        </ol>
        <slot name="head_end"></slot>
    </div>

    <div class="bd">
        <ul>
        <li v-for="dir in dirs" class="dir">
            <slot name="check_sel" :value="dir" :selected="selected" :set_sel="set_sel">
                <input v-if="editable" type="checkbox" :value="dir" v-model="selected"/>
            </slot>

            <slot dir_icon>
                <i class="fa fa-folder" aria-hidden="true"></i>
            </slot>

            <span v-text="dir.name" class="clickable name" @click="dir_data(dir);$emit('dirclick',dir)"></span>
            <slot name="btn-panel" :selected="selected" :item="dir"></slot>
        </li>
        <li v-for="item in items" :key="item.pk" class="item">
            <slot name="check_sel" :value="item" :selected="selected" :set_sel="set_sel">
                <input v-if="editable" type="checkbox" :value="item" v-model="selected"/>
            </slot>
            <slot name="item_icon">
                <i class="fa fa-file-o" aria-hidden="true"></i>
            </slot>
            <span v-text="item.name" class="clickable name" @click="$emit('itemclick',item)"></span>
            <slot name="btn-panel" :selected="selected" :item="item"></slot>
         </li>
        </ul>
    </div>
    </div>`

}

Vue.component('com-catalog',com_catalog)


