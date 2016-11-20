.. _fields:

===========
fields后端
===========

本来应该是form，但是form使用过于平凡，所以取名为fields，意指管理多个数据表字段之意。

**ModelFields** 类是整个后端系统的核心。利用他可以

* 继承于django.form，所以可以验证前端传递过来的数据。
* 封装了save_form函数，该函数会考虑权限。


	    
