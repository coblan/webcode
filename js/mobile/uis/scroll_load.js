
/*
与vuejs组件的mixin : table_fun联合使用,自动加载后台的table数据

mixin:[table_fun,scroll_loader]

 <scroll-wraper ref="scroller" :down_text='get_down_text()' @down_out_border="load_next_page()"></scroll-wraper>

* */


var scroll_loader={
    computed:{
        can_load_more:function(){
            var opt=this.row_pages.options
            var max_page=parseInt( opt[opt.length-1])
            return this.crt_page< max_page
        }
    },
    methods:{
        get_down_text:function(){
            if(this.can_load_more){
                return '释放加载'
            }else{
                return '没有更多数据了'
            }
        },
        load_next_page:function(){
            if(!this.can_load_more) return
            this.crt_page+=1
            var self=this
            show_upload()
            ex.get(ex.appendSearch({'_page':this.crt_page}),function(resp){
                self.rows = self.rows.concat(resp.rows)

                Vue.nextTick(function(){
                    self.$refs.scroller.refresh()
                })
                hide_upload(200)
            })
        }
    }
}

window.scroll_loader=scroll_loader