#!python3
import sys
sys.path.append('d:/coblan/py3')

import extr_doc

config={
    'entry':'d:/coblan/webcode',
    'out':'d:/coblan/webcode/doc/source',
    'ext':['html','js'],
    'exclude':['d:/coblan/webcode/node_modules']
}

extr_doc.parse(config)