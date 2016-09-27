from django import forms
from db_tools import form_to_head,to_dict,get_or_none,delete_related_query
from django.http import Http404
import json
from django.db import models

class ModelFields(object):
    """
    Only @model is must
    """
    # form = 'XXX'
    model = ''
    fields=[]
    #exclude=[]
    def __init__(self,pk=''):
        if not getattr(self,'form',None):
            class TempForm(forms.ModelForm):
                class Meta:
                    model=self.model
                    fields=self.fields
                    #exclude=self.exclude
            self.form = TempForm
        self.pk=pk
            
    def get_context(self):
        return {
            'heads':json.dumps(self.get_heads()),
            'row': json.dumps(self.get_row()),
        }  
    
    def get_heads(self):
        heads = form_to_head( self.form())
        for k,v in self.get_options().items():
            for head in heads:
                if head['name']==k:
                    head['options']=v
        for k,v in self.get_input_type().items():
            for head in heads:
                if head['name']==k:
                    head['type']=v
        return heads
    
    def get_row(self):
        if self.pk:
            inst = get_or_none( self.model,pk=self.pk)
            if inst:
                return to_dict(inst)
            else:
                raise Http404('Id that you request is not exist in database')
        else:
            return to_dict(self.model())
    
    def get_options(self):
        options={}
        
        for f in self.fields:
            field = self.model._meta.get_field(f)
            if isinstance(field,models.OneToOneField):
                options[f]=[{'pk':x.pk,'label':str(x)} for x in field.related_model.objects.all()]
        
        return options
    
    def get_input_type(self):
        types={}
        for f in self.fields:
            field = self.model._meta.get_field(f)
            if isinstance(field,models.OneToOneField):
                types[f]='sim_select'  
            
        return types
    

        