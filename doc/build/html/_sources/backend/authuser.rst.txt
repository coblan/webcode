=========
authuser
=========

configration
==============

1. in urls.py ::

	url(r'^accounts/',include('authuser.urls')),

2. Add authuser package to *INSTALL_APP* in settings.py ::

	INSTALLED_APPS = (
    'django.contrib.admin',
    ...
	'authuser',

3. import Vuejs and fields.pack.js

url example
============

used in a.href::

	<a href="/accounts/logout/?next=/hello/model/basicinfo/">退出</a>
    <a href="/accounts/login/?next=/hello/model/basicinfo/">登陆</a>
	<a href="/accounts/regist/">注册</a>