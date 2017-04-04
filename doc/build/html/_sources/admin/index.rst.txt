==========
模拟admin
==========

包地址:helpers.director

webcode的model_admin模块，模拟django的admin，但是更加灵活。

主要元素有:

render:
	路由请求到table_page,form_page,del_page

page:
	代表一个web页面，最主要属性有:template，get_context()

fields:
	代表一个form表单，管理数据表的row的显示与修改等。

table:
	显示一个数据表row的列表，具备搜索，过滤，排序，分页功能。

三个重要的字典

permit_list.append(SalaryRecords)
	接受Model对象，自动生成权限选项。

model_dc[BasicInfo]={'fields':BasicInfoFields}
	定义Model的编辑管理类，如果遇到save函数，将根据该字典查询，获取编辑类，进行验证。

model_page_dc['basicinfo']={'table':BaseinfoTablePage,'form':BaseinfoFormPage}
	给director路由使用，一般的model都具备列表页面和编辑表单页面。


.. toctree::
   :maxdepth: 2

   example
   simple_fields
   fields
   table
   permit