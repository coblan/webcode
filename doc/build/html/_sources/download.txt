==============
下载
==============
在app/ajax.py文件中，直接响应下载请求。

前端代码请求download通用地址
::

    export_data:function(){
                    var items_str=""
                    ex.each(this.selected,function(pk){
                        items_str+= pk+'-'
                    })
                    var op_str='download_group_permit:items:'+items_str
                    location='/_download/director'+'?_op='+op_str
                },

.. Note:: 注意使用的是GET方法，因为POST触发浏览器下载，有点不地道。


后端代码，使用downloadfy_response函数，触发浏览器下载。这个函数写在app/ajax.py文件里面

::

    from helpers.common.download_response import downloadfy_response

    def download_func():
        str_list=[...]
        return downloadfy_response(json.dumps(str_list), 'permits.json')