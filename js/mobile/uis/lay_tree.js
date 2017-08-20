

var tree_head={
    props:['items'],
    template:`<ul style="margin-top: 0.3em;font-size: 1.3em;">
                <li v-for="par in items" @click="on_click(par)" style="display: inline-block;">
                    <span v-text="par._label"></span>
                    <span style="display: inline-block;padding-left: 0.3em;padding-right: 0.3em;">
                        <i class="fa fa-angle-right" aria-hidden="true"></i>
                    </span>
                </li>
            </ul>`,
    methods:{
        on_click:function(item){
            this.$emit('item_click',item)
        }
    }
}

Vue.component('lay-tree-head',tree_head)