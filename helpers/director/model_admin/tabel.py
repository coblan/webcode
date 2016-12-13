# encoding:utf-8

from __future__ import unicode_literals

#from core.db_tools import to_dict,model_to_head,model_stringfy
import json
from django.db.models import Q
from django.core.exceptions import PermissionDenied
from permit import Permit
from director.db_tools import model_to_name,to_dict,model_to_head,model_to_name
#from forms import MobilePageForm


from django.core.paginator import Paginator


class PageNum(object):
    perPage=30
    def __init__(self,pageNumber=1,kw={}):
        self.pageNumber = int(pageNumber)
    
    def get_query(self,query):
        self.pagenator = Paginator(query,self.perPage)
        self.query = query        
        return self.pagenator.page(self.pageNumber)
    
    def get_context(self):
        """
        rt: {'options':[1,2,3,4,...,100],
             'crt_page':2
            }
        """
        choice_len = len(self.pagenator.page_range)
        k=3
        a=-1
        while a < 1:
            a=self.pageNumber-k
            k-=1
        page_nums = range(a,min(choice_len,self.pageNumber+(5-k))+1)
        if page_nums[0] != 1:
            page_nums=[1,'...']+ page_nums
        if page_nums[-1] != choice_len:
            page_nums = page_nums +['...',choice_len]
        for i in range(len(page_nums)):
            num = page_nums[i]
        page_nums=[str(x) for x in page_nums]
        return {'options':page_nums,'crt_page':self.pageNumber}    
    
class RowSearch(object):
    names=[]
    model=''
    def __init__(self,q,user,allowed_names,kw={}):
        self.valid_name=[x for x in self.names if x in allowed_names]
        self.crt_user=user
        self._names=[x for x in self.names if x in allowed_names]        
        self.q=q
        #for k in self.names:
            #v = dc.pop(k,None)
            #if v:
                #self.search_args[k]=v
         
    def get_context(self):
        """
        """
        if self.valid_name:
            ls=[]
            for name in self.valid_name:
                ls.append(self.model._meta.get_field(name).verbose_name)
            return ','.join(ls)
        else:
            return None
    
    def get_query(self,query):
        if self.q:
            exp=None
            for name in self.valid_name:
                kw ={}
                kw['%s__icontains'%name] =self.q    
                if exp is None:
                    exp = Q(**kw)
                else:
                    exp = exp | Q(**kw) 
            return query.filter(exp)
        else:
            return query

class RowFilter(object):
    names=[]
    model=''
    def __init__(self,dc,user,allowed_names,kw={}):
        self.valid_name=[x for x in self.names if x in allowed_names]
        self.crt_user=user
        self._names=[x for x in self.names if x in allowed_names]        
        self.filter_args={}
        for k in self.names:
            v = dc.pop(k,None)
            if v:
                self.filter_args[k]=v    
    
    def get_context(self):
        ls=[]
        for name in self.valid_name:
            f = self.model._meta.get_field(name)
            ls.append({'name':name,'label':f.verbose_name,'option':self.get_options(name)})
        return ls
      
    def get_query(self,query):
        self.query=query
        query=query.filter(**self.filter_args)
        return query    
    
    def get_options(self,name):
        ls = list(set(self.query.values_list(name,flat=True)))
        ls.sort()
        ls=[{'value':x,'label':x} for x in ls]
        return ls
    
class RowSort(object):
    """
    row_sort: 'name1,-name2'
    """
    names=[]
    def __init__(self,row_sort=[],user=None,allowed_names=[],kw={}):
        self.valid_name=[x for x in self.names if x in allowed_names]
        ls=[]
        for x in row_sort:
            if x.lstrip('-') in self.valid_name:
                ls.append(x)
        self.sort_str=','.join(ls)
        
    def get_context(self):
        return {'sortable':self.valid_name,'sort_str':self.sort_str}
    
    def get_query(self,query):
        if self.sort_str:
            ls=self.sort_str.split(',')
            return query.order_by(*ls)
        else:
            return query

  
