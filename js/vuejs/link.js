ln={
    /*
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

    */
    readCache:function(){
        if(ex.parseSearch().catch){
            var cache_obj_str=sessionStorage.getItem(btoa(location.pathname))
            sessionStorage.removeItem(btoa(location.pathname))
            if(cache_obj_str){
                cache_obj=JSON.parse(cache_obj_str)
                for(var key in cache_obj.window){
                    ex.set(window,key,cache_obj.window[key])
                }

                var cache_meta=cache_obj.cache_meta
                if(cache_meta && cache_meta.rt_key){
                    for(var key in cache_meta.rt_key){
                        var value = sessionStorage.getItem(key)
                        var targ_key=cache_meta.rt_key[key]
                        sessionStorage.removeItem(key)
                        ex.set(window,targ_key,value)
                    }
                }
            }
        }
    },

    cache:function(cache_meta){

        var cache_obj={
            cache_meta:cache_meta,
            window:{}
        }

        if(cache_meta.cache){
            ex.each(cache_meta.cache,function(key){
                cache_obj.window[key]=ex.access(window,key)
            })
        }
        sessionStorage.setItem(btoa(location.pathname),JSON.stringify(cache_obj))
    }
}


window.ln=ln