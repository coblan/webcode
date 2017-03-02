if(!window.__multi_sel){
	document.write(`
	
<style type="text/css" media="screen" id="test">

._tow-col-sel{
	display: flex;
	align-items: stretch;

}

._tow-col-sel .sel{
	min-width:250px;
	max-width: 400px;

	display: flex;
	flex-direction: column;
	/*display: inline-block;*/
	/*vertical-align: middle;*/
}
._tow-col-sel .sel select{
	width: 100%;

	flex: 1;
}
._tow-col-sel .sel.right{
	border-width:2px;
}
._tow-col-sel .arrow{
	display: flex;
	flex-direction: column;
	justify-content:center;
	padding: 5px;
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
		<div class="sel">
			<b>可选项</b>
			<select name="" id="" multiple="multiple" :size="size" class='left' v-model='left_sel' @dblclick='batch_add()'>
				<option v-for='opt in orderBy(can_select,"label")' :value="opt.value" v-text='opt.label'  ></option>
			</select>
		</div>

		<div class="arrow">
			<img src="//res.enjoyst.com/image/right_02.png" alt=""
				:class='["_small_icon",{"deactive":left_sel.length==0}]' @click='batch_add()'>
			<br>
			<img src="//res.enjoyst.com/image/left_02.png" alt=""
				:class='["_small_icon",{"deactive":right_sel.length==0}]' @click='batch_rm()'>
		</div>
		<div class="sel">
			<b>选中项</b>
			<select name="" id="" multiple="multiple" :size="size" class='right' v-model='right_sel' @dblclick='batch_rm()'>
				<option v-for='opt in orderBy(selected,"label")' :value="opt.value" v-text='opt.label' ></option>
			</select>
		</div>

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
			//selected:this.value,
			selected:this.value,
			can_select:JSON.parse(JSON.stringify(this.choices)),
			left_sel:[],
			right_sel:[]
		}
	},
	mounted:function () {
		var self=this
		this.can_select=ex.filter(this.can_select,function(choice){
			return !ex.isin(choice,self.selected)
		})
		//this.selected__ = ex.remove(this.can_select,function (item) {
		//		return ex.isin(item.value,self.value)
		//	})
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
		//db_add:function(){
		//	if(this.left_sel.length>0){
		//		var opt = ex.findone(this.can_select,{value:this.left_sel[0]})
		//		if(opt){
		//			this.add(opt)
		//		}
		//	}
        //
		//},
		//add:function (opt) {
		//	if(!ex.isin(opt,this.selected)){
		//		this.selected.push(opt)
		//	}
        //
		//	ex.remove(this.can_select,opt)
		//	this.left_sel=[]
		//},
		//db_rem:function(){
		//	if(this.right_sel.length>0){
		//		var opt = ex.findone(this.selected,{value:this.right_sel[0]})
		//		if(opt){
		//			this.rm(opt)
		//		}
		//	}
		//},
		//rm:function (opt) {
		//	ex.remove(this.selected,opt)
		//	this.can_select.push(opt)
		//	this.right_sel=[]
		//},
		batch_add:function () {
			var self=this
			var added_choice= ex.remove(this.can_select,function(choice){
				return ex.isin(choice.value,self.left_sel)
			})
			ex.extend(this.selected,added_choice)
		},
		batch_rm:function () {
			var self=this
			var del_choice=ex.remove(this.selected,function(choice){
				return ex.isin(choice.value,self.right_sel)
			})
			ex.extend(this.can_select,del_choice)
		}
	}
})

