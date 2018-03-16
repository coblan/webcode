================
filter过滤器
================
源文件：/js/vuejs/filter.js
引入文件:table.pack.js

描述
========

这个过滤器是用在table页面。

::

    <com-filter class="flex" :heads="row_filters" :search="search_args"
                    :search_tip='search_tip' @submit="search()"></com-filter>

其中 :code:`row_filters` 是由后端注入的。

filter组件
==========
sel-search-filter：
   具有搜索框的过滤器。只需要让 :code:`filter.type="sel-search-filter"` 并且 :code:`filter.options` 不为空。使用到的三方组件: :code:`bootstrap-select`