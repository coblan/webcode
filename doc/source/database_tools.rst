===========
ORM Tools
===========

MODEL CRUD
===========

In this example,I will build a Pattern to automatly manage DJANO ORM MODEL operation.For example,add a record ,modify a record and so on.This process include generating heads and field according model information in backend and resied them into Template.In user brower,we use Vuejs to render these information to DOM.

create djano form
-----------------

First,you need create django form class to manage Model instance information::

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

render field
-------------
1. construct field information and insert it into Template context::

	heads= json.dumps(form_to_head( CommentForm()))
	# create a new empty Model instance ,or you can query one
	row= json.dumps(to_dict(ArtComment()))

	# insert into context of Template in views
	context ={'heads':heads,'row':row}
	return render(request,'xxx.html',context=context)
	
2. put variable into Template for render::

	# put variable in Django Template
	heads={{heads | safe}}
	row ={{row | safe}}

3. render field with Vuejs::

	# in script section
	meta={
		errors:{},
		row:row,
		heads:heads,
	}
	new Vue({
		data:{
			meta:meta,
			},
	})

	# in Body area，we organize and dispose these fileds
	<field name='comment' :meta='meta'></field>

	
save process
--------------

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

MODEL LIST
============
