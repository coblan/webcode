/**
 >5>mobile/table.rst>

 table的过滤器
 ============
 ::

 class SalaryFilter(RowFilter):
 names=['is_checked']
 range_fields=[{'name':'month','type':'month'}]
 model=SalaryRecords

 <-<
 */

var com_filter={
    props:['row_filters','search_args','search_tip'],
    computed:{
        option_filters:function(){
            return ex.filter(this.row_filters,function(head){
                return head.options
            })
        },
        time_filters:function(){
            var time_spans=ex.filter(this.row_filters,function(head){
                return ex.isin(head.type,['time','date','month'])
            })
            return time_spans
        }
    },
    template:ex.template(`
    <div>
    <div class="weui-panel" v-if='search_tip'>
        <div class="weui-cells__title">搜索</div>
        <div class="weui-cells weui-cells_form">
            <div class="weui-cell">
                <div class="weui-cell__hd" >
                    <label for=''  class="weui-label">关键字</label>
                </div>
                 <div class="weui-cell__bd">
                      <input v-if='search_tip' class="weui-input" type="text" name="_q" v-model='search_args._q' :placeholder='"请输入"+search_tip'/>
                 </div>

            </div>
        </div>
    </div>


    <div class="weui-panel" v-if='option_filters.length>0'>

        <div class="weui-cells__title">选择过滤</div>
        <div class="weui-cells weui-cells_form">
            <div class="weui-cell weui-cell_select weui-cell_select-after" v-for='filter in option_filters'>
                <div class="weui-cell__hd" >
                    <label for=''  class="weui-label">
                        <span v-text='filter.label'></span>
                    </label>
                </div>
                <div class="weui-cell__bd">
                    <select v-if="filter.options" name=""   v-model='search_args[filter.name]' class='weui-select'>
                        <!--<option :value="undefined" v-text='filter.label'></option>-->
                        <option :value="null">----</option>
                        <option v-for='option in filter.options' :value="option.value" v-text='option.label'></option>
                    </select>
                </div>
            </div>
        </div>
    </div>
            <!--<input v-if='search_tip' type="text" name="_q" v-model='search._q' :placeholder='search_tip' class='form-control'/>-->
   <div class="weui-panel" v-if="time_filters.length>0">
        <div class="weui-cells__title">时间段</div>
        <div  v-for='filter in time_filters'  class="weui-cells weui-cells_form date-filter">
            <div class="weui-cell">
                 <div class="weui-cell__hd" >
                    <label for=''  class="weui-label">
                        <span>从</span>
                    </label>
                </div>
                 <div class="weui-cell__bd">
                     <date v-if="filter.type=='month'" set="month" v-model="search_args['_start_'+filter.name]" ></date>
                     <date v-if="filter.type=='date'"  v-model="search_args['_start_'+filter.name]" ></date>
                </div>
            </div>
            <div class="weui-cell">
                <div class="weui-cell__hd" >
                    <label for=''  class="weui-label">
                        <span>到</span>
                    </label>
                </div>
                <div class="weui-cell__bd">
                      <date v-if="filter.type=='month'" set="month" v-model="search_args['_end_'+filter.name]"></date>
                      <date v-if="filter.type=='date'"  v-model="search_args['_end_'+filter.name]" ></date>
                </div>
            </div>
        </div>
   </div>
            <slot></slot>
            <!--<button name="go" type="button" class="btn btn-info" @click='m_submit()' >{submit}</button>-->


    </div>
    `,ex.trList(['From','To','submit'])),
    created:function(){
        var self=this
        ex.each(self.row_filters,function(filter){
            // 初始化 Vue 变量属性。
            if(ex.isin(filter.type,['month','date'])){
                if(!self.search_args['_start_'+filter.name]){
                    Vue.set(self.search_args,'_start_'+filter.name,'')
                }
                if(!self.search_args['_end_'+filter.name]){
                    Vue.set(self.search_args,'_end_'+filter.name,'')
                }

            }
        })
    },
    methods:{
        m_submit:function () {
            this.$emit('submit')
            //if(this.submit){
            //    this.submit()
            //}else{
            //    location =ex.template('{path}{search}',{path:location.pathname,
            //        search: encodeURI(ex.searchfy(this.search,'?')) })
            //}

        },
    }

}
Vue.component('com-filter',com_filter)


var com_sort={
    props:['row_sort'],
    template:`
    <div class="weui-panel" v-if="">
    </div>
    `
}

Vue.component('com-sort',com_sort)

