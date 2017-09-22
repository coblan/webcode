var first_col={
    props:['row','name'],
    methods:{
        ret:function(row){
            ln.ret(row)
        },
        form_link:function(name,row){
            return ex.template('{edit}?pk={pk}',
                {	edit:page_name+'.edit',
                    pk:row.pk,
                })
        },
        is_pop:function(){
            return search_args._pop
        }
    },
    template:`<div>
    <span v-if="is_pop()"  v-text="row[name]" @click="ret(row)" style="cursor: pointer;color: #5d9cd3"></span>
    <a v-else :href="form_link(name,row)" v-text="row[name]"></a>
    </div>`
}

Vue.component('first-col',first_col)