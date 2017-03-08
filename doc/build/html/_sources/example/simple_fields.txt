===========
表单简化版
===========
* 前端渲染不变

* 权限可以使用django自带，或者不要权限

* 后端生成数据::

	#创建一个ModelForm
	class CommentForm(forms.ModelForm):
	    class Meta:
	        model=ArtComment
	        exclude=['create_time']

	# 直接调用函数form_to_head生成heads
	heads= json.dumps(form_to_head( CommentForm())) 

* 后端保存::

	from core.db_tools import to_dict,model_form_save,save_model_form
	import forms
	
	def save(row):
	    return save_model_form(row, forms.get_globe())