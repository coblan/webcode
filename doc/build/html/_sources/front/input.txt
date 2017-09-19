
=========
inputs
=========

date
========
 日期选择框，
 ::

    <date v-model='variable'></date>  // 选择默认set=date ,即选择日期

    <date v-model='variable' set='month'></date> // 选择 set=month ,即选择月份

    <date v-model='variable' set='month' :config='{}'></date>  //  config 是自定义的配置对象，具体需要参加帮助文件

datetime
===========
 ::

    <datetime v-model='variable' :config='{}'></datetime> // 选择日期和时间

.. Note:: 返回的是ISO格式的字符串。后端设置 :code:`max_length=10,15` 。不要设置太大，否则可能会造成索引过大，甚至不能索引。

fields内部
=============

search_select
   具有搜索框的选择框。只需要在head中指定 :code:`head.type="search_select"` 就可以将 :code:`select` 改变成 :code:`search_select`