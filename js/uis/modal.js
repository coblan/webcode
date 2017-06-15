var transfer={}
function disable_scroll(){
	transfer.wsctop=$(window).scrollTop();  //记住滚动条的位置
	$('body').addClass('modal-show')
	$('body').css('top',-transfer.wsctop)
//        $("body").css({position:'fixed',top:-transfer.wsctop});
}
function enable_scroll(){
//        $("body").css({position:'static'});
	$("body").removeClass('modal-show')
	$(window).scrollTop(transfer.wsctop);//弹框关闭时，启动滚动条，并滚动到原来的位置
}



if(!window.__modal_mark){
	window.__modal_mark=true
	document.write(`
		<style>
		._modal_popup{
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.2);
			z-index:1000;
		}
		._modal_inn{
			/*background: rgba(88, 88, 88, 0.2);*/
			border-radius: 5px;
			background:white;
			position: relative;

	
			/*padding:30px 80px ;*/
		}
		._modal_popup>._modal_middle{
		    position: absolute;
	        top: 50%;
	        left: 50%;
	        transform: translate(-50%, -50%);
	        -ms-transform:translate(-50%, -50%); 	/* IE 9 */
			-moz-transform:translate(-50%, -50%); 	/* Firefox */
			-webkit-transform:translate(-50%, -50%); /* Safari 和 Chrome */
			-o-transform:translate(-50%, -50%); 
	        /*text-align: center;*/
	        /*z-index: 1000;*/
    	}
		</style>`)
}
Vue.component('modal',{
	template:`<div class="_modal_popup " v-show="is_show">
	<div class="flex flex-vh-center" style="width: 100%;height: 100%;">
		<div class="_modal_inn" :style='inn_style'>
			<span v-if="with_close_btn" @click="$emit('close')" style="position: absolute;right:5px;top:-2em; color: #ff9b11;">
				<i class="fa fa-times fa-2x" aria-hidden="true"></i>
			</span>
		<div style="overflow:auto;">
        	<slot></slot>
         </div>

		</div>
	</div>
	</div>`
			,
	methods:function(){
		//var self=this
		//setTimeout(function(){
		//	self.$refs.	editor_scroller.refresh()
		//},500)

	},
	props:['inn_style','with_close_btn','show'],
	computed:{
		is_show:function(){
			if(this.show){
				disable_scroll()
			}else{
				enable_scroll()
			}
			return this.show
		}
	}
	//methods:{
	//	hide_me:function () {
	//		this.$dispatch('sd_hide')
	//	}
	//}@click='hide_me()'
})