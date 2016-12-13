from django.shortcuts import render,redirect
from django.http import HttpResponse
from core.port import jsonpost
from django.core.urlresolvers import reverse
import auth_user.ajax as auth_ajax
import json
from core.db_tools import form_to_head
from forms import AuthForm
from django.contrib import auth 
from django.views.decorators.csrf import ensure_csrf_cookie

@ensure_csrf_cookie
def login(request):
    if request.method=='GET':
        next_url=request.GET.get('next','/')
        dc={
            'next':next_url,
            'regist_url':reverse('regist'),
            
        }
        return render(request,'authuser/login.html',context=dc)
  
    elif request.method=='POST':
        return jsonpost(request,auth_ajax.get_globe())
    
@ensure_csrf_cookie
def regist_user(request):
    if request.method=='GET':
        dc={
            'login_url':reverse('login'),
            'heads':json.dumps( form_to_head(AuthForm()))
        }
        return render(request,'authuser/regist.html',context=dc)
    elif request.method=='POST':
        return jsonpost(request,auth_ajax.get_globe()) 


def logout(request):
    next = request.GET.get('next','/')
    auth.logout(request)
    return redirect(next) 

@ensure_csrf_cookie
def change_pswd(request):
    if request.method=='GET':
        dc={
            'login_url':reverse('login')
        }        
        return render(request,'authuser/changepswd.html',context=dc)
    elif request.method=='POST':
        #try:
        return jsonpost(request,auth_ajax.get_globe())  
        #except UserWarning as e:
            #return HttpResponse(json.dumps({'status':'fail','msg':str(e)}),content_type="application/json")