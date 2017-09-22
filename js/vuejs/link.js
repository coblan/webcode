/*
>->front/link.rst>
=========
link
=========

利用SessionStorage跳转页面
===========================
基本思想：将对象保存在sessionStorage中，切换到其他页面，当完成选择等任务后，再利用history.back()切换回原来的页面。这时将保存的信息恢复回来。
::

    // origin.html页面
    // 以window为访问root，将对象的path保存下来。
    var save_list=['row']
    url=ex.template('{engine_url}/home.wx',{engine_url:engine_url,})
    ln.getFromTab(url,save_list)

    //在页面的初始阶段调用:
    ln.readCache()  // 读取对应自身url的cache，如果有cache则恢复对应window属性。
                   // 在页面加载后2秒，自动删除 cache 和_rt　值

    // select.html页面
    // 判断是否是 _pop=1，返回row对象。
    ln.rt(row)  // 该函数是将结果存在sessionStorage中，以key=_rt存储。


以前的SessionStorage
=========================
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


history
========
利用h5的history功能，是的地址栏发生变化，并且不会触发服务器请求。该功能可以用在ajax请求，将ajax请求记录在history中，可以达到前进后退的功能。

pushUrl
    url入栈

popUrlListen:
    监听pop history事件，点击前进后退按钮时，刷新整个页面。如果需要精细的控制，在不刷新页面的情况下，切换状态，需要自定义事件handler

<-<
 */

require('./css/link.scss')


