# encoding:utf-8
from django.shortcuts import render,Http404
#from tabel import ModelTable
#from fields import ModelFields
from django.forms import ModelForm
from core.db_tools import model_form_save,from_dict,delete_related_query,to_dict
from core.port import jsonpost
import json
from django.apps import apps
import re
import base64
import inspect
from director.container import evalue_container
from director.port import jsonpost
import ajax
from django.contrib.auth.decorators import login_required

from base import model_dc,render_dc,model_page_dc

@login_required
def table_view(request,name):
    page_cls = model_page_dc.get(name).get('table')
    if request.method=='GET':
        page=page_cls(request)
        return render(request,page.template,context=page.get_context())
    elif request.is_ajax():
        ajax_scope={}
        ajax_scope.update(ajax.get_globle())
        ajax_scope.update(page_cls.ajax_scope)
        return jsonpost(request, ajax_scope)

@login_required
def form_view(request,name,pk=None):
    page_cls = model_page_dc.get(name).get('form')
    if request.method=='GET':
        page=page_cls(request,pk)
        return render(request,page.template,context=page.get_context())
    elif request.is_ajax():
        ajax_scope={}
        ajax_scope.update(ajax.get_globle())
        ajax_scope.update(page_cls.ajax_scope)        
        return jsonpost(request, ajax_scope)
        
@login_required
def del_rows(request):
    """
    rows = base64([{pk:1,_class:app.model}])
    """
    page_cls = render_dc.get('del_rows') 
    if request.method=='GET':
        page = page_cls(request) 
        return render(request,page.template,context=page.get_context())
    elif request.is_ajax():
        ajax_scope={}
        ajax_scope.update(ajax.get_globle())
        ajax_scope.update(page_cls.ajax_scope)
        return jsonpost(request,ajax_scope)


class TablePage(object):
    template='table.html'
    tableCls=''
    ajax_scope={}
    def __init__(self,request):
        self.request=request
        self.table = self.tableCls.parse_request(request)
       
    def get_context(self):
        ctx = self.table.get_context()
        pop = self.request.GET.get('_pop')
        if not pop:
            ctx['menu']=evalue_container(render_dc.get('menu'),user=self.request.user)        

        return ctx

class FormPage(object):
    template='fields.html'
    fieldsCls=''
    ajax_scope={}
    def __init__(self,request,pk):
        self.request=request
        self.pk=pk
        self.fields = self.fieldsCls(pk=self.pk,crt_user=request.user)
        
    def get_context(self):
        ctx = self.fields.get_context()
        pop = self.request.GET.get('_pop')
        if not pop:
            ctx['menu']=evalue_container(render_dc.get('menu'),user=self.request.user)  
        return ctx

class DelPage(object):
    template='del_rows.html'
    ajax_scope={}
    def __init__(self,request):
        self.request=request
    
    def get_context(self):
        ctx = {}
        pop = self.request.GET.get('_pop')
        if not pop:
            ctx['menu']=evalue_container(render_dc.get('menu',{}),user=self.request.user) 
            
        ls_str = self.request.GET.get('rows')
        rows = json.loads(base64.b64decode(ls_str))
        
        infos = {}
        for row in rows:
            model = apps.get_model(row['_class'])
            model_util= model_dc.get(model)
            fields_cls = model_util.get('fields') #,self._get_new_fields_cls())
            
            dc={'pk':row['pk'],'crt_user':self.request.user}
            fields_obj= fields_cls(**dc)
            infos.update(fields_obj.get_del_info())
            
        ctx['infos']=infos
        ctx['rows']=rows       
        return ctx        

render_dc['del_rows']=DelPage


