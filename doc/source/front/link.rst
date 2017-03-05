
=========
link
=========

::

 var director = '{% url 'director' %}'

 var cache_meta={
 cache:['person.emp_info.row',
 'person.bas_info.row',
 'crt_view'],
 rt_key:{'auth.user':'person.emp_info.row.user'}
 }

 ln.cache(cache_meta)
 var back_url=btoa(ex.appendSearch({cache:1}))
 if(pk){
 location=ex.template('{director}model/{name}/edit/{pk}?next={encode_url}',{director:director,name:name,pk:pk,encode_url:back_url})
 }else{
 location=ex.template('{director}model/{name}/edit?next={encode_url}',{director:director,name:name,encode_url:back_url})
 }
