
=========
link
=========
示例::

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