var ln={
    history_handle:function(obj){
        this._his_handler=obj.handler
        window.addEventListener('popstate', function(e){
            if(e.state){
                obj.handler(e.state)

            }else{
                history.back()
            }
        },false)

        if(obj.init){// && !history.state){
            if(!history.state){
                history.pushState(obj.init,'')
            }
            //else{
            //    history.replaceState(obj.init,'')
            //}

        }

    },
    pushState:function(state,url){
        url=url || ''
        history.pushState(state,'',url)
        this._his_handler(state)
    },

    getFromTab:function(url,cache_name_list,rt_obj_path){

        cache_name_list =cache_name_list || []
        var cache_obj={
            _scroll:{x:scrollX,y:scrollY},
            name_list:cache_name_list,
            obj_list:[],
            rt_obj_path:rt_obj_path,
        }
        ex.each(cache_name_list,function(name){
            cache_obj.obj_list.push(ex.access(window,name))
        })

        sessionStorage.setItem('_stack_'+location.href,JSON.stringify(cache_obj))
        location=ex.appendSearch(url,{_pop:1})

    },
    ret:function(value){
        if(window.opener){
            this._ret_win(value)
        }else{
            this._ret_frame(value)
        }
    },
    _ret_frame:function(value){
        // 在iframe中运行
        //var search_args=ex.parseSearch()
        if(search_args._pop){
            if(window.parent.__fram_back){
                window.parent.__fram_back(value)
            }

            //if(search_args._frame){
            //    if(parent.__fram_back){
            //        parent.__fram_back(value)
            //    }
            //}else if(window.opener){
            //    this.rtWin(value)
            //}else{
            //    sessionStorage.setItem('_rt',JSON.stringify(value))
            //    history.back()
            //}
            //return  true
        }

        //else{
        //    return false
        //}
    },


    readCache:function(){
            var cache_obj_str=sessionStorage.getItem('_stack_'+location.href)

            if(cache_obj_str){
                var cache_obj=JSON.parse(cache_obj_str)

                var name_list=cache_obj.name_list
                var obj_list=cache_obj.obj_list
                for(var i=0;i<name_list.length;i++){
                    ex.set(window,name_list[i],obj_list[i])
                }

                // 将返回值赋予对应的window对象
                var rt_value = sessionStorage.getItem('_rt')

                if(rt_value){
                    if(cache_obj.rt_obj_path){
                        ex.set(window,cache_obj.rt_obj_path,JSON.parse(rt_value))
                    }
                }

                //var cache_meta=cache_obj.cache_meta
                //if(cache_meta && cache_meta.rt_key){
                //    for(var key in cache_meta.rt_key){
                //        var value = sessionStorage.getItem(key)
                //        if(value){
                //            var targ_key=cache_meta.rt_key[key]
                //            sessionStorage.removeItem(key)
                //            ex.set(root_obj,targ_key,value)
                //        }
                //
                //    }
                //}

                // 尝试滚动到原来的位置
                if(cache_obj._scroll){
                    $(function(){
                        setTimeout(function(){
                            window.scrollTo(cache_obj._scroll.x,cache_obj._scroll.y)
                        },10)
                    })
                }
                //onload=function(){
                //    setTimeout(function(){
                //        console.log(cache_obj._scroll.y)
                //        window.scrollTo(cache_obj._scroll.x,cache_obj._scroll.y)
                //    },10)
                //}
                //$(function(){
                    //setTimeout(function(){
                    //    console.log(cache_obj._scroll.y)
                    //    window.scrollTo(cache_obj._scroll.x,cache_obj._scroll.y)
                    //},3000)

                //})

                $(function(){
                    setTimeout(function(){
                        sessionStorage.removeItem('_stack_'+location.href)
                        sessionStorage.removeItem('_rt')
                    },2000)

                })

            }
        //}
    },

    cache:function(cache_meta,root_obj){

        var root_obj=root_obj||window
        var cache_obj={
            cache_meta:cache_meta,
            window:{},
            _scroll:{x:scrollX,y:scrollY}
        }

        if(cache_meta.cache){
            ex.each(cache_meta.cache,function(key){
                cache_obj.window[key]=ex.access(root_obj,key)
            })
        }
        sessionStorage.setItem(location.href,JSON.stringify(cache_obj))
    },

    openWin:function(url,callback){
        /*

        * */
        var norm_url = ex.appendSearch(url,{_pop:1})
        window.open(norm_url,url,'height=500,width=800,resizable=yes,scrollbars=yes,top=200,left=300')
        window.__on_subwin_close=callback

    },
    _ret_win:function(resp){
        if(window.opener && window.opener.__on_subwin_close){
            window.opener.__on_subwin_close(resp)
        }
        window.opener.__on_subwin_close=null
        window.close()
    },
    pushUrl:function(url){
        window.history.pushState(url,0,url);
    },
    popUrlListen:function(){
        window.addEventListener('popstate', function(e) {
/// <summary>
///　　　&#10;　在页面初始化加载完成中添加该事件，则可以监听到onpopstate事件，而浏览器进行前进、后退、刷新操作都会触发本事件
///　　　&#10;　linkFly原创，引用请注明出处，谢谢
/// </summary>/// <returns type="void" />
            if (e.state) {
                location= e.state
                //e.state就是pushState中保存的Data，我们只需要将相应的数据读取下来即可
            }
        })
    },
    openFrame:function(url,callback,css){
        var self=this
        if(!window.__load_frame){
            $('body').append(`<div id="_load_frame_wrap">
            <div class="imiddle popframe">
                <span class="close-btn" onclick="ln.closeFrame()"><i class="fa fa-times fa-2x" aria-hidden="true"></i></span>
                <iframe id="_load_frame" frameborder="0" width="100%" height="100%"></iframe>
            </div>
            </div>`)
            window.__load_frame=true
        }
        var url=ex.appendSearch(url,{_pop:1,_frame:1})
        $('#_load_frame').attr('src',url)
        if(!callback){
            window.__fram_back=null
        }else{
            window.__fram_back=function (v) {
                callback(v)
                self.closeFrame()
            }
        }

        if(css){
            $('.popframe').css(css)
        }
        $('#_load_frame_wrap').show()
    },
    closeFrame:function(){
        $('#_load_frame').attr('src','')
        $('#_load_frame_wrap').hide()
    }


}


window.ln=ln