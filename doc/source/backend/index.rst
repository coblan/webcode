=======
后端
=======

依赖django框架而建，但是放弃了不太灵活又太复杂的django.admin模块。

* :ref:`fields` 继承django的form，作为后端数据验证 
* 几乎重写了权限系统，
* 自定义了列表系统。


.. toctree::
   :maxdepth: 2

   fields
   model_render
   permission