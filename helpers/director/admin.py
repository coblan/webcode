# encoding:utf-8
from __future__ import unicode_literals

from model_admin.render import TablePage,FormPage
from model_admin.tabel import ModelTable
from model_admin.fields import ModelFields
from model_admin.base import model_dc,model_page_dc
from django.contrib.auth.models import Group,User
import ajax
import json

class UserGroupTable(ModelTable):
    model=Group
    include=['name']

class UserGroupFields(ModelFields):
    template='user_admin/permit.html'
    class Meta:
        model=Group
        fields=['name',]
        
    def get_context(self):
        ctx = super(UserGroupFields,self).get_context()
        group = self.instance
        if hasattr(group,'permitmodel') and group.permitmodel.permit:
            ctx['permits']=json.loads(group.permitmodel.permit) #[{'model':x.model,'permit': json.loads(x.permit)} for x in self.instance.per.all()]
        else:
            ctx['permits']={}
        ctx['permit_heads']=self.permit.get_heads()
        return ctx

class GroupTablePage(TablePage):
    tableCls=UserGroupTable

class GroupFormPage(FormPage):
    template='user_admin/permit.html'
    fieldsCls=UserGroupFields
    ajax_scope=ajax.get_globe()
    
class UserFields(ModelFields):
    class Meta:
        model=User
        fields=['username','first_name','is_active','is_staff','is_superuser','email','groups']

class UserTable(ModelTable):
    model=User
    include=['username','groups','first_name','is_active','is_staff','is_superuser','email',]
    
    def get_rows(self):
        rows=super(UserTable,self).get_rows()
        for row in rows:
            row['groups']=[group.name for group in Group.objects.filter(pk__in=row.get('groups'))]
        return rows
                
            

class UserTablePage(TablePage):
    template='authuser/user_table.html'
    tableCls=UserTable

class UserFormPage(FormPage):
    fieldsCls=UserFields

model_dc[Group]={'fields':UserGroupFields}
model_dc[User]={'fields':UserFields}
model_page_dc['user']={'table':UserTablePage,'form':UserFormPage}
model_page_dc['group']={'table':GroupTablePage,'form':GroupFormPage,}