var com_table={
    props: {
        has_check: {},
        heads: {},
        rows: {
            default: function () {
                return []
            }
        },
        map: {},
        row_sort: {
            default: function () {
                return {sort_str: '', sortable: []}
            }
        },
        value: {}
    } ,
    computed:{
        selected:{
            get:function(){
                return this.value
            },
            set:function(v){
                this.$emit('input',v)
            }
        }
    },
    watchs:{
        selected:function(v){
            this.$emit('input',v)
        }
    },
    methods:{
        m_map:function(name,row){
            if(this.map){
                return this.map(name,row)
            }else{
                return row[name]
            }
        },
        is_sorted:function (sort_str,name) {
            var ls=sort_str.split(',')
            var norm_ls=this.filter_minus(ls)
            return ex.isin(name,norm_ls)
        },
        filter_minus:function (array) {
            return ex.map(array,function (v) {
                if(v.startsWith('-')){
                    return v.slice(1)
                }else{
                    return v
                }
            })
        },
        is_sortable:function(name){
            return ex.isin(name,this.row_sort.sortable)
        }
    },
    template:`	<table>
		<thead>
			<tr >
				<th style='width:50px' v-if='has_check'>
					<input type="checkbox" name="test" value=""/>
				</th>
				<th v-for='head in heads' :class='["td_"+head.name,{"selected":is_sorted(row_sort.sort_str ,head.name )}]'>
					<span v-if='is_sortable(head.name)' v-text='head.label' class='clickable'
						@click='row_sort.sort_str = toggle( row_sort.sort_str,head.name)'></span>
					<span v-else v-text='head.label'></span>
					<sort-mark class='sort-mark' v-model='row_sort.sort_str' :name='head.name'></sort-mark>
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for='row in rows'>
				<td v-if='has_check'>
					<input type="checkbox" name="test" :value="row.pk" v-model='selected'/>
				</td>
				<td v-for='head in heads' :class='"td_"+head.name'>
					<span v-html='m_map(head.name,row)'></span>
				</td>
			</tr>
		</tbody>
	</table>`
}

Vue.component('com-table',com_table)

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
    props:['nums','crt','set'],
    data:function(){
        return {
            input_num:this.crt ||1,
        }
    },

    methods:{
        goto_page:function (num) {
            if (!isNaN(parseInt(num))){
                this.$emit('goto_page',num)
            }
        }
    },
    template:ex.template(`
    <div class="paginator">
    <ul class="pagination page-num">
    <li v-for='num in nums' track-by="$index" :class='{"clickable": !isNaN(parseInt(num))}' @click='goto_page(num)'>
    <span v-text='!isNaN(parseInt(num))? parseInt(num):num' :class='{"active":parseInt(num) ==parseInt(crt)}'></span>
    </li>
    </ul>
    <div v-if="set=='jump'" class="page-input-block">
        <input type="text" v-model="input_num"/>
        <button type="button" class="btn btn-success btn-xs" @click="goto_page(input_num)">{jump}</button>
    </div>
    </div>
    `,ex.trList(['jump']))
})

