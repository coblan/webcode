/*
* 直接将后端操作对象暴露到前端
*
*
* bk_manager=new BackOps(myurl)
* bk_manager.call_some_method(function(resp){
*       do_something
*   }
* )
* */

export class BackOps{
    constructor(url){
        this.url=url
        this.init_methods()
    }
    init_methods(){
        var url=ex.appendSearch(this.url,{get_class:1})
        var self=this
        ex.get(url,function(resp){
            for(var k in resp){
                var name=resp[k]
                if (typeof(name)=="string"){
                    (function(name){
                        self[name]=(kw,callback)=>{
                            if(typeof (kw)=='function'){
                                callback=kw
                                kw=null
                            }
                            self.rout_methods(name,kw,callback)
                        }
                    })(name)
                }

            }
        })
    }
    rout_methods(name,kw,callback){
        var args={fun:name}
        if(kw){
            ex.assign(args,kw)
        }
        ex.post(this.url,JSON.stringify([args]),function(resp){
            callback(resp[name])
        })
    }
}

export function back_ops(url){
    var proc=function(kw_list,callback){
        ex.post(url,JSON.stringify(kw_list),function(resp){
            if(callback){
                callback(resp)
            }
        })
    }
    return proc
}