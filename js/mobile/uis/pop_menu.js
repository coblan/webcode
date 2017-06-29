
/*
* 暂时没用，没想好怎么弄
* */



var pop_menu ={
    template:`<modal id="pop-menu" v-show="show_menu" @click.native="show_menu=false">

                <div class="weui-actionsheet__menu up-menu" @click.stop="" style="width: 80vw;">
                    <!--<div class="weui-actionsheet__cell" @click="add_new();show_menu=false" v-if="can_add">新建</div>-->
                    <div class="weui-actionsheet__cell" @click="ln.pushState({crt_view:'show_active-depart'});show_menu=false">下属部门</div>
                    <div class="weui-actionsheet__cell" @click="del_item();is_show_menu=false" v-if="can_del &&selected.length>0">删除选中</div>
                    <div class="weui-actionsheet__cell" @click="ln.pushState({crt_view:'show_filter'});show_menu=false" v-if="can_search">排序过滤</div>
                </div>
                <div class="weui-actionsheet__cell">
                    <div class="weui-actionsheet__cell" @click="show_menu=false">取消</div>
                </div>

            </modal>`,
        props:['menu'],
}