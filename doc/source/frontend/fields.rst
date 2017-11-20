.. _fields.js:

======
表单
======

为了避开名词form，所以还是采用和后端一样的名字fields

:ref:`fields_uis` 页面，包含了一些field组件内部的vue组件ui 

基本使用
==========

源代码地址::

	/js/vuejs/fields.js    //源代码地址
	/build/fields.pack.js  //引入地址

前端接受数据结构::

	kw={
		heads:[{name:'name',type:'linetext',label,'姓名',required:true},
			{name:'age',type:'linetext',label,'年龄'}],
		row:{name:'myname',age:'30'},
		errors:{}  //用户承载后端返回的验证错误
	}
	

普通使用::

	new Vue{
		data:{
			kw:{
				rows:[],
				heads:[],
				errors:{}
			}
		}
	}

	<field name='name' :kw='kw'></field>

错误处理::

	//在ajax handler中
	if (data.save.errors){
		self.kw.errors = data.save.errors
	}

	//data.save.errors是后端返回的json数据
	{
		'name':'can not be none',
		'age':'xxx'
	}
	
原理
=====

1. 根据heads，生成input以及外部的label wraper
2. 根据row，绑定各个input数据
3. 提交后台验证，如果有错误，返回错误存储于errors中，触发对应input现实错误信息

使用field_fun
===============
::

	new Vue{
		mixins:[field_fun]
	}

	<field name='name' :kw='kw'></field>

**field_fun** 对象封装了field组件大多数的功能元素。源代码位于：:code:`/js/vuejs/fields/field_page.js`

后端生成fieldsjs数据
=====================

.. _fields-heads:

生成heads
----------

1. 使用fields

2. 简化版::



生成row
--------
::

	row= json.dumps(to_dict(ArtComment()))

