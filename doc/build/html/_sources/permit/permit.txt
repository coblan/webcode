=========
权限
=========

权限是director模块的重要组成部分，主要有两块 

1. :code:`ModelPermit` ，用于控制数据库表的读写。控制粒度每个字段的读写，表记录的创建删除，以及整个表的日志查看。

2. 自定义权限，使用 :code:`has_permit` 进行判断。


注册权限
-----------
先在admin.py文件中，注册权限。注册权限备选项的代码一般都放在 :code:`admin.py` 文件内，便于查找。
::

    permit_list.append(WorkNode)
    permit_list.append(NodeGroup)
    permit_list.append({'name':'nodegroup','label':'liucheng.nodegroup_SP','fields':[
        {'name':'check_all','label':'查看所有流程','type':'bool'},
        {'name':'edit_template','label':'编辑模板','type':'bool'},
    ]})


后台调用 
------------
后台调用 :code:`ModelPermit` 和 :code:`has_permit` 进行权限认证。


Modelpermit
============

:code:`ModelTable` 和 :code:`ModelFields` 自带权限认证。如果需要自定义权限输出可以利用 :code:`ModelPermit` 类来控制Model的输出字段。如果是要利用前端用户组权限输出，直接调用 :code:`permit_to_dict`，它会查询用户组权限，调用注册的 :code:`ModelFields` 类进行输出。

::

   perm=ModelPermit(instance,user)
   perm.readable_fields()


has_permit
============
has_permit(user,permit_name) 这种权限可以是负权限，用于对 :code:`Modelpermit` 权限进行修剪。

::

    permit_list.append({'name':'workgroup','label':'工作流程','fields':[
        {'name':'-only_self','label':'只能修改自身工作步骤','type':'bool'},]
    })

    # 使用该权限
    if has_permit(crt_user,"workgroup.-only_self"):
        dosomething...

.. Note:: 要小心负的权限，因为按照普通的习惯，都是权限越多，能力越大。负权限可能与直觉有所违背，一旦添加了负权限，就会约束用户的行为，即使他属于其他不受约束的权限组。(到目前，还没有最佳实践来调和这种负权限带来的，稍微有点别扭的感觉)

分配权限组给用户
---------------------
通过前端页面设置权限组和人员归属。利用两个页面，一个页面用于创建 **可用权限** ，一个用于将权限组赋予用户。