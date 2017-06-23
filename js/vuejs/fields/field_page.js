export var field_fun={
    data:function(){
        return {
            kw:{
                heads:heads,
                row:row,
                errors:{},
            },
            menu:menu,
            search_args:search_args,

            can_add:can_add,
            can_del:can_del,
            can_log:can_log,
            can_edit:can_edit,

            page_label:page_label,
        }
    },
    methods:{
        after_sub:function(){
            location=document.referrer
        },
        before_sub:function(){

        },
        submit:function () {
            this.before_sub()
            var self =this;
            if(window.bus){
                window.bus.$emit('sync_data')
            }
            show_upload()
            var search =ex.parseSearch()
            var post_data=[{fun:'save',row:this.kw.row}]
            var url = ex.appendSearch('/_ajax',search_args)
            ex.post(url,JSON.stringify(post_data),function (resp) {
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
        get_del_link:function(){
            var search_args=ex.parseSearch()
            if(this.kw.row.pk){
                return ex.template('{engine_url}/del_rows?rows={class}:{pk}&next={next}&_pop={pop}',{class:this.kw.row._class,
                    engine_url:engine_url,
                    pk:this.kw.row.pk,
                    next:search_args.next,
                    pop:search_args._pop,

                })
            }else{
                return null
            }
        },
        del_row:function () {
           return this.get_del_link()
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