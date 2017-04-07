
=========
table
=========

Argments Format:
=================

heads=[{name:'xxx',label:'label1'},
        {name:'jb',label:'jb'}]
rows=[{xxx:"jjy",jb:'hahaer'}]


table的过滤器
============
::

    class SalaryFilter(RowFilter):
    names=['is_checked']
    range_fields=[{'name':'month','type':'month'}]
    model=SalaryRecords
