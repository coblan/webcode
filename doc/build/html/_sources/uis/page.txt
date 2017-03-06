===============
pagenator
===============
所在文件 vuejs/table.js
::
	
	<paginator :nums='row_pages.options' :crt='row_pages.crt_page' @goto_page='goto_page($event)'></paginator>

nums:
	[‘1’,’...’,‘6’,‘7’,‘8’,’...’,‘999’]

crt:
	字符串 1

goto_page事件:
	出发刷新数据的函数，event是点击的页数