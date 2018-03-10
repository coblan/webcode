
=========
link
=========
这个东西本来主要是用在 :code:`移动端` 上的。但是现在移动端变化大，所以需要重新整理该模块。

示例
======
::

     var director = '{% url 'director' %}'

     var cache_meta={
     cache:['person.emp_info.row',
     'person.bas_info.row',
     'crt_view'],
     rt_key:{'auth.user':'person.emp_info.row.user'}
     }

    //auth.user 是返回的值在storage中的key，person.emp_info.row.user是还原的对象路径

     ln.cache(cache_meta)

     // 下面是构造跳转的url,其中最重要的是需要appendSearch({cache:1})),表明返回时，需要读取cache
     var back_url=btoa(ex.appendSearch({cache:1}))
     if(pk){
     location=ex.template('{director}model/{name}/edit/{pk}?next={encode_url}',{director:director,name:name,pk:pk,encode_url:back_url})
     }else{
     location=ex.template('{director}model/{name}/edit?next={encode_url}',{director:director,name:name,encode_url:back_url})
     }

readCache
	@root_obj

cache
	@cache_meta
	@root_obj : 如果没写，默认是window


history
========
利用h5的history功能，是的地址栏发生变化，并且不会触发服务器请求。该功能可以用在ajax请求，将ajax请求记录在history中，可以达到前进后退的功能。

pushUrl
    url入栈

popUrlListen:
    监听pop history事件，点击前进后退按钮时，刷新整个页面。如果需要精细的控制，在不刷新页面的情况下，切换状态，需要自定义事件handler
