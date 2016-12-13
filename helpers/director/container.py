import inspect

def evalue_container(container,**kw):
    """
    use to evalue dict or list ,that has some callable element
    
    Example:
    dc={'name':lambda user:user.username}
    
    dc = evalue_container(dc,user=request.user)
    
    """
    if isinstance(container,dict):
        return evalue_dict(container,**kw)
    elif isinstance(container,(tuple,list)):
        return evalue_list(container,**kw)
    elif callable(container):
        args=inspect.getargspec(container).args
        real_kw={}
        for k,v in kw.items():
            if k in args:
                real_kw[k]=v
        return container(**real_kw)
    else:
        return container

def evalue_dict(dc,**kw):
    for k,v in dc.items():
        dc[k]=evalue_container(v,**kw)
    return dc

def evalue_list(ls,**kw):
    new_ls=[]
    for item in ls:
        tmp=evalue_container(item,**kw)
        if isinstance(tmp,dict) and tmp.get('invalid'):
            continue
        new_ls.append(tmp)
    return new_ls