class ModelTable(object):
    """
    
    Getter Method:
    ===============
    get_heads(self):
        return [{name:'xxx',label:'xxx',sortable:true}]
        
    get_rows(self):
        return [{}]
    

    over-load Method:
    =================
    inn_filter(self,query):
        process inn filter logic . Get gid of ,Ex: user-ware ,group-ware data.
        these data will be used for sort and filter in front-end
        
    """
    model=''
    sort=RowSort
    search=RowSearch
    filters=RowFilter
    include=None
    exclude=[]
    pagenator=PageNum
    def __init__(self,page=1,row_sort=[],row_filter={},row_search={},crt_user=None,kw={}):
        self.crt_user=crt_user 
        self.page=page
        allowed_names=self.permited_fields()
        
        self.row_sort=self.sort(row_sort,crt_user,allowed_names,kw)
        self.row_filter=self.filters(row_filter, crt_user, allowed_names,kw) 
        self.row_search = self.search( row_search,crt_user,allowed_names,kw)
        if not self.row_filter.model:
            self.row_filter.model=self.model
        if not self.row_search.model:
            self.row_search.model=self.model
        self.pagenum = self.pagenator(pageNumber=self.page)

    @classmethod
    def parse_request(cls,request):
        """
        传入参数的形式：
        row_search: key=value&..
        row_sort: _sort=key1,-key2
        page: _page=1
        row_filter:key=value&..
        """
        kw = request.GET.dict()
        page = kw.pop('_page','1')
        row_sort = kw.pop('_sort','').split(',')
        row_sort=filter(lambda x: x!='',row_sort)
        q=kw.pop('_q',None)
        #row_search={}
        #for k in cls.search.names:
            #arg=kw.pop(k,None)
            #if arg:
                #row_search[k]=arg
        
        row_filter={}
        for k in cls.filters.names:
            arg = kw.pop(k,None)
            if arg:
                row_filter[k]=arg
        return cls(page,row_sort,row_filter,q,request.user,kw)    
        
    def get_context(self):
        return {
            'heads':self.get_heads(),
            'rows': self.get_rows(),
            'row_pages' : self.pagenum.get_context(),
            'row_sort':self.row_sort.get_context(),
            'row_filters':self.row_filter.get_context(),
            'placeholder':self.row_search.get_context(),
            'model':model_to_name(self.model),
        }
       

    def permited_fields(self):
        self.permit=Permit(model=self.model, user=self.crt_user)
        ls = self.permit.readable_fields()
        if self.include:
            return [x for x in self.include if x in ls]
        if self.exclude:
            return [x for x in ls if x not in self.exclude]
        return ls
    
    def get_heads(self):
        """
        return:[{"name": "name", "label": "\u59d3\u540d"}, {"sortable": true, "name": "age", "label": "\u5e74\u9f84"}]
        """
        ls = self.permited_fields()
        heads = model_to_head(self.model,include=ls)
        #for head in heads:
            #if head.get('name') in self.sortable:
                #head['sortable'] = True 
        return heads
    
    def get_rows(self):
        """
        return: [{"name": "heyul0", "age": "32", "user": null, "pk": 1, "_class": "user_admin.BasicInfo", "id": 1}]
        """
        query=self.get_query()
        return [to_dict(x, include=self.permited_fields()) for x in query] 
        
    def get_query(self):
        query = self.inn_filter(self.model.objects.all())
        query=self.row_filter.get_query(query)
    
        query=self.row_search.get_query(query)
        query = self.row_sort.get_query(query)
        query = self.pagenum.get_query(query)  
        return query
    #def page_filter(self,query):
        #self.pagenum = PageNum(query,perPage=self.perPage, pageNumber=self.page)
        #return self.pagenum.get_query()
    
    def inn_filter(self,query):
        if not self.crt_user.is_superuser and not self.permit.readable_fields():
            raise PermissionDenied,'no permission to browse %s'%self.model._meta.model_name
        else:
            return query
    
    #def search_filter(self,query):
        #return self.row_search.get_query(query)
        #for field in self.search_fields:
            #kw ={}
            #kw['%s__icontains'%field] =self.row_search            
        #return query
    
    #def sort_filter(self,query):
        
        #return query
    
    #def out_filter(self,query):
        #if self.search_fields and self.row_search:
            #exp = None
            #for field in self.search_fields:
                #if isinstance(field,SearchQuery):
                    #query=field.get_query(query,self.row_search,self.crt_user)
                #else:
                    #kw ={}
                    #kw['%s__icontains'%field] =self.row_search
                    #if exp is None:
                        #exp = Q(**kw)
                    #else:
                        #exp = exp | Q(**kw)
            #if exp:
                #query= query.filter(exp)
        #if self.row_sort:
            #return query.filter(**self.row_filter).order_by(*self.row_sort)
        #else:
            #return query.filter(**self.row_filter)
    
    #def get_options(self):
        #query = self.inn_filter(self.model.objects.all())
        #options=[]
        #for name in self.filters:
            #tmp = []
            #option =[]
            #field = self.model._meta.get_field(name)
            #label = field._verbose_name
            #value = self.row_filter.get(name,'')
            #for x in query: # get rid of duplicated row
                #if getattr(x,name) not in tmp:
                    #tmp.append(getattr(x,name))
                    #if value == getattr(x,name):
                        #option.append({'label': '%s:%s'%(name,getattr(x,name)),'name':getattr(x,name)})
                    #else:
                        #option.append({'label': getattr(x,name),'name':getattr(x,name)})
            #options.append({
                #'name':name,
                #'label':label,
                #'value': value,
                #'options':option,
            #})
        #return options    
    
    #def get_placeholder(self):
        #ls=[]
        #for field in self.search_fields:
            #if isinstance(field,SearchQuery):
                #ls.append(field.get_placeholder())
            #else:
                #ls.append(self.model._meta.get_field(field).verbose_name)
        #return ','.join(ls)
        # return ','.join([self.model._meta.get_field(name).verbose_name for name in self.search_fields])



# from models import MobilePage
# class PageTable(ModelTable):
    # model = MobilePage
    # sortable=['name','label']
    # filters = ['name','label']
    # include= ['name','label']
    # search_fields=['name']
    # per_page=2
  