var build_table_args = {
    // 这个函数应该没用了 ，其功能被 filters object 属性 取代了。--2017/1/19日
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



var table_fun={
    data:function(){
        return {
            heads:heads,
            rows:rows,
            row_filters:row_filters,
            row_sort:row_sort,
            row_pages:row_pages,
            search_tip:search_tip,
            selected:[],
            del_info:[],
            menu:menu,

            can_add:can_add,
            can_del:can_del,
            show_menu:false,
            search_args:search_args,
            ex:ex,
        }
    },
    watch:{
        'row_sort.sort_str':function (v) {
            this.search_args._sort=v
            this.search()
        }
    },
    computed:{
        can_search:function(){
            if(this.row_filters.length>0 || this.row_sort.length>0 || this.search_tip){
                return true
            }else{
                return false
            }
        }
    },
    methods:{
        search:function () {
            location =ex.template('{path}{search}',{path:location.pathname,
                search: encodeURI(ex.searchfy(this.search_args,'?')) })
        },
        //rt_win:function(row){
        //    ln.rtWin(row)
        //},
        filter_minus:function (array) {
            // 移到 com-table 中去了
            return ex.map(array,function (v) {
                if(v.startsWith('-')){
                    return v.slice(1)
                }else{
                    return v
                }
            })
        },
        is_sorted:function (sort_str,name) {
            // 该函数被移到 com-table 中去了。
            var ls=sort_str.split(',')
            var norm_ls=this.filter_minus(ls)
            return ex.isin(name,norm_ls)
        },
        toggle:function (sort_str,name) {
            var ls=ex.split(sort_str,',')
            var norm_ls=this.filter_minus(ls)
            var idx = norm_ls.indexOf(name)
            if(idx!=-1){
                ls[idx]=ls[idx].startsWith('-')?name:'-'+name
            }else{
                ls.push(name)
            }
            return ls.join(',')
        },
        remove_sort:function (sort_str,name) {
            var ls=ex.split(sort_str,',')
            ls=ex.filter(ls,function (v) {
                return v!='-'+name && v!=name
            })
            return ls.join(',')
        },
        map:function(name,row){
            var content=row[name]
            if(this.search_args._pop){
                ln.rtWin(row)
            }else if(name==this.heads[0].name){
                return this.form_link(name,row)
            }else if(content===true){
                return '<img src="//res.enjoyst.com/true.png" width="15px" />'
            }else if(content===false){
                return '<img src="//res.enjoyst.com/false.png" width="15px" />'
            }else{
                return content
            }
        },
        form_link:function(name,row){
            return ex.template('<a href="{edit}?pk={pk}&next={next}">{value}</a>',
                {	edit:page_name+'.edit',
                    pk:row.pk,
                    next:encodeURIComponent(location.href),
                    value:row[name]
                })
        },

        del_item:function () {
            if (this.selected.length==0){
                return
            }
            var del_obj={}
            for(var j=0;j<this.selected.length;j++){
                var pk = this.selected[j]
                for(var i=0;i<this.rows.length;i++){
                    if(this.rows[i].pk.toString()==pk){
                        if(!del_obj[this.rows[i]._class]){
                            del_obj[this.rows[i]._class]=[]
                        }
                        del_obj[this.rows[i]._class].push(pk)
                    }
                }
            }
            var out_str=''
            for(var key in del_obj){
                out_str += (key+':'+ del_obj[key].join(':')+',')
            }
            location=ex.template("{engine_url}/del_rows?rows={rows}&next={next}",{engine_url:engine_url,
                rows:encodeURI(out_str),
                next:encodeURIComponent(location.href)})
        },
        goto_page:function (page) {
            this.search_args._page=page
            this.search()
        },
        add_new:function () {
            location= ex.template('{engine_url}/{page}.edit/?next={next}',{
                engine_url:engine_url,
                page:page_name,
                next:encodeURIComponent(location.href)
            })
        },
    },

}

var com_table_btn={
    data:function(){
        return {
            can_add:can_add,
            can_del:can_del,
        }
    },
    props:['add_new','del_item'],
    template:`<div class='btn-group' style='float: right;'>
			<a type="button" class="btn btn-success btn-sm" :href='add_new()' v-if='can_add' role="button">创建</a>
			<button type="button" class="btn btn-danger btn-sm" @click='del_item()' v-if='can_del'>删除</button>
		</div>`
}

Vue.component('com-table-btn',com_table_btn)

Vue.component('sort-mark',{
    props:['value','name'],
    data:function () {
        return {
            index:-1,
            sort_str:this.value,
        }
    },
    mixins:[table_fun],
    template:`<div class='sort-mark'>
			<span v-if='index>0' v-text='index'></span>
			<img v-if='status=="up"' src='http://res.enjoyst.com/image/up_01.png'
					 @click='sort_str=toggle(sort_str,name);$emit("input",sort_str)'/>
			<img v-if='status=="down"' src='http://res.enjoyst.com/image/down_01.png'
					 @click='sort_str=toggle(sort_str,name);$emit("input",sort_str)'/>
			<img v-if='status!="no_sort"' src='http://res.enjoyst.com/image/cross.png'
					@click='sort_str=remove_sort(sort_str,name);$emit("input",sort_str)'/>
			</div>
	`,
    computed:{
        status:function () {
            var sorted=this.value.split(',')
            for(var x=0;x<sorted.length;x++){
                var org_name=sorted[x]
                if(org_name.startsWith('-')){
                    var name=org_name.slice(1)
                    var minus='up'
                }else{
                    var name=org_name
                    var minus='down'
                }
                if(name==this.name){
                    this.index=x+1
                    return minus
                }
            }
            return 'no_sort'
        }
    },
    //methods:{

    //	get_status:function () {
    //		var sorted=this.sort_str.split(',')
    //		for(var x=0;x<sorted.length;x++){
    //			var org_name=sorted[x]
    //			if(org_name.startsWith('-')){
    //				var name=org_name.slice(1)
    //				var minus='up'
    //			}else{
    //				var name=org_name
    //				var minus='down'
    //			}
    //			if(name==this.name){
    //				this.index=x+1
    //				return minus
    //			}
    //		}
    //		return 'no_sort'
    //	}
    //}

})




window.table_fun=table_fun
window.build_table_args=build_table_args


