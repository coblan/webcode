
require('./css/tab_box.scss')

var tab_lite={
    // event: close(value)
    template:`<div class="tab-lite">
        <span v-text="label"></span>
        <span v-if="!readonly" @click="$emit('close',value)" class="cross">X</span>
    </div>`,
    props:['value','label','readonly'],
}
Vue.component('com-tab-lite',tab_lite)


var tab_box={
    template:`  <div class="tab-box">
        <com-tab-lite :class="{'selected':seleced_item==item}" v-for="item in value" :value="item.value" :label="item.label" :readonly="readonly" @close="on_tab_close_click($event)" @click.native="on_tab_click(item)"></com-tab-lite>
    </div>`,
    props:['value','readonly'],
    data:function(){
        return {
            seleced_item:{},
        }
    },
    methods:{
        on_tab_close_click:function(tab_value){
            ex.remove(this.value,{value:tab_value})
            this.$emit('input',this.value)
        },
        on_tab_click:function(item){
            this.seleced_item=item
            this.$emit('selected',item.value)
        }
    }
}
Vue.component('com-tab-box',tab_box)