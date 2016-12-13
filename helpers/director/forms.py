from django import forms
from django.contrib.auth.models import User
from db_tools import get_or_none
from django.contrib import auth 

class AuthForm(forms.ModelForm):
    pas2= forms.CharField(max_length=100,label='seconde password')
    class Meta:
        model = User
        fields = ['username', 'password']
    
    def clean_password(self):
        password = self.cleaned_data.get('password')
        
        if not password:
            raise forms.ValidationError('need password')
        return password
    
    def clean_pas2(self):
        password = self.data.get('password')
        pas2 = self.cleaned_data.get('pas2')
        if password != pas2:
            raise forms.ValidationError('two password should be same')
        return pas2
        
    
    def clean_username(self):
        username = self.cleaned_data.get('username')
        if User.objects.filter(username=username).exists():
            raise forms.ValidationError('username has been exist')
        return username
    
    def clean(self):
        if 'pas2' in self.cleaned_data:
            del self.cleaned_data['pas2']
        return self.cleaned_data


class LoginForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'password']
    
  
    def clean(self):
        username=self.cleaned_data.get('username')
        password=self.cleaned_data.get('password')
        user= auth.authenticate(username=username,password=password)
        if not username or not password:
            return
        
        if user: 
            if user.is_active:
                return self.cleaned_data
                #auth.login(request, user)
            else:
                self.add_error('username',' user has been disabled')
        else:
            user=get_or_none(User,username=username)
            if user:
                self.add_error('username','user exist,but password not match')
            else:
                self.add_error('username','user not exist')
        
    
    
    