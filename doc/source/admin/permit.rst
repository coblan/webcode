=========
权限控制
=========

model表的数据结构
=================
::

	permit_list=[
		Basicinfo,
		{name:'special',label:'Special',fields:[
				{name:'xxx',label:'xxx',type:'bool'},
		]}
	]


	heads=[
		{name:'user_admin.basicinfo',label:'员工基本信息',type:'model',fields:[
				{name:'name',label:'员工姓名'},
				{name:'age',label:'年龄'}
			]},
		{name:'special',label:'特殊权限',fields:[
				{name:'xxx',label:'xxx',type:'bool'},
			]}
	]


	permit={
		'user_admin.basicinfo':['can_create','can_delete','name_read','name_write'],
		'spcial':['xxx','jjj'],
	}



