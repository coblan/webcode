=====
权限
=====

主要有全局表权限，表单条记录权限，表字段权限三层。

全局表权限
==========
依附于Django自带权限系统，实现了对某表的全局权限控制。

单条记录权限
============
实现对单条记录的权限控制



表字段权限
==========
控制用户对于字段的权限。

思路是在ModelFields构造函数中，根据用户信息，改造self.fields属性。

经过改造后。

* 读:
	在get_row函数中，根据form.fields字段，输出有权限的字段数据。
	
* 写:
	submit后在save函数中，form.cleaned_data自动去掉了no permission的字段。

* readonly:
	控制前端显示样式，控制后端保存权限。

下面是一个例子::

	class UserFields(ModelFields):
	    age = forms.CharField()
	    
	    def __init__(self,*args,**kw):
	        super(UserFields,self).__init__(*args,**kw)
	        if not hasattr(self.instance,'basicinfo'):
	            self.fields.pop('age')
	        if self.crt_user ...:
	        	self.fields.pop...

		class Meta:
	        model=User
	        fields=['username','first_name','is_active','is_staff','is_superuser','email','groups','user_permissions']

	    def get_row(self):
	        row = super(UserFields,self).get_row()
	        user = User.objects.get(pk= row['pk'])
	        if hasattr(user,'basicinfo'):
	            if 'age' in self.fields:
	                row['age']=user.basicinfo.age
	        return row

	    def save(self, instane, row):
	        user = instane
	        user.save()
	        age= self.cleaned_data.get('age')   # 取model外字段时，必须从cleaned_data取
	        if hasattr(user,'basicinfo') and age:
	            user.basicinfo.age=age
	            user.basicinfo.save()
	        
	        return {'status':'success'}