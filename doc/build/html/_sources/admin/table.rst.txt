
==========
table
==========

table.py的功能是组织数据表，也就是多条记录的显示。主要功能有:

* sort
* filter (根据字段过滤)
* search (根据字段搜索)
* pagenations 分页

Example
=============

建议在admin.py文件中设置与model相关的Table::

	from director.model_admin.tabel import ModelTable,RowSearch,RowFilter,RowSort
	
	class BaseSearch(RowSearch):
	    names=['name']
	    model=BasicInfo

	class BaseFilter(RowFilter):
	    names=['name','age']
	    model=BasicInfo

	class BaseSort(RowSort):
	    names=['name','age']

	class BasicInfoTable(ModelTable):
	    model = BasicInfo
	    search=BaseSearch
	    filters = BaseFilter
	    sort=BaseSort
	    include=['name','age','user']

	    def get_rows(self):
	        query=self.get_query()
	        return [to_dict(x,filt_attr=lambda x:{'user':str(x.user) if x.user else '---'}, include=self.permited_fields()) for x in query] 


后端输出
========
::

    def get_context(self):
        return {
            'heads':self.get_heads(),
            'rows': self.get_rows(),
            'row_pages' : self.pagenum.get_context(),
            'row_sort':self.row_sort.get_context(),
            'row_filters':self.row_filter.get_context(),
            'placeholder':self.row_search.get_context(),
            'model':model_to_name(self.model),
        }

数据结构::

	heads=[
		{"name": "name", "label": "\u59d3\u540d"}, 
		{"sortable": true, "name": "age", "label": "\u5e74\u9f84"}
		]
	rows=[
		{"name": "heyul0", "age": "32", "user": null, "pk": 1, "_class": "user_admin.BasicInfo", "id": 1}
		]
	row_pages={
		'options':[1,2,3,4,...,100],
    	'crt_page':2
        }
    row_sort={
    	'sortable':[name,age], # self.valid_name,
    	'sorted':'-age,name' # self.sort_args}
    	}
    row_filters=[
    	{'name':'name','label':'姓名','option':[{value:xxx,label:xxx},]},
    	{'name':'age','label':'年龄','option':[{value:xxx,label:xxx},]}
    	]
    placeholder='input your name or age'
    model='user_admin.basicInfo'
    

前端接收
========
::

	heads={{ heads | jsonify | default:'[]'}}
	rows={{ rows | jsonify | default:'[]'}}
	row_pages = {{ row_pages | jsonify}}
	row_filters={{row_filters | jsonify }}
	row_sort={{row_sort | jsonify | default:'[]' }}
	placeholder = '{{placeholder |default:""}}'
	model ="{{ model }}"
	url_args=ex.parseSearch()
	//	search字段从 url_args._q 来取值

	// Vuejs
	data:{
        heads:heads,
        rows:rows,
        crt_page:{},
        row_filters:row_filters,
        row_sort:row_sort,
        row_pages:row_pages,
        placeholder:placeholder,
        selected:[],
        del_info:[],
        menu:menu,
        can_add:false,
        can_del:false,
        model:model,
        url_args:url_args,
	},
	mixins:[table_fun],


**mix** :table_fun 引入了：

* is_sorted(row_sort.sort_str ,head.name )
	判断字段是否已排序
* toggle( row_sort.sort_str,head.name)
	切换字段排序方向，返回重拍的sort_str
其他的例如remove函数，sort-mark内部使用，外部可以不用。::

	<thead>
		<tr >
			<td style='width:50px' v-if='selected'>
				<input type="checkbox" name="test" value=""/>
			</td>
			<td v-for='head in heads' :class='["td_"+head.name,{"selected":is_sorted(row_sort.sort_str ,head.name )}]'>
				<span v-if='ex.isin(head.name,row_sort.sortable)' v-text='head.label' class='clickable' 
					@click='row_sort.sort_str = toggle( row_sort.sort_str,head.name)'></span>
				<span v-else v-text='head.label'></span>
				<sort-mark class='sort-mark' v-model='row_sort.sort_str' :name='head.name'></sort-mark>
			</td>
		</tr>
	</thead>



page-num 
=========
useage::

	<paginator :nums='row_pages.options' :crt='row_pages.crt_page' @goto_page='goto_page($event)'></paginator>

nums:
	formate:['1','...','6','7','8','...','999']

	由django pagenations 生成，再转换为number list.


	