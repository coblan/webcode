
from django.shortcuts import render,Http404
from tabel import ModelTable
from fields import ModelFields
from django.forms import ModelForm
from db_tools import model_form_save
from port import jsonpost
from django.apps import apps
import re

# used for model render
model_dc={
    #'xxx_model': {'model':'xxx','table_temp':xxx,'field_temp':xxx}
}

def get_url(name):
    pass

class Render(object):
    def __init__(self,request,url,table_temp,fields_temp):
        """
        name/
        name/edit/1
        """
        self.request=request
        self.url=url
        self.table_temp=table_temp
        self.fields_temp=fields_temp
         
    def rout(self):
        browse = re.search('^(\w+)/?$', self.url)
        if browse:
            self.name=browse.group(1)
            self.dc =model_dc.get(self.name)
            return self.browse()
        edit = re.search('^(\w+)/edit/(\w*)/?$',self.url)
        if edit:
            self.name=edit.group(1)
            self.dc =model_dc.get(self.name)  
            self.pk=edit.group(2)
            return self.edit(name=edit.group(1),pk=edit.group(2))
        raise Http404()
        
    def browse(self):
        table_cls = self.dc.get('table',self._get_new_table_cls())
        table = table_cls.parse_request(self.request)
        if hasattr(table,'template'):
            self.table_temp=table.template
        return render(self.request,self.table_temp,table.get_context())        
 
    def edit(self,name,pk):
        if self.request.method=='GET':
            fields_cls = self.dc.get('fields',self._get_new_fields_cls())
            fields = fields_cls(pk=self.pk)
            if hasattr(fields,'template'):
                self.fields_temp=fields.template
            return render(self.request,self.fields_temp,fields.get_context())            
        else:
            dc ={}
            for k,v in Render.__dict__.items():
                if callable(v):
                    dc[k]= getattr(self,k)
            return jsonpost(self.request, dc)  
    

    def _get_new_fields_cls(self):
        class TempFields(ModelFields):
            model=self.dc.get('model')

        return TempFields   
    
    def _get_new_table_cls(self):
        class TempTable(ModelTable):
            model = self.dc.get('model')
        return TempTable    
    
    def save(self,row):
        fields_cls = self.dc.get('fields',self._get_new_fields_cls())
        form = fields_cls().form
        return model_form_save(form,row)



# def rout(request,url,table_temp,fields_temp):
    # """
    # name/
    # name/edit/1
    # """
    # browse = re.search('^(\w+)/?$',url)
    # if browse:
        # return render_table(request,name=browse.group(1),temp=table_temp)
    # edit = re.search('^(\w+)/edit/(\w*)/?$',url)
    # if edit:
        # return render_field(request,name=edit.group(1),pk=edit.group(2),temp=fields_temp)
    # raise Http404()
        



# def render_table(request,name,temp):
    # dc = model_dc.get(name)
    # if not dc:
        # raise Http404()
    # table_cls = dc.get('table',_get_table_cls(dc.get('model')))
    # table = table_cls.parse_request(request)
    # if hasattr(table,'template'):
        # temp=table.template
    # return render(request,temp,table.get_context())

# def _get_table_cls(model_):
    # class TempTable(ModelTable):
        # model = model_
    # return TempTable

# def render_field(request,name,pk,temp):
    # dc = model_dc.get(name)
    # if not dc:
        # raise Http404()
    # fields_cls = dc.get('fields',_get_new_fields_cls(dc.get('model')))
    # fields = fields_cls(pk=pk)
    # if hasattr(fields,'template'):
        # temp=fields.template
    # return render(request,temp,fields.get_context())

# def _get_new_fields_cls(model_):
    # # class TempForm(ModelForm):
        # # class Meta:
            # # model=model_
            # # exclude=[]
    # class TempFields(ModelFields):
        # pass
        # # form=TempForm
    
    # return TempFields
        