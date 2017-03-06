==========
ckeditor
==========

对ckeditor的vuejs封装，ckeditor的官方文档:http://docs.cksource.com/Main_Page

使用样例::

	// html
	<ckeditor v-model='mm'></ckeditor>

	// 在js全局域声明总线
	bus= new Vue()
	
	// 当提交时，需要同步数据
	bus.$emit('sync_data')

如果实时同步ckeditor与外部数据源，当文件较大时，输入会有所卡顿，所以我采用的方案是，通过自定义的事件"sync_data"触发数据同步。当需要向服务器提交数据时，需要先触发总线bus的"sync_data"事件。

设置
=====

	<ckeditor v-model='mm' :set='complex' :config='{}'></ckeditor>
