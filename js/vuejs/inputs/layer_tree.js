var layer_tree={
    props:['root','url','readonly'],
    data:function(){
        return {
            parents:[],
            items:[],
            crt_dir:{},
            selected:[],
            cut_list:[],
        }
    },
    mounted:function(){
        this.dir_data(this.root)
    },
    methods:{
        goto_dir:function(dir){
            this.crt_dir= par || this.crt_dir

            var self=this
            this.selected=[]
            var url=this.url+ex.template('?_op=dir_data:par:{par}',{par:this.crt_dir.pk})
            ex.get(url,function(resp){
                self.dirs=resp.dir_data.dirs
                self.items=resp.dir_data.items
                self.org_parents=resp.dir_data.parents
            })
        }
    },
    template:`<div class="layer-tree">
    <div class="flex">
        <ol class="breadcrumb flex-grow">
            <li ><a href="javacript:;" @click="dir_data(root)" v-text="root.name">root</a></li>
            <li v-for="dir in parents" ><a href="javacript:;" v-text="dir.name" @click="dir_data(dir);$emit('dirclick',dir)" ></a></li>
        </ol>
        <slot name="head_end"></slot>
    </div>

    <div class="bd">
        <ul>
        <li v-for="dir in dirs" class="dir">
            <slot  name="check_sel" :value="dir" :toggle_check="toggle_check" :selected="selected">
                <input v-if="editable" type="checkbox" :value="dir" v-model="selected"/>
            </slot>

            <slot dir_icon>
                <i class="fa fa-folder" aria-hidden="true"></i>
            </slot>

            <span v-text="dir.name" class="clickable name" @click="dir_data(dir);$emit('dirclick',dir)"></span>
            <slot name="btn-panel" :selected="selected" :item="dir"></slot>
        </li>
        <li v-for="item in items" :key="item.pk" class="item">
            <slot name="check_sel" :value="item" :toggle_check="toggle_check" :selected="selected">
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

Vue.component('layer-tree',layer_tree)