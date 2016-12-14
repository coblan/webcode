==========
拖动
==========

列表内拖动
==========
源代码位于::

	/js/uis/cus_drag.js

原理:
------
1. 用在列表式的 **组件** 中
2. 定义一个virtual数据，该数据兼容list中的item，当鼠标在list中拖动时，将virtual数据放入鼠标下方，形成标示定位的作用。
3. 

使用样例::

	data:function(){
		return {
			blocks:[],
			virtual:{label:'',color:'yellow'},
		}
	}
	mixins:[drag_mix],
	computed:{
		face:function () {
			return $('#tail')
		}
	},

	<ul id='dog' @mouseleave='ulleave()'>
		<li v-for='(block,index) in blocks'
			@mouseenter="onmouseenter(index,$event)" 
			@mousedown="onmousedown($event,block)"
			:style='li_style'>
			<div :style='{height:"100px",backgroundColor:block.color}'>
				<span v-text='block.label'></span>
				<a href="www.qq.com" >ss</a>
			</div>
		</li>
		<li id='tail' :style='li_style' >
			<div :style='[{height:"100px",backgroundColor:moveing_block.color},{border: "1px solid #999"}]'>
				<span v-text='moveing_block.label'></span>
			</div>
		</li>
	</ul>

	#tail{
		    position: absolute;
		    float: left;
		    pointer-events:none;
		    transform:rotate(1deg);
		    display: none;
	}

