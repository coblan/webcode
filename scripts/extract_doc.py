#!python3
import sys
sys.path.append('d:/coblan/py3')

import extr_doc

import logging
logging.basicConfig(level=logging.INFO)

config={
    'entry':'d:/coblan/webcode',
    'out':'d:/coblan/webcode/doc/source',
    'ext':['html','js'],
    'exclude':[r'd:/coblan/webcode/node_modules',r'd:/coblan/webcode/build']
}

extr_doc.parse(config)