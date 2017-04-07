
================
director engine
================

步骤
=====

1. 自定义engine::

    class XicheEngine(BaseEngine):
        menu=[
        {'label':'home','url':'/home','icon':fa('fa-home')},
        ...

2. 加入页面主要有两种方式，一种是baseengine.add_pages(dc),一种是base.page_dc.update(dc).
如果用的是第二种方式，需要调用add_pages(page_dc)

3. 在总的url.py文件中注册engine的入口地址::

    url(r'^d/([\w\.]+)',XicheEngine.as_view(),name=XicheEngine.url_name)

说明
=====
*. add_pages时传入的字典，记载了各个页面之间的逻辑关系。例如::

    dc={'user':usertablepage,'user.edit':userformpage}
