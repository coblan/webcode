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
    }
}