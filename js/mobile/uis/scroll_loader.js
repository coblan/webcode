

Vue.component('scroll-loader',{
    template:'#scroll-loader',
    props:['can_load'],
    template:`<div class="scroll-wraper">
    <div class="scroll-content">
        <slot></slot>
        <div class="load-icon" v-if="loading" style="height: 3em;text-align: center;">
            <span v-if="can_load">加载...</span>
            <span v-else>没有更多数据了</span>
        </div>
    </div>
</div>`,
    data:function(){
        return {
            loading:false,
        }
    },
    watch:{
        loading:function(v){
            if(v && this.can_load){
                this.$emit('load_more')
            }
        }
    },
    mounted:function(){
        var self=this
        var wraper= $(this.$el)
        var content=wraper.find('.scroll-content')
        wraper.scroll(function(){
            if(wraper.scrollTop()+wraper.height() +20 >content.outerHeight()){
                self.loading=true
            }
            if(wraper.scrollTop()+wraper.height() <content.outerHeight()){
                self.loading=false
            }

        })
    }
})