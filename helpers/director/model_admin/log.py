import django.dispatch

model_operation = django.dispatch.Signal(providing_args=["key", "op",'detail'])