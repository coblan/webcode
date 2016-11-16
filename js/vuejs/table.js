

/*
Argments Format:
=================

heads=[{name:'xxx',label:'label1'},
        {name:'jb',label:'jb'}]
rows=[{xxx:"jjy",jb:'hahaer'}]

 */

Vue.component('sort-table',{
    props:{
	    value:{},
        heads:{
            default:function () {
                return []
            }
        },
        rows:{
            default:function () {
                return [];
            }
        },
        sort:{
            default:function () {
                return []
            }
        },
        map:{
            default:function () {
                return function (name,row) {
                    return row[name];
                }
            }
        }
    },
    data:function () {
    	return {
	    	icatch:'',
	    	selected:this.value,
    	}
    },
    methods:{
        in_sort:function (name) {
            return this.sort.indexOf(name)!=-1
        },
        get_sort_pos:function (name) {
            if(name.startsWith('-')){
                name=name.substr(1)
            }
            var index = this.sort.indexOf(name)
            if (index!=-1){
                return index
            }else{
                return this.sort.indexOf("-"+name)
            }
        },
        sort_col:function (name) {
            var pos =this.get_sort_pos(name)
            if(pos==-1){
                this.sort.push(name)
            }else{
                this.sort[pos]=name
            }
            this.$dispatch('sort-changed')
        },
        rm_sort:function (name) {
            var pos =this.get_sort_pos(name)
            if(pos!=-1){
                this.sort.splice(pos,1)
            }
            this.$dispatch('sort-changed')
        },
    } ,
    watch:{
	    selected:function (v) {
	    	this.$emit('input',v)
	    }
    },
    template:`<table>
			<thead>
				<tr>
					<td style='width:50px' v-if='selected'>
						<input type="checkbox" name="test" value=""/>
					</td>
					<td v-for='head in heads' :class='"td_"+head.name'>
						<span v-if='head.sortable' v-text='head.label' class='clickable' @click='sort_col(head.name)'></span>
						<span v-else v-text='head.label'></span>
						<span v-if='icatch = get_sort_pos(head.name),icatch!=-1'>
							<span v-text='icatch'></span>
							<span class="glyphicon glyphicon-chevron-up clickable" v-if='in_sort(head.name)'
								 @click='sort_col("-"+head.name)'></span>
							<span v-if='in_sort("-"+head.name)' class="glyphicon  glyphicon-chevron-down clickable"
								 @click='sort_col(head.name)'></span>
							<span v-if='in_sort(head.name)||in_sort("-"+head.name)' class="glyphicon glyphicon-remove clickable"
								 @click='rm_sort(head.name)'></span>
						</span>
					</td>
				</tr>
			</thead>
			<tbody>
				<tr v-for='row in rows'>
					<td v-if='selected'><input type="checkbox" name="test" :value="row.pk" v-model='selected'/></td>
					<td v-for='head in heads' :class='"td_"+head.name'>
						
						<span v-html='map(head.name,row)'></span>
					</td>
				</tr>
			</tbody>
		</table>`,
})

//<component v-if='icatch = map(head.name,row),icatch.com' :is='icatch.com' :kw='icatch.kw'></component>

/*
Argments:
==========

nums = ['1','...','6_a','7','8','...','999']

Events:
=======

goto_page,num

*/
Vue.component('paginator',{
    props:['nums','crt'],
    methods:{
        goto_page:function (num) {
            if (!isNaN(parseInt(num)) && !num.endsWith('a')){
                this.$emit('goto_page',num)
            }
        }
    },
    template:`
    <ul class="pagination page-num">

    <li v-for='num in nums' track-by="$index" :class='{"clickable": !isNaN(parseInt(num))}' @click='goto_page(num)'>
    <span v-text='!isNaN(parseInt(num))? parseInt(num):num' :class='{"active":parseInt(num) ==parseInt(crt)}'></span>
    </li>

    </ul>
    `
})

var build_table_args = {
    methods:{
        get_filter_obj:function () {
            //var search_str=''
            var filter_obj={}
            for(var x=0;x<this.filters.length;x++){
                var filter = this.filters[x]
                if(filter.value){
	                filter_obj[filter.name]=filter.value
                    //search_str+= filter.name+'='+filter.value+'&'
                }
            }
            if(this.q){
	            filter_obj['_q']=this.q
                //search_str+='_q='+this.q+'&'
            }
            return filter_obj
            //return search_str
        },
        get_sort_str:function () {
            var sort_str=''
            for(var x=0;x<this.sort.length;x++){
                sort_str+=this.sort[x]+','
            }
            return sort_str
        },
        refresh_arg:function () {
            var filter_obj=this.get_filter_obj()
            var sort_str = this.get_sort_str()
            var search_obj={'_sort':sort_str}
            update(search_obj,filter_obj)
            location.search = searchfy(search_obj)
            //location.search='_sort='+sort_str+'&'+search_str
        },
         goto_page:function (num) {
            var filter_obj=this.get_filter_obj()
            var sort_str = this.get_sort_str()
            var search_obj={'_sort':sort_str,'_page':num}
            update(search_obj,filter_obj)
            location.search=searchfy(search_obj)
            //location.search='_sort='+sort_str+'&'+search_str+'_page='+num
        },
    },
    events:{
        'sort-changed':function () {
            this.refresh_arg()
        },
       
    }
}

document.write(`
<style type="text/css" media="screen" id="test">
ul.pagination li {display: inline;cursor: pointer}

ul.pagination li span {
    color: black;
    float: left;
    padding: 4px 10px;
    text-decoration: none;
    border: 1px solid #ddd;
}

ul.pagination li span.active {
    background-color: #4CAF50;
    color: white;
}

ul.pagination li span:hover:not(.active) {background-color: #ddd;}
</style>
`)

var table_fun={
	methods:{
		is_sel:function (sortable,name) {
			/*
			@sortable: array
			*/
			return sortable.indexOf(name)!=1
		},
		toggle:function (sorted,name) {
			var out=[]
			var find =false
			for(var x=0;x<sorted.length;x++){
				var org_name=sorted[x]
				if(org_name.startsWith('-')){
					var norm_name=org_name.slice(1)
					var plus=false
				}else{
					var norm_name=org_name
					var plus=true
				}
				if(name==norm_name){
					find=true
				}
				if(name==norm_name && plus){
					out.push('-'+norm_name)
				}else{
					out.push(norm_name)
				}
			}
			if(!find){  // 如果没找到，说明是激活排序
				out.push(name)
			}
			return out
		}
	}

}

Vue.component('sort-mark',{
	props:['sorted','name'],
	template:`<div><img v-if='get_status()=="up"' src='http://res.enjoyst.com/image/up_01.png' />
			<img v-if='get_status()=="down"' src='http://res.enjoyst.com/image/down_01.png' />
			</div>
	`,
	methods:{
		get_status:function () {
			for(var x=0;x<this.sorted.length;x++){
				var org_name=this.sorted[x]
				if(org_name.startsWith('-')){
					var name=org_name.slice(1)
					var minus='up'
				}else{
					var name=org_name
					var minus='down'
				}
				if(name==this.name){
					return minus
				}
			}
			return 'no_sel'
		}
	}
	
})



window.table_fun=table_fun
window.build_table_args=build_table_args


