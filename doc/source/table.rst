======
table
======

模仿Django.Admin，大致需要两个组件系统。一个是table，一个是form。

table用于显示数据库中表格式数据。我会把相关功能函数都打包到 **table.pack.js**

table的主要功能有:

* sort
* filter (根据字段过滤)
* search (根据字段搜索)
* pagenations 分页


In my design,there has three Components.table,filter and pagenations.All Components **tied by data**,so they can be used alone.

Example
=============

BackEnd
--------

FrontEnd
---------
* recieve data from django::

	filters={{filters | safe }}
	q='{{q | safe |default:""}}'
	sort={{sort | safe }}
	heads={{ heads | safe }}
	pages={{ pages | safe }}
	page_nums = {{ page_nums | safe}}

* put those variable into Vue data section,and add **build_table_args** to manage url argments::

	data:{
		heads:heads,
		pages:pages,
		crt_page:{},
		filters:filters,
		sort:sort,
		page_nums:page_nums,
		q:q
	},
	mixins:[build_table_args],
	// now ,you only need bind search button 's click event to search function of build_table_args mixin
	// other argments will fetch and convert to url argments string by build_table_args
	
.. note:: filter,q,sort, must not change,for build_table_args will reference it by name.


	
* html::

	<input type="text" name="test" v-model='q'/>
				
	<select name="" id="" v-for='filter in filters' v-model='filter.value'>
		<option value="" v-text='filter.label'></option>
		<option value="" >----</option>
		<option  v-for='option in filter.options' :value="option.name" v-text='option.label'></option>
	</select>
	<button name="test" type="button" value="val" @click='search()'>search</button>
	<sort-table :heads='heads' :rows='pages' :map='map' :sort='sort'></sort-table>


table
======
there is a Component ,name after "sort-table" ,used to render table information.

useage::

	<sort-table :heads='heads' :rows='pages' :map='map' :sort='sort'></sort-table>

heads:
	formate: [{name:'xxx',label:'label1',sortable:true},]

	may be generate by **model_to_head** and **form_to_head**. In table.py ,I generate head with model_to_head.

rows:
	this is a normal dict(js object) list,represent some model instance.Each dict may be generate by **to_dict**

map:
	Function used for adapt tabel cell content.return value may be html and Component dict.
	::
	
		map:function (name,row) {
			if(name=='name'){
				return '<a href="editpage/?page_id='+row.pk+'">'+row[name]+'</a>'
			else if(name=='com'){
				return {com:xxx,kw:kw}
			}else{
				return row[name]
			}
		},
				
sort:
	fromate: ['name','-age']
	
	A list,represent table sort by column.This can be generate by python file


page-num 
=========
useage::

	<paginator :nums='page_nums'></paginator>

nums:
	formate:['1','...','6_a','7','8','...','999']

	由django pagenations 生成，再转换为number list.
	