# -*- encoding:utf-8 -*-

import json
import inspect
from django.http import HttpResponse
from django.contrib.auth.models import User

def jsonpost(request, scope):
    """
    该函数会路由ajax请求，ajax发送的json格式为{'order':['func3','func2'],func1:{name:'heyulin'},func2:{arg:..},func3:{arg:}}
    jsonpost根据参数scope里面查询同名函数，按照循序，优先调用order中的函数
    
    example:
    
    下面是一个现成的views函数
    
def ajax_view(request):
    if request.method=='POST':
        try:
            return jsonpost(request, get_globlas())
        except KeyError as e:
            rt={'status':'error','msg':'key error '+str(e) +' \n may function name error'}
            return HttpResponse(json.dumps(rt),content_type="application/json")
            
    """
    cmddc = json.loads(request.body)
    outdc = {}
    msgs=[]
    orderls = cmddc.pop('order', None)
    if orderls:
        for k in orderls:
            try:
                func = scope[k]
                kw=cmddc.pop(k)                
                outdc[k]=_run_func(func, request,**kw)
            except (UserWarning,TypeError) as e:
                msgs.append(str(e))
            except KeyError as e:
                msgs.append('no function %s'%k)            

    for k, kw in cmddc.items():
        try:
            func = scope[k]
            outdc[k]=_run_func(func, request,**kw)
        except (UserWarning,TypeError) as e:
            msgs.append(str(e))
        except KeyError as e:
            msgs.append('no function %s'%k)
    
    outdc['msg']=';'.join(msgs)
    return HttpResponse(json.dumps(outdc), content_type="application/json")


def _run_func(func,request,**kw):
    args=inspect.getargspec(func).args
    if 'request' in args:
        kw['request']=request
    if 'user' in args:
        user=_get_user(request)
        if user:
            kw['user']=user
        else:
            raise UserWarning,'function need user ,but canot get user from request'
            
    return func(**kw)

def _get_user(request):
    if request.user.is_authenticated():
        return request.user
    else:
        return None

      
