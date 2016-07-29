# -*- encoding:utf8 -*-
from __future__ import unicode_literals

webcore = r'D:\coblan\webcode'
def exclude_pyc(src,dst):
    return not src.endswith('pyc')

entrys=[
    {'src':webcore+r'\core',
     'dst':r'D:\coblan\web\first\src\core',
     'include_file':exclude_pyc,
     #'include_dir':lambda dir: dir!='simPage'
     },
    {'src':r'D:\coblan\web\first\src\core' ,
     'dst':webcore+r'\core',
     'include_file':exclude_pyc,

    },    
]


