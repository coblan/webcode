#from django.core.serializers import serialize
#from django.db.models.query import QuerySet, ValuesListQuerySet
#from django.utils.safestring import mark_safe
from django.template import Library
from django.utils.safestring import mark_safe

import json

register = Library()

def jsonify(obj):
    if obj is None:
        return ''
    else:
        return mark_safe( json.dumps(obj) )

    #if isinstance(object, ValuesListQuerySet):
        #return mark_safe(json.dumps(list(object)))
    #if isinstance(object, QuerySet):
        #return mark_safe(serialize('json', object))
    #return mark_safe(json.dumps(object))

register.filter('jsonify', jsonify, is_safe=True)
#jsonify.is_safe = True  