# -*- encoding:utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from django.apps import apps
from django import forms
import json


def get_or_none(model, **kw):
    """
    """
    try:
        obj = model.objects.filter(**kw).order_by('-id')[0]
        return obj
    except IndexError:
        return None



def to_dict(instance,filt_attr=None,include=None,exclude=None):
    """
    fields=['name','age'] 虽然中函数中fields是django中的model.field对象，但是这里为了方便，接受外部
                         输入是字段的名字
                         
    filt_attr(instance)是可调用对象，返回一个字典，包含已经处理过的属性。这些属性不会再被to_jd操作。
    
    注意，返回的字典，是可以json化的才行。
    """
    fields=instance._meta.fields
    if include:
        fields=filter(lambda field:field.name in include,fields)
    if exclude:
        fields=filter(lambda field:field.name not in exclude,fields)
    if filt_attr:
        out=filt_attr(instance)
    else:
        out={}
    for field in fields:
        if field.name in out:
            continue
        else:
            if field_map.get(field.__class__):
                out[field.name] = field_map.get(field.__class__)().to_dict(instance,field.name)
            #if isinstance(field,models.ForeignKey):
                #foreign=getattr(instance,field.name)
                #if foreign:
                    #out[field.name]=foreign.pk
                #else:
                    #out[field.name]=None
            #elif isinstance(field,models.DateTimeField):
                #out[field.name]=getattr(instance,field.name).strftime('%Y-%m-%d %H:%M:%S')
            else:
                out[field.name]=field.get_prep_value( getattr(instance,field.name) )
    out['pk']=instance.pk
    out['_class']= instance.__module__.split('.')[0]+'.'+instance.__class__.__name__
    return out




class DatetimeProc(object):
    def to_dict(self,inst,name):
        value = getattr(inst,name)
        if value:
            return value.strftime('%Y-%m-%d %H:%M:%S')
        else:
            return ''
        
class ForeignProc(object):
    def to_dict(self,inst,name):
        foreign=getattr(inst,name)
        if foreign:
            return foreign.pk

    

def from_dict(dc,model=None,pre_proc=None):
    """

    1. 半自动：
    processed_attr=pre_proc(dc,model) ; 返回处理过的字典processed，该processed用于剔除传入的dc参数
    
    """
    processed={}
    if model is None and '_class' in dc:
        model=apps.get_model(dc['_class'])
    if not model:
        raise UserWarning,'when constuct model object, but no model set'
    if pre_proc:
        processed=pre_proc(dc,model)
    for k in processed:
        dc.pop(k)         # 去除被pre_proc处理过的值， (因为处理过的值，不应再被 _convert_foreign处理)
    _convert_foreign(dc,model)
    dc.update(processed)   # 把pre_proc的值合并回去 ，(因为下面要给 instance赋值)
    pk=dc.get('pk')
    if pk:
        instance=model.objects.get(pk=pk) 
        for k,v in dc.items():
            setattr(instance,k,v)       
        return instance            
    else:
        instance=model.objects.create(**dc)
        return instance
    
def _convert_foreign(dc,model):
    fields=model._meta.fields
    for field in fields:
        if field.name in dc and isinstance(field,models.ForeignKey)\
           and not isinstance(dc[field.name],field.rel.to):
            dc[field.name]=_deserilize_foreignkey(field, dc[field.name])    

def _deserilize_foreignkey(field,pk):
    if pk is not None:
        model=field.rel.to
        return model.objects.get(pk=pk)
    else:
        return None

def _field_name_to_filed(fields,instance):
    out = []
    for name in fields:
        for field in instance._meta.fields:
            if field.name==name:
                out.append(field)
                break  
    return out
                

def form_to_head(form):
    out = []
    for k,v in form.fields.items():
        dc = {'name':k,'label':unicode(v.label),'required':v.required,}
        if v.__class__==forms.fields.CharField:
            if v.max_length:
                dc.update({'type':'text','maxlength':v.max_length})
            else:
                dc.update({'type':'area'})
        else:
            dc.update({'type':'text'})
        out.append(dc)
    return out
    
def model_form_save(form,models,success=None,**kw):
    model_dict= models # kw.pop('models')
    model_dict.update(kw)
    iform = form(model_dict)

    if iform.is_valid():
        model = form.Meta.model
        obj = from_dict(iform.cleaned_data,model)
        if success:
            return success(obj)
        else:
            return {'status':'success'}
    else:
        return {'errors':iform.errors}


def save_model(models,scope):
    if '_form' in models:
        form = scope.get(models.get('_form'))
    else:
        model=apps.get_model(models['_class'])
        for k,v in scope.items():
            if isinstance(v,forms.ModelForm):
                if v.Meta.model==model:
                    form = v
                    break
    return model_form_save(form,models)
                


field_map={
    models.DateTimeField:DatetimeProc,
    models.ForeignKey : ForeignProc
}