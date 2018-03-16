
=========
table
=========

参数格式
=================
::

    heads=[{name:'xxx',label:'label1'},
            {name:'jb',label:'jb'}]
    rows=[{xxx:"jjy",jb:'hahaer'}]


table的过滤器
==============
后端的写法，不过这个貌似可以看python的代码，python代码比前端容易看懂得多。
::

    class SalaryFilter(RowFilter):
        names=['is_checked']
        range_fields=[{'name':'month','type':'month'}]
        model=SalaryRecords
