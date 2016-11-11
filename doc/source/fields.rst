===========
fields管理
===========

fields指的是数据库的fields，这里介绍的内容，主要涉及到对数据库内容的渲染展示与修改操作。主要有前端和后端两个部分。

fields前端
===========
在这个例子中，我用最简单的后端生成heads数据，来演示fields在前端的使用。fields在前端的源文件是fileds.js。

前端渲染
---------

1. 创建django form来管理，验证Model instance::

	from django import forms
	from models import ArtComment

	# used to explode form class to outer
	def get_globe():
	    return globals()

	class CommentForm(forms.ModelForm):
	    class Meta:
	        model=ArtComment
	        exclude=['create_time']

funtion **form_to_head** will convert form instance to head dict

.. _fields-front:

2. construct field information and insert it into Template context::

	heads= json.dumps(form_to_head( CommentForm()))
	# create a new empty Model instance ,or you can query one
	row= json.dumps(to_dict(ArtComment()))

	# insert into context of Template in views
	context ={'heads':heads,'row':row}
	return render(request,'xxx.html',context=context)
	
3. put variable into Template for render::

	# put variable in Django Template
	heads={{heads | safe}}
	row ={{row | safe}}

4. render field with Vuejs::

	# in script section
	kw={
		errors:{},
		row:row,
		heads:heads,
	}
	new Vue({
		data:{
			kw:kw,
			},
	})

	# in Body area，we organize and dispose these fileds
	<field name='comment' :kw='kw'></field>

	
后端保存
----------

I prefer to communicate between front and back with ajax.So we need create ajax logic in both front and end.In my opinion ,I recomend creating a file that name after ajax.py in your Django application. In ajax.py ,we need present funtion to process SAVE operation.

::

	from core.db_tools import to_dict,model_form_save,save_model_form
	import forms

	# explode ajax.py namespace to views model
	def get_globe():
	    return globals()

	def save(row):
	    return save_model_form(row, forms.get_globe())

As you can see,the most importent function is **save_model_form** .The function save row to Model automately becuase '_class' meta info of row represent Model class.So please make sure origin of ROW is function "to_dict".

In frontend,we submit Row data by ajax.It will be routed to valid by form then to save into database.If has errors when validating,it will interrupted immidiatly and send errors to frontend.You can catch the errors,and it will be automatly displayed under field input.

::

	var post_data=[{fun:'save',row:row}]
	$.post('',JSON.stringify(post_data),function (data) {
		// judge if there is errors back from server
		if(data.save.errors){
			update_vue_obj(self.kw.errors,data.save.errors)
		}
	})

.. note:: Errors in here is so call valid fail information,not common errors message.

	 The real Error message will be process and notified by field.pack.js .Ex :network communicate errors,server errors and so on.


fields后端
============
为了替换django的admin，在后端实现了较为灵活的fields类，包含新的permission功能，admin类似的定制功能等等。该fields类其实是forms的子类，决定了其还具备验证数据功能 ::

	class ModelFields(forms.ModelForm):
	    """
	    参数组合
	    1. pk,crt_user 开始编辑的时候
	    2. dc,crt_user 保存的时候
	    """

	    def __init__(self,dc={},pk=None,crt_user=None,*args,**kw):

		def get_context(self):
			# 向前端输出信息时候调用该函数
			return {heads:xx,
					row:xxx}

		def save_form(self):
			# 向后端写入数据的时候调用改函数
		

下面是一个定制化的例子::

	class UserFields(ModelFields):

	    def pop_fields(self):
	    	# 如果不想前端显示某个字段，或者编辑某个字段，就在这里表示出来
	        self.fields.pop('username')       
	    
	    class Meta:
	        model=User
	        fields=['username','first_name','is_active','is_staff','is_superuser','email','groups','user_permissions']
	    
	    def get_row(self):
	    	# 如果要对某个字段的内容进行修改，就到这个函数里面
	        row = super(UserFields,self).get_row()
	        if row['pk']:
	            user = User.objects.get(pk= row['pk'])
	            if hasattr(user,'basicinfo'):
	                if 'age' in self.fields:
	                    row['age']=user.basicinfo.age
	        return row
	    
	    def can_access_instance(self):
	    	# 控制改行能否被访问，例如，张三不能看李四的记录。super只遵从整个表的权限，没有单个记录的权限。
	        return super().can_access_instance()
	    
	    def get_input_type(self):
	    	# 修改某些字段的类型，该类型决定了前端fields显示的输入框类型
	        return {'age':'linetext'}
	    
	    def get_options(self):
	    	# 控制select项，能生成select项的有 foreginkey,manytomany,onetoone等等
	        return super(UserFields,self).get_options()
	    
	    def clean_age(self):
	    	# 普通的form验证数据。
	        print('in age function')
	        return self.cleaned_data['age']

	    
