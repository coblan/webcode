# encoding:utf-8
from __future__ import unicode_literals
from django import forms
from director.db_tools import form_to_head,to_dict,get_or_none,delete_related_query,model_to_name,from_dict,name_to_model
from django.http import Http404
import json
from django.db import models
from django.core.exceptions import PermissionDenied
from django.core.urlresolvers import reverse

import base64
from permit import Permit
from director.models import LogModel

class ModelFields(forms.ModelForm):
    """
    __init__函数，参数组合
    1. pk,crt_user 编辑，读取的时候
    2. instance,crt_user 编辑，读取的时候
    3. dc,crt_user 保存修改的时候
    4. crt_user 新建的时候
    
    """

    def __init__(self,dc={},pk=None,crt_user=None,*args,**kw):
        
        if not crt_user:
            self.crt_user=dc.get('crt_user')
        else:
            self.crt_user = crt_user
        
        if pk is None:
            pk=dc.get('pk')
        if 'instance' not in kw:
            if pk:
                kw['instance']= get_or_none( self._meta.model,pk=pk)
                if not kw['instance']:
                    raise Http404('Id that you request is not exist in database')
                
            else:
                kw['instance'] = self._meta.model()

        super(ModelFields,self).__init__(dc,*args,**kw)
        self.permit= Permit(self.instance._meta.model,self.crt_user)
        self.pop_fields()
        self.init_value()
        
    def get_context(self):
        """
        """
        return {
            'heads':self.get_heads(),
            'row': self.get_row(),
        }  
    def get_del_info(self):
        return {unicode(self.instance):delete_related_query(self.instance)}
    
    def pop_fields(self):
        """
        pop some field out,this will be 
        """
        if self.crt_user.is_superuser:
            return
        ls=[]
        ls.extend(self.permit.readable_fields())
        ls.extend(self.permit.changeable_fields())
        for key in dict(self.fields).keys():
            if key not in ls:
                self.fields.pop(key)
                
    
    def init_value(self):
        if self.instance.pk:
            for f in self.instance._meta.get_all_field_names():
                if f in self.fields:
                    value = getattr(self.instance,f)
                    if hasattr(value,'all'):
                        value=value.all()
                    self.fields[f].initial= value
    
    def get_heads(self):
        heads = form_to_head(self)
        for k,v in self.get_options().items():
            for head in heads:
                if head['name']==k:
                    head['options']=v
        for k,v in self.get_input_type().items():
            for head in heads:
                if head['name']==k:
                    head['type']=v
        for name in self.get_readonly_fields():
            for head in heads:
                if head['name']==name:
                    head['readonly']=True 

        return heads
    
    def can_access(self):
        """
        used to judge if self.crt_user has right to access self.instance
        """
        if not self.instance.pk:
            if self.permit.can_add():
                return True
            else:
                return False
        else:
            return self.permit.can_access()
        # perm = self.instance._meta.app_label+'.change_'+self.instance._meta.model_name
        # return self.crt_user.has_perm(perm)
    
    
    def get_readonly_fields(self):
        return self.permit.readonly_fields()
        # return []
    
    def get_row(self):
        """
        convert self.instance to dict.
        Note:Only convert Meta.fields ,not All fields
        """
        if not self.can_access():
            raise PermissionDenied,'you have no Permission access %s'%self.instance._meta.model_name
        
        include = [x for x in self._meta.fields if x in self.fields]
        return to_dict(self.instance,include=include)

    def get_options(self):
        options={}
        
        for name,field in self.fields.items():
            if isinstance(field,forms.models.ModelMultipleChoiceField):
                options[name]=[{'value':x[0],'label':x[1]} for x in field.choices]            
            elif isinstance(field,forms.models.ModelChoiceField):
                options[name]=[{'value':x[0],'label':x[1]} for x in list(field.choices)[1:]]
            
        return options
    
    def get_input_type(self):
        types={}
        return types
    
    def save_form(self):
        """
        call by model render engin
        """
        if not self.crt_user.is_superuser:
            if self.instance.pk:
                if not self.permit.changeable_fields():
                    raise PermissionDenied,'you have no Permission changed %s'%self.instance._meta.model_name 
            else:
                if not self.can_access():
                    raise PermissionDenied,'you have no Permission access %s'%self.instance._meta.model_name  
            # table_perm = self.instance._meta.app_label+'.%s_'%op+self.instance._meta.model_name
            # if not self.crt_user.has_perm(table_perm):
                # raise PermissionDenied,'you have no Permission access %s'%self.instance._meta.model_name 
            # if not self.can_access_instance():
                # raise PermissionDenied,'you have no Permission access %s'%self.instance._meta.model_name  
            
            model_str= unicode(self.instance)
            for data in self.changed_data:
                if data in self.get_readonly_fields():
                    self.cleaned_data.pop(data)
                    print("Can't change {data} of {model},I pop it".format(data=data,model=model_str))
                    #raise PermissionDenied,"Can't change {data}".format(data=data)
        
        op=None
        if self.changed_data:
            op='change'
            detail=','.join(self.changed_data)
            
        if self.instance.pk is None:
            op='add'
            detail=''
            self.instance.save() # if instance is a new row , need save first then manytomany_relationship can create   
            
        for k,v in self.cleaned_data.items():
            setattr(self.instance,k,v)
        self.instance.save()
        
        if op:
            log =LogModel(key='{model_label}.{pk}'.format(model_label=model_to_name(self.instance),pk=self.instance.pk),kind=op,user=self.crt_user,detail=detail)
            log.save()
        return {'status':'success','pk':self.instance.pk,'_class':model_to_name(self.instance)}
    
    def del_form(self):
        if self.permit.can_del():
            self.instance.detete()
        else:
            raise PermissionDenied('No permission to delete %s'%str(self.instance))
        # del_perm = self.instance._meta.app_label+'.del_'+self.instance._meta.model_name
        # if self.crt_user.has_perm(del_perm):
            # self.instance.delete()

    
    

class FieldsSet(object):
    template=''
    def __init__(self,pk=None,crt_user=None):
        self.pk=pk
        self.crt_user=crt_user
    
    def get_context(self):
        return {}
        


        