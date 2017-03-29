// 拖动的时候，可能会造成selection效果，定义这个函数来清除选中项
function clear_sel() {
        if (window.getSelection) {
          if (window.getSelection().empty) {  // Chrome
            window.getSelection().empty();
          } else if (window.getSelection().removeAllRanges) {  // Firefox
            window.getSelection().removeAllRanges();
          }
        } else if (document.selection) {  // IE?
          document.selection.empty();
        }
    }
    
function array_remove(array,item) {
		if(array ){
			var idx = array.indexOf(item)
			if(idx!=-1){
				array.splice(idx,1)
			}
		}
	}
	
function array_move(array,item,to_idx) {
	var old_idx=array.indexOf(item)
	if(old_idx!=-1){
		if(old_idx<to_idx){
			to_idx+=1
			array.splice(to_idx,0,item)
			array.splice(old_idx,1)
		}else{
			array.splice(old_idx,1)
			array.splice(to_idx,0,item)
		}
	} else{
		array.splice(to_idx,0,item)
	}
}
function array_replace(array,src,dst) {
	var idx = array.indexOf(src)
	if(idx!=-1){
		array.splice(idx,1)
		array.splice(idx,0,dst)
	}
}
/*
样例代码：

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
*/
drag_mix={
	mounted:function () {
				//$('#tail').hide()
			var self =this
			$(document).on('mousemove', function(e){
				self.x=e.clientX //pageX
				self.y=e.clientY //pageY
				if(e.which!=1){
					if(self.is_drag){
						self.reset()
					}
					return
				}
				self.drag_engin(e.pageX, e.pageY)
				if(self.is_drag){
					e.preventDefault()
				}
			}).on('mouseup',function (e) {
				self.is_down=false
				if(self.is_drag){
					self._drag_end()
					e.preventDefault()
				}
			}).on('mousedown',function(e){
				if(e.which!=1 &&self.is_drag){
					self.reset()
				}
			})
			$(window).scroll(function (e) {
				self.drag_engin(self.x+$(document).scrollLeft(),self.y+$(document).scrollTop())
			})

			
	},
	//data:function function_name(first_argument) {
	//	return {
	//		moveing_block:this.virtual,
	//	}
	//},
	methods:{
		reset:function(){
			this.is_down=false
			this.is_drag=false
			this.moveing_block=this.virtual
			this.face.hide()
			this.blocks=this._org_blocks
			$('body').css('cursor','auto')
			this.$emit('drag_over',this)

		},
		drag_engin:function (x,y) {
			if(!this.is_drag &&this.is_down ){
				var del_x = x-this.last_start_x
				var del_y = y-this.last_start_y
				if(Math.sqrt(del_x*del_x+del_y*del_y) > 10){
					this._drag_start()
				}
			}
			if(this.is_drag){
				this.drag(x,y)
			}
		},
		_drag_start:function () {
			this.is_drag=true
			this._org_blocks=this.blocks.slice()
			this.face.show()
			$('body').css('cursor','move')
			this.drag_start()
		},
		drag:function (x,y) {	
				clear_sel()	
				this.face.offset({left:x -this.det_x,
								top:y - this.det_y,})	
				//this.face.css({
				//       left:  x -this.det_x,
				//       top:   y -this.det_y,
				//    });
			},
		_drag_end:function () {
				this.drag_end()
				this.is_drag=false;
				this.face.hide()
				this.moveing_block= this.virtual//{}
				$('body').css('cursor','auto')
			},
		onmousedown:function (ev,block,target,adapt_x,adapt_y){
			//记录下点击点的位置，为了开始拖动时，不跳动。
				this.is_down=true
				this.last_start_x= ev.pageX
				this.last_start_y= ev.pageY
				target = target || ev.target
				var div_x = $(target).offset().left
				var div_y= $(target).offset().top
				var adapt_x= adapt_x ||0
				var adapt_y = adapt_y ||0
				this.det_x = ev.pageX - div_x +adapt_x
				this.det_y = ev.pageY - div_y + adapt_y
				//console.log($(ev.target))
				//console.log(ev.pageY)
				//console.log(div_y)
				//设置变量，准备拖动
				this.moveing_block = block
				//this.face = $('#tail')
				this.drag_start=function () {
					array_replace(this.blocks,this.moveing_block,this.virtual)
				}
				this.drag_end=function () {
					console.log('drag is over')
					array_replace(this.blocks,this.virtual,this.moveing_block)
					this.$emit('drag_over',this)
				}
			},
		onmouseenter:function (idx,ev){
			if(this.is_drag){
				array_move(this.blocks,this.virtual,idx)
				ev.preventDefault();
			}
		},
		ulleave:function () {
			array_remove(this.blocks,this.virtual)
		},
	}
}