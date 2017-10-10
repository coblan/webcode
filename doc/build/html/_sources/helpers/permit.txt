=========
权限
=========

思考
=======

1. 正负权限

总体步骤
=========

1. 先在admin.py文件中，注册权限

2. 后台调用 :code:`ModelPermit` 和 :code:`has_permit` 进行权限认证。

3. 通过前端页面设置权限组和人员归属。


注册权限
========
::

    permit_list.append(WorkNode)
    permit_list.append(NodeGroup)
    permit_list.append({'name':'nodegroup','label':'liucheng.nodegroup_SP','fields':[
        {'name':'check_all','label':'查看所有流程','type':'bool'},
        {'name':'edit_template','label':'编辑模板','type':'bool'},
    ]})

后台权限认证
=============

model逻辑权限
---------------

:code:`ModelTable` 和 :code:`ModelFields` 自带权限认证。如果需要自定义权限输出可以利用 :code:`ModelPermit` 类来控制Model的输出字段。如果是要利用前端用户组权限输出，直接调用 :code:`permit_to_dict`，它会查询用户组权限，调用注册的 :code:`ModelFields` 类进行输出。

自定义名称权限
--------------------

has_permit(user,permit_name)

这种权限可以是负权限，用于对 :code:`Modelpermit` 权限进行修剪。