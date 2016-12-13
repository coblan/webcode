# encoding:utf-8

from __future__ import unicode_literals
from director.db_tools import model_to_name
from django.apps import apps
import json
from django.db import models
from base import model_dc
permit_list=[]

class Permit(object):
    """
    以json的形式存储于permitModel数据库
    
    [{'model':'app.App',}]
    """
    def __init__(self,model,user):
        self.user=user
        if isinstance(model,(str,unicode)):
            model=apps.get_model(model)
        self.model = model
        self.permit_list=[]
        self._init_perm()
    
    def _init_perm(self):
        model_name = model_to_name(self.model)
        for group in self.user.groups.all():
            if hasattr(group,'permitmodel'):
                permits = json.loads( group.permitmodel.permit )
                permit= permits.get(model_name,[])
                self.permit_list.extend(permit)
        self.permit_list=list(set(self.permit_list))
    
    def get_heads(self):
        ls=[]
        for v in permit_list:
            if not isinstance(v,dict) and issubclass(v,models.Model):
                ls.append({'name':model_to_name(v),
                           'label':v._meta.verbose_name,
                           'type':'model',
                           'fields':model_permit_info(v,self.user)})
        
        for v in permit_list:
            if isinstance(v,dict):
                ls.append(v)
        return ls
    
    def get_rows(self):
        pass
    
    def can_add(self):
        if self.user.is_superuser:
            return True
        else:
            return 'can__create' in self.permit_list

    def can_del(self):
        if self.user.is_superuser:
            return True
        else:
            return 'can__delete' in self.permit_list
    
    def can_access(self):
        if self.user.is_superuser:
            return True
        elif self.readable_fields() or self.changeable_fields():
            return True
        else:
            return False

    def readonly_fields(self):
        if self.user.is_superuser:
            return []
        else:
            return [x for x in self.readable_fields() if x not in self.changeable_fields()]
    
    def all_fields(self):
        ls=[]
        for field in self.model._meta.get_fields():
            if isinstance(field,models.Field):
                ls.append(field.name)   
        return ls
    
    def readable_fields(self):
        if self.user.is_superuser:
            return self.all_fields()
        else:
            ls=[]
            for perm in self.permit_list:
                if perm.endswith('__read'):
                    ls.append(perm[0:-6])
            return list(set(ls))  
    
    def changeable_fields(self):
        if self.user.is_superuser:
            return self.all_fields()
            #return self.model._meta.get_all_field_names()
        else:
            ls = []
            for perm in self.permit_list:
                if perm.endswith('__write'):
                    ls.append(perm[0:-7])
            return list(set(ls))



def model_permit_info(model,user):
    fields = model_dc.get(model).get('fields')
    ls=[]
    for k,v in fields(crt_user=user).fields.items():
        if hasattr(v.label,'title') and callable(v.label.title):
            label=v.label.title()
        else:
            label=v.label
        ls.append({'name':k,'label':label})
    return ls