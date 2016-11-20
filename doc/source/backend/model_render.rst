.. _model_render:

================
model页面engine
================

为了模仿django admin的功能，根据在admin.py中注册的page，自动生成model列表页面，管理form页面。

启用
=====

* 配置url::

	from director import urls as director_urls
	urlpatterns = [
	    url(r'^d/',include(director_urls)),  # 可以是任意不冲突路径。所有engine渲染页面都是以该路径开始
	    url(r'^accounts/',include(director_urls)), # 是为了兼容django的login登录默认地址。
	    ...
	]

* 配置页面::

	# 显示table的页面
    class BaseinfoTablePage(TablePage):
    	tableCls=BasicInfoTable

	# 用于修改单条记录的form页面
    class BaseinfoFormPage(FormPage):
    	fieldsCls=BasicInfoFields
    
	model_page_dc['basicinfo']={'table':BaseinfoTablePage,'form':BaseinfoFormPage}

该字典制定了配套的table页面和form页面，利用该字典，一般在table的第一个字段会生成指向form页面的链接。

* 配置菜单，反查地址::

	'url':lambda: reverse('model_table',kwargs={'name':'basicinfo'})

该url可以用于构造左侧的导航栏菜单。

page页面
=========
页面的作用就是把各个context组织起来，结合设置的template一起，渲染成web页面

* table页面::

	class TablePage(object):
	    template='table.html'
	    tableCls=''
	    ajax_scope={}
	    
* fields页面::

	class FormPage(object):
	    template='fields.html'
	    fieldsCls=''
	    ajax_scope={}

更加深度的定制，只需要重写get_context()即可，具体见源代码。


