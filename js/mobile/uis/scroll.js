/*
 * event:
 * up_out_border
 * down_out_border
 * */
var  scrop_wraper={
    template:`<div style="position: relative;">
    <div class="scroll-wrapper">
        <div class="scroller">
            <div v-if="up_out_border" v-text="up_text" class="_up_text"></div>
            <slot class="content"></slot>
            <div v-if="down_out_border" v-text="down_text" class="_down_text"></div>
        </div>
    </div>
    </div>`,
    props:['up_text','down_text'],
    data:function(){
        return {
            up_out_border:false,
            down_out_border:false,
        }
    },
    mounted:function(){
        var self=this
        ex.load_js('/static/lib/iscroll_probe5.2.0.js',function(){

            on_load_scroll()

            self.scroll = new IScroll($(self.$el).find('.scroll-wrapper')[0],{
                probeType:1,
                click:true,
                tap:true,
            });
            self.scroll.on('scrollStart',function(){

            })
            self.scroll.on('scrollEnd',function(){
                if(self.up_out_border){
                    self.$emit('up_out_border')
                }else if(self.down_out_border){
                    self.$emit('down_out_border')
                }
                self.up_out_border=false
                self.down_out_border=false

            })
            self.scroll.on('scroll',function(){
                self.up_out_border=false
                self.down_out_border=false

                if(this.maxScrollY-10>this.y){  // 上拉触发更新，更加平常些，所以这里值设置小点。
                    self.down_out_border=true
                }else if(this.y>30){
                    self.up_out_border=true
                }
            })
            if(self._need_refresh){
                self.scroll.refresh()
            }
        })

    },
    methods:{
        refresh:function(){
            if(this.scroll){
                this.scroll.refresh()
            }else{
                this._need_refresh=true
            }

        }
    }
}
Vue.component('scroll-wraper',scrop_wraper)

function isPassive() {
    var supportsPassiveOption = false;
    try {
        addEventListener("test", null, Object.defineProperty({}, 'passive', {
            get: function () {
                supportsPassiveOption = true;
            }
        }));
    } catch(e) {}
    return supportsPassiveOption;
}

function on_load_scroll(){
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, isPassive() ? {
        capture: false,
        passive: false
    } : false);
}
