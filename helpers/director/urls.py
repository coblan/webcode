from django.conf.urls import include, url
import views
from model_admin import render
urlpatterns = [
    url(r'^login/',views.login,name='login'),
    url(r'regist/',views.regist_user,name='regist'),
    url(r'^logout/$',views.logout),
    url(r'pswd/',views.change_pswd),
    
    url(r'model/(?P<name>\w+)/edit/$',render.form_view,name='model_new'),
    url(r'model/(?P<name>\w+)/edit/(?P<pk>\w+)/$',render.form_view,name='model_edit'),
    url(r'model/(?P<name>\w+)/$',render.table_view,name='model_table'),
    url(r'^del_rows/$',render.del_rows,name='del_rows'),
    
]