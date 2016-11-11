============
js辅助函数
============

ex
====

url search字符串
-----------------

parseSearch(queryString)
	@queryString: "?name=dog" 或者 "name=dog"

	rt ：js object

searchfy(obj,pre)
	@obj:js object
	@pre:前面需要带上的字符，例如 ?

	rt : "?name=dog" 或者"name=dog"

字符串处理
-----------
template(string,args)
	@string: 字符串。
	@args: js object或者js array

	rt: 经过render后的字符串

	example::

		var template1="我是{0}，今年{1}了";
		var template2="我是{name}，今年{age}了";
		var result1=ex.template("我是{0}，今年{1}了",["loogn",22]);
		var result2=ex.template("我是{name}，今年{age}了",{name:'loogn',age:22})
	
集合collection操作
------------------

collection 主要是指 object array ::

	[{name:'hhh',label:'jj'},
	{name:'sff',label:'jjyy'}]

merge(src1,src2)
	@src1,src2 都是 collection

	rt: 不会改变src1,src2,生成一个新的collection,利用 name属性作为基准，用到同名属性，利用src2的属性覆盖src1的相同属性。如果不同名的属性，都按src1，src2的值返回。

	example::
	
		ex.merge([{name:'dog',age:'18'}],[{name:'dog',label:'dog_label'}])
		>> [{name:'dog',age:'18',label:'dog_label'}]

findone (collection,obj)
	@collection : collection (obj array)
	@obj : 查询条件对象

	rt : null 或者 js object
	利用obj，在collection中查询“一个”满足要求的 对象

find(collection,obj)
	@collection: object array
	@obj : 查询条件对象

	rt: array

	利用查询条件obj，查出所有满足要求的object

数组补充
---------
product (src1,src2)
	@src1,src2 都是array，

	该函数作用是返回两个数组的笛卡尔积组成的pair数组
	
assign(dst,src) 
	@dst,src 都是js object

	将src的所有属性赋予dst


each (array,func)
	@array: 数组
	@func: 回调,传入参数为array的元素

	example::

		ex.each([1,2,3],function(v){v*2})

资源加载
----------
loadjs(src,success)
	@src: 地址
	@success: 回调函数,没有传入参数

	优势是，只会加载一次，不会重复加载

loadcss (src) 
	@src: 地址



其他path类函数
===============
String.prototype.startsWith

