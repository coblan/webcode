def field(header, **kwargs):
    def make_field(fun):
        for k, v in kwargs.iteritems():
            setattr(fun, k, v)
        fun.short_description = header
        return fun
    return make_field