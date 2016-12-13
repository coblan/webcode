from django.contrib.auth.models import User
from django.contrib import auth 
from core.db_tools import get_or_none,from_dict
from director.forms import AuthForm,LoginForm


def get_globe():
    return globals()


def logout(request):
    auth.logout(request)
    return {'status':'success'}


def do_login(username,password,request):
    form=LoginForm({'username':username,'password':password})
    if form.is_valid():
        user= auth.authenticate(username=username,password=password)
        auth.login(request, user)
        return {'status':'success'}
    else:
        return {'errors':form.errors}
    #if user: 
        #if user.is_active:  
            #auth.login(request, user)
            #return {'status':'success'}
        #else:
            #raise UserWarning,'[do_login] user has been disabled'
    #else:
        #user=get_or_none(User,username=name)
        #if user:
            #raise UserWarning,'[do_login] user exist,but password not match'
        #else:
            #raise UserWarning,'[do_login] user not exist'
    #raise UserWarning,'[do_login] user or password not match'  

def registe(info):
    form = AuthForm(info)
    if form.is_valid(): 
        user=from_dict(form.cleaned_data,User)
        user.set_password(user.password)
        #user=User.objects.create_user(username=username,password=password)
        user.is_active=True
        user.save()
        return {'status':'success'}  
    else:
        return {'errors':form.errors}
    #try:
        #User.objects.get(username=username)
        #raise UserWarning,'[registe] username has exist'
    #except User.DoesNotExist:
        #user=User.objects.create_user(username=username,password=password)
        #user.is_active=True
        #user.save()
        #return {'status':'success'}
        #form=StudioForm(studio)
        #if form.is_valid():
            #studio.update(form.cleaned_data )
            #studio_obj=from_dict(studio)
            #studio_obj.save()
            #freeze_studio_with_celery(studio_obj)
            #return {'status':'success'}
        #else:
            #return {'errors':form.errors}

def changepswd(user,pswd):
    user.set_password(pswd)
    user.save()
    return {'status':'success'}
    

