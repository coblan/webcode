from db_tools import to_dict,model_to_head
import json
from django.db.models import Q
#from forms import MobilePageForm


from django.core.paginator import Paginator


def get_page_nums(page_range,page):
    """
    generate Pagenations numbers ,Current page number will be spcially process,sufix digit weith "_a" .
    First page and last page will be spcially process, if it can't be shown by normal logic,make sure user can click first and last page
    
    """
    page=int(page)
    page_count = len(page_range)
    k=3
    a=-1
    while a < 1:
        a=page-k
        k-=1
    page_nums = range(a,min(page_count,page+(5-k))+1)
    if page_nums[0] != 1:
        page_nums=[1,'...']+ page_nums
    if page_nums[-1] != page_count:
        page_nums = page_nums +['...',page_count]
    for i in range(len(page_nums)):
        num = page_nums[i]
        if str(num) == str(page):
            page_nums[i]='%s_a'%num
            break
    page_nums=[str(x) for x in page_nums]
    return page_nums


class Table(object):
    per_page=30
    def __init__(self,page=1,sort=[],filter={},q=''):
        self.page=page
        self.sort=sort
        self.arg_filter=filter 
        self.q = q
        
    @classmethod
    def parse_request(cls,request):
        kw = request.GET.dict()
        page = kw.pop('_page','1')
        sort = kw.pop('_sort','').split(',')
        q=kw.pop('_q','')
        sort=filter(lambda x: x!='',sort)
        arg_filter = kw
        
        return cls(page,sort,arg_filter,q)
    
    def get_heads(self):
        pass
    def get_sort(self):
        return self.sort
    
    def get_rows(self):
        pass
    
    def get_page(self):
        pass
    
    def get_options(self):
        pass
    
class ModelTable(Table):
    """
    
    Getter Method:
    ===============
    get_heads(self):
        return [{name:'xxx',label:'xxx',sortable:true}]
        
    get_rows(self):
        return [{}]
    
    get_page_nums(self):
        return ['1','2_a','3']
        this method should be called after **get_rows**.
    
    over-load Method:
    =================
    inn_filter(self,query):
        process inn filter logic . Get gid of ,Ex: user-ware ,group-ware data.
        these data will be used for sort and filter in front-end
        
    """
    model=''
    sortable=[]
    include=[]
    per_page=30
    search_fields=[]
    placeholder=''
    filters=[]
    def __init__(self,page=1,sort=[],filter={},q=''):
        super(ModelTable,self).__init__(page,sort,filter,q)
        field_names = [x.name for x in self.model._meta.fields]
        self.arg_filter={}
        for k,v in filter.items():
            if k in field_names:
                self.arg_filter[k]=v
    
    def get_context(self):
        return {
            'heads':json.dumps(self.get_heads()),
            'rows': json.dumps(self.get_rows()),
            'page_nums' : json.dumps(self.get_page_nums()),
            'filters':json.dumps(self.get_options()),
            'sort':json.dumps(self.get_sort()),
            'q': self.q ,
            'placeholder':','.join([self.model._meta.get_field(name).verbose_name for name in self.search_fields]),
        }
       

    def get_heads(self):
        heads = model_to_head(self.model,include=self.include)
        for head in heads:
            if head.get('name') in self.sortable:
                head['sortable'] = True 
        return heads
    
    def get_rows(self):
        query = self.inn_filter(self.model.objects.all())
        query = self.out_filter(query)
        pg = Paginator(query,self.per_page)
        ls=[]

        page_nums = get_page_nums(pg.page_range,self.page)
        self.__page_nums = page_nums
        return [to_dict(x) for x in pg.page(self.page)]   
    
    def get_page_nums(self):
        return self.__page_nums
    
    def inn_filter(self,query):
        return query
    
    def out_filter(self,query):
        if self.search_fields and self.q:
            exp = None
            for field in self.search_fields:
                kw ={}
                kw['%s__icontains'%field] =self.q
                if exp is None:
                    exp = Q(**kw)
                else:
                    exp = exp | Q(**kw)
            query= query.filter(exp)
        if self.sort:
            return query.filter(**self.arg_filter).order_by(*self.sort)
        else:
            return query.filter(**self.arg_filter)
    
    def get_options(self):
        query = self.inn_filter(self.model.objects.all())
        options=[]
        for name in self.filters:
            tmp = []
            option =[]
            label = filter(lambda x :x.name == name,self.model._meta.fields)[0]._verbose_name,
            value = self.arg_filter.get(name,'')
            for x in query: # get rid of duplicated row
                if getattr(x,name) not in tmp:
                    tmp.append(getattr(x,name))
                    if value == getattr(x,name):
                        option.append({'label': '%s:%s'%(name,getattr(x,name)),'name':getattr(x,name)})
                    else:
                        option.append({'label': getattr(x,name),'name':getattr(x,name)})
            options.append({
                'name':name,
                'label':label,
                'value': value,
                'options':option,
            })
        return options    


# from models import MobilePage
# class PageTable(ModelTable):
    # model = MobilePage
    # sortable=['name','label']
    # filters = ['name','label']
    # include= ['name','label']
    # search_fields=['name']
    # per_page=2
  