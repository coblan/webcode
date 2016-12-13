"""
"""
from django.conf.urls import url
import views

urlpatterns = [
    url(r'pay_reply',views.pay_replay,name='wechat_pay_relay'),
  
]
