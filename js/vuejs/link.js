var ln={
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
    readCache:function(root_obj){
        var root_obj=root_obj||window
        if(ex.parseSearch().cache){
            var cache_obj_str=sessionStorage.getItem(btoa(location.pathname))
            sessionStorage.removeItem(btoa(location.pathname))
            if(cache_obj_str){
                var cache_obj=JSON.parse(cache_obj_str)
                for(var key in cache_obj.window){
                    ex.set(root_obj,key,cache_obj.window[key])
                }

                var cache_meta=cache_obj.cache_meta
                if(cache_meta && cache_meta.rt_key){
                    for(var key in cache_meta.rt_key){
                        var value = sessionStorage.getItem(key)
                        var targ_key=cache_meta.rt_key[key]
                        sessionStorage.removeItem(key)
                        ex.set(root_obj,targ_key,value)
                    }
                }
            }
        }
    },

    cache:function(cache_meta,root_obj){

        var root_obj=root_obj||window
        var cache_obj={
            cache_meta:cache_meta,
            window:{}
        }

        if(cache_meta.cache){
            ex.each(cache_meta.cache,function(key){
                cache_obj.window[key]=ex.access(root_obj,key)
            })
        }
        sessionStorage.setItem(btoa(location.pathname),JSON.stringify(cache_obj))
    },

    openWin:function(url,callback){
        var norm_url = ex.appendSearch(url,{_pop:1})
        window.open(norm_url,url,'height=500,width=800,resizable=yes,scrollbars=yes,top=200,left=300')
        window.__on_subwin_close=callback

    },
    rtWin:function(resp){
        if(window.opener && window.opener.__on_subwin_close){
            window.opener.__on_subwin_close(resp)
        }
        window.opener.__on_subwin_close=null
        window.close()
    }
}


window.ln=ln