class Render(object):
    def __init__(self,request,url,table_temp,fields_temp,del_rows_temp,menu):
        """
        url:
        -----
        name/
        name/edit/1
        
        @name: rigist name of model.
        """
        self.request=request
        self.url=url
        self.table_temp=table_temp
        self.fields_temp=fields_temp
        self.del_rows_temp=del_rows_temp
        self.menu=menu
        self.crt_user = self.request.user
        
        self.model_item={}
         
    def rout(self):
        if self.request.method=='POST':
            function_scope ={}
            function_scope=ajax.get_globle()
            #for k,v in inspect.getmembers(self):
                #if inspect.ismethod(v):
                    #function_scope[k]= v 
            
            admin_name=''
            if re.search('^(\w+)/edit/(\w*)/?$',self.url):
                edit = re.search('^(\w+)/edit/(\w*)/?$',self.url)
                dc={'pk':edit.group(2),'crt_user':self.request.user}
                admin_name=edit.group(1)
            elif re.search('^(\w+)/edit/?$',self.url):
                edit = re.search('^(\w+)/edit/?$',self.url)
                admin_name=edit.group(1)
                dc={'crt_user':self.request.user}
            
            if admin_name:
                model_item =model_page_dc.get(admin_name)                  
                ajax_scope= model_item.get('ajax',{})
                function_scope.update(ajax_scope)
                
            return jsonpost(self.request, function_scope)   
        else:
            temp = None
            context = None
            del_rows = re.search('^del_rows/?$',self.url)
            if del_rows:
                temp,context = self.del_rows_page()
            elif re.search('^(\w+)/?$', self.url):
                browse = re.search('^(\w+)/?$', self.url)
                self.name=browse.group(1)
                self.model_item =model_page_dc.get(self.name)
                temp,context = self.browse()
            elif re.search('^(\w+)/edit/?$',self.url):
                edit = re.search('^(\w+)/edit/?$',self.url)
                self.name=edit.group(1)
                self.model_item =model_page_dc.get(self.name)  
                temp, context = self.edit(name=edit.group(1),pk=None)            
            elif re.search('^(\w+)/edit/(\w*)/?$',self.url):
                edit = re.search('^(\w+)/edit/(\w*)/?$',self.url)
                self.name=edit.group(1)
                self.model_item =model_page_dc.get(self.name)  
                temp, context = self.edit(name=edit.group(1),pk=edit.group(2))
                
            if temp is None:
                raise Http404()
            elif context is None:
                raise UserWarning,'constructed context is None,this may be an bug'
            else:
                context['menu']= self.get_menu()
                context.update(self.extra_context())
                return render(self.request,temp,context=context) 
    
    def browse(self):
        table_cls = self.model_item.get('table') #,self._get_new_table_cls())
        table = table_cls.parse_request(self.request)
        if hasattr(table,'template'):
            self.table_temp = table.template

        return self.table_temp, table.get_context(self.request.user)
        
        #return render(self.request,self.table_temp,table.get_context())        
 
    def edit(self,name,pk):
        if self.request.method=='GET':
            fields_cls = self.model_item.get('fields') #,self._get_new_fields_cls())
            dc={'pk':pk,'crt_user':self.request.user}
            fields = fields_cls(**dc)
            if hasattr(fields,'template') and fields.template:
                self.fields_temp=fields.template
           
            return self.fields_temp,fields.get_context()       

    def del_rows_page(self):
        """
        rows = base64([{pk:1,_class:app.model}])
        """
        ls_str = self.request.GET.get('rows')
        rows = json.loads(base64.b64decode(ls_str))
        
        infos = {}
        for row in rows:
            model = apps.get_model(row['_class'])
            admin_name = get_admin_name_by_model(model)
            model_item = model_page_dc.get(admin_name)
            fields_cls = model_item.get('fields') #,self._get_new_fields_cls())
            
            dc={'pk':row['pk'],'crt_user':self.request.user}
            fields_obj= fields_cls(**dc)
            infos.update(fields_obj.get_del_info())
            
        return self.del_rows_temp,{'infos':infos,'rows':rows}

    
    def get_menu(self):
        pop = self.request.GET.get('_pop')
        if not pop:
            # return self._evalue_menu_dict(self.menu)
            return evalue_container(self.menu,user=self.crt_user)
        else:
            return {}
    
    # def _evalue_menu_dict(self,menu):
        # temp_menu=[]
        # for act in menu:
            # temp_act ={}
            # for k,v in act.items():
                # if callable(v):
                    # temp_act[k]=v(self.request.user)
                # elif isinstance(v,(list,tuple)):
                    # temp_act[k]=self._evalue_menu_dict(v)
                # else:
                    # temp_act[k]=v
            # if not 'valid' in temp_act or temp_act['valid']: # only valid ,this menu will be display
                # temp_menu.append(temp_act)
        # return temp_menu
                    
    
    def extra_context(self):
        return {}
    
    #def _get_new_fields_cls(self,_model=None):
        #class TempFields(ModelFields):
            #model=_model if _model else self.model_item.get('model')

        #return TempFields   
    
    #def _get_new_table_cls(self):
        #class TempTable(ModelTable):
            #model = self.model_item.get('model')
        #return TempTable    

#--------------frontend call-----------------------------------------    
    def save(self,row,user):
        """
        暂时不用这个函数。
        """
        # edit = re.search('^(\w+)/edit/(\w*)/?$',self.url)
        model= apps.get_model(row['_class'])
        admin_name = get_admin_name_by_model(model)
        if not admin_name:
            edit = re.search('^(\w+)/edit/',self.url)
            admin_name= edit.group(1)
            
        self.model_item = model_page_dc.get(admin_name) 
        fields_cls = self.model_item.get('fields') 
        row['crt_user']=user
        fields_obj=fields_cls(row,crt_user=user)
        if fields_obj.is_valid():
            return fields_obj.save_form()
        else:
            return {'errors':fields_obj.errors}
        # return model_form_save(fields_cls,row)
        

    
    def get_del_info(self,rows):
        out = {}
        for row in rows:
            inst=from_dict(row)
            out[str(inst)]=delete_related_query(inst)
        return out
    
    def get_rows_info(self,rows):
        for row in rows:
            pk=row['pk']
            model = apps.get_model(row['_class'])
            row['label']=unicode(model.objects.get(pk=pk))
        return rows
            
    
    def fields_info(self,pk=None,model=None,name=None):
        """
        从前端直接读取fields的 heads rows 属性
        [pk]
        model and name 选择一个参数即可
        """
        if model:
            admin_name = get_admin_name_by_model(model)
            fields= model_page_dc.get(admin_name).get('fields')
        elif name:
            fields = model_page_dc.get(name).get('fields')
        return fields(pk=pk,crt_user=self.crt_user).get_context()
    





    
