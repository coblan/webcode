=========
my admin
=========

full example
=============
::
	from core.model_render import model_dc
	from core.tabel import ModelTable
	from core.fields import ModelFields

	class BasicInfoTable(ModelTable):
	    model = BasicInfo
	    filters=['name','age']
	    include = ['name','age']
	    sortable=['age']
	    per_page=2
	    search_fields=['age','name']


	class BasicInfoFields(ModelFields):
	    model=BasicInfo
	    fields=['name','age','user']

ModelFields
	fields is must