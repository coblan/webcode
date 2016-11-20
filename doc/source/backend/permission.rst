=====
权限
=====

主要有全局表权限，表单条记录权限，表字段权限三层。

控制实现的方式
================

全局表权限
	依附于Django自带权限系统，实现了对某表的全局权限控制。

单条记录权限
	实现对单条记录的权限控制。在函数 **can_access_instance** 来进行控制。该函数会被基类调用，如果返回值为False，在save或者get_row函数中会抛出 *PermissionDenied* 异常。

表字段权限
	控制用户对于字段的权限。可以在 **init_fields** 函数中，根据self.crt_user来定义self.fields属性。不在self.fields中出现的字段，将不会被输出，也不会出现在self.cleaned_data中
	
readonly
	控制前端显示样式，控制后端某些字段的修改权限。在 **get_readonly_fields** 函数中，可以根据self.crt_user进行设定哪些field字段是只读的。这些将会影响：

	1. 输出信息时,通过在 **get_heads** 中添加readonly=True字段，传递给前端。
	2. 保存信息时，在save函数中，通过比较 self.changed_data 是否有包含get_readonly_fields返回name列表中的name,决定是否抛出PermissionDenied异常。

	此外，还可以通过 **get_input_type** 函数来定义readonly的显示类型，例如 *label* 类型。


代码演示
==========

::

	class UserFields(ModelFields):
	    age = forms.CharField(label='年龄')
	    
		class Meta:
	        model=User
	        fields=['username','first_name','is_active','is_staff','is_superuser','email','groups','user_permissions']	  
	          
	    def init_fields(self): # 通过fields值来：1）输出字段，2）clean字段。
	        if not hasattr(self.instance,'basicinfo'):
	            self.fields.pop('age')

	        self.fields.pop('username')  
	        
	    def init_value(self): # 构造初始值，用于构造form.changed_data,
	        super(UserFields,self).init_value()
	        ls =['age']
	        for k in ls:
	            if k in self.fields:
	                self.fields[k].initial=self.instance.basicinfo.age

	    def get_row(self):
	        row = super(UserFields,self).get_row()
	        user = User.objects.get(pk= row['pk'])
	        if hasattr(user,'basicinfo'):
	            if 'age' in self.fields:  # 必须判断一下，用户是否有该field权限，才能输出
	                row['age']=user.basicinfo.age
	        return row

	    def get_input_type(self):
	        return {'age':'text'}
        
	    def can_access_instance(self):
	        """
	        用于判断当前的self.instance是否能够被self.crt_user访问
	        """
	        return True

		def get_readonly_fields(self): # 控制只读字段
        	return [] #['first_name']
        	
	    def save(self, instane, row): # 重载该函数，实现除model外字段的保存工作
	        super(UserFields,self).save(instane,row)
	        user = instane
	        user.save()
	        
	        age= self.cleaned_data.get('age') 
	        if age:
	            user.basicinfo.age=age  # 取model外字段时，必须从cleaned_data取，这样会遵守 fields权限控制
	            
	        if hasattr(user,'basicinfo'):
	            user.basicinfo.save()
	        
	        return {'status':'success'}
