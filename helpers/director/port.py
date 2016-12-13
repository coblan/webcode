# -*- encoding:utf-8 -*-

import json
import inspect
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.conf import settings
from django.core.exceptions import PermissionDenied

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
    router=RouterAjax(request, scope,rt_except= True)#not settings.DEBUG)
    return router.run()

class RouterAjax(object):
    def __init__(self,request,scope,rt_except=False):
        self.request=request
        self.scope=scope
        self.rt_except=rt_except
        self.rt={}
        self.msgs=[]
        
    def run(self):
        self.commands = json.loads(self.request.body)
        if isinstance(self.commands,list):
            return self.run_list()
        else:
            return self.run_dict()
    
    def run_list(self):
        """
        json format :
        
        [{fun:'name',k1:'v1',k2:'v2'},
        {fun:'name',value:'last_fun',kk1:'vv1'}]
        
        """
        for func_dic in self.commands:
            fun_name= func_dic.pop('fun')
            _rt_key=func_dic.pop('_rt_key',fun_name)                
            if self.rt_except:       
                try:
                    func = self.scope[fun_name]
                    self.rt[_rt_key] = self.inject_and_run(func,**func_dic)
                except (UserWarning,TypeError,KeyError,PermissionDenied) as e:
                    self.msgs.append(repr(e))
            else:
                fun_name= func_dic.pop('fun')
                func = self.scope[fun_name]
                self.rt[_rt_key] = self.inject_and_run(func,**func_dic)                
        self.rt['msg']=';'.join(self.msgs)
        return HttpResponse(json.dumps(self.rt), content_type="application/json")            
            
    def run_dict(self):
        """beacuse dict has no order, Call order is a little tedius,
        so use run_list replace this function"""
        
        self.orders=self.commands.pop('order',[])
        if self.rt_except:
            try:
                self.proc_order()
                self.proc_no_order()
            except (UserWarning,TypeError,KeyError) as e:
                self.msgs.append(repr(e))
        else:
            self.proc_order()
            self.proc_no_order()
        self.rt['msg']=';'.join(self.msgs)
        return HttpResponse(json.dumps(self.rt), content_type="application/json")     

    def proc_order(self):
        for k in self.orders:
            func = self.scope[k]
            kw=self.commands.pop(k)                
            self.rt[k]=self.inject_and_run(func,**kw)
            
    def proc_no_order(self):
        for k, kw in self.commands.items():
            func = self.scope[k]
            self.rt[k]=self.inject_and_run(func,**kw) 
    
    def inject_and_run(self,func,**kw):
        """Inject user , request"""
        args=inspect.getargspec(func).args
        if 'request' in args:
            kw['request']=self.request
        if 'user' in args:
            user=self._get_user()
            if user:
                kw['user']=user
            else:
                raise UserWarning,'function need login ,but you are not login'
                
        return func(**kw)    
    
    def _get_user(self):
        if self.request.user.is_authenticated():
            return self.request.user
        else:
            return None    
                

