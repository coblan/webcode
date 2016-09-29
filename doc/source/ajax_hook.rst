==============
ajax process
==============

functions
==========
There has a lot of place need to pay attention to in Ajax communication.For example:Error handle,CSRS process and so on.
I wrap these function in one module.

* hook_ajax_msg
	| message handler,include *beforeunload*,*ajaxSuccess*,*ajaxError*
	| already call **hook_ajax_csrf** at finally

* hook_ajax_csrf
	specifically used for django backend. Adding csrf information to http header for pass the csrf checking of django.
	
* show_upload
* hide_upload
	show and hide submit model window.Can be used when submit to server.

Using
========
1. create js file,and import function from these module.
2. compile with webpack to generate a XXX.pack.js

All function has been include in :ref:`fields-js<fields-js>`.
