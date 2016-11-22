if(!window.__multi_sel){
	document.write(`
	
<style type="text/css" media="screen" id="test">
._tow-col-sel .sel{
	width:250px;
	display: inline-block;
	vertical-align: middle;
}
._tow-col-sel .sel.right{
	border-width:2px;
}
._tow-col-sel ._small_icon{
	width:15px;
}
._tow-col-sel ._small_icon.deactive{
	opacity: 0.5;
	-moz-opacity: 0.5;
	filter:alpha(opacity=50);
}
</style>

	`)
}

var temp_tow_col_sel=`
<div class='_tow-col-sel'>
		<select name="" id="" multiple="multiple" :size="size" class='sel left' v-model='left_sel' >
			<option v-for='opt in orderBy(can_select,"label")' :value="opt.value" v-text='opt.label' @dblclick='add(opt)' ></option>
		</select>
		<div style='display: inline-block;vertical-align: middle;'>
			<img src="http://oe8wu3kqs.bkt.clouddn.com/image/right_02.png" alt="" 
				:class='["_small_icon",{"deactive":left_sel.length==0}]' @click='batch_add()'>
			<br>
			<img src="http://oe8wu3kqs.bkt.clouddn.com/image/left_02.png" alt="" 
				:class='["_small_icon",{"deactive":right_sel.length==0}]' @click='batch_rm()'>
		</div>
		
		<select name="" id="" multiple="multiple" :size="size" class='sel right' v-model='right_sel' >
			<option v-for='opt in orderBy(selected__,"label")' :value="opt.value" v-text='opt.label' @dblclick='rm(opt)'></option>
		</select>
</div>
`


Vue.component('tow-col-sel',{
	template:temp_tow_col_sel,
	props:{
		choices:{},
		value:{
			default:function () {
				return []
			}
		},
		size:{
			default:6
		},
	},
	data:function () {
		return {
			selected:this.value,
			selected__:[],
			can_select:JSON.parse(JSON.stringify(this.choices)),
			left_sel:[],
			right_sel:[]
		}
	},
	mounted:function () {
		var self=this
		this.selected__ = ex.remove(this.can_select,function (item) {
				return ex.isin(item.value,self.value)
			})
	},
	watch:{
		selected:function (v) {
			this.$emit('input',v)
		}
	},
	
	methods:{
		orderBy:function (array,key) {
			return  array.slice().sort(function (a,b) {
				if(a[key]>b[key]){
					return 1
				}else if(a[key]<b[key]){
					return -1
				}else{
					return 0
				}
			})
		},
		add:function (opt) {
			this.selected__.push(opt)
			this.selected.push(opt.value)
			var index = this.can_select.indexOf(opt)
			if(index!=-1){
				this.can_select.splice(index,1)
			}
			this.left_sel=[]
		},
		rm:function (opt) {
			var index = this.selected__.indexOf(opt)
			if(index!=-1){
				this.selected__.splice(index,1)
			}
			var index_2 = this.selected.indexOf(opt.value)
			if(index_2!=-1){
				this.selected.splice(index_2,1)
			}
			this.can_select.push(opt)
			this.right_sel=[]
		},
		batch_add:function () {
			var tmp_ls = this.left_sel
			for(var x=0;x<tmp_ls.length;x++){
				for(var y=0;y<this.choices.length;y++){
					if(this.choices[y].value==tmp_ls[x]){
						this.add(this.choices[y])
						break;
					}
				}
			}
		},
		batch_rm:function () {
			var tmp_ls = this.right_sel
			for(var x=0;x<tmp_ls.length;x++){
				for(var y=0;y<this.selected__.length;y++){
					if(this.selected__[y].value==tmp_ls[x]){
						this.rm(this.selected__[y])
						break;
					}
				}
			}
		}
	}
})

