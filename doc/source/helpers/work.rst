===================
工作
===================
工作记录，审核，统计等

ValidDepart
============

查询员工有效的部门。

::

    def get_depart_can_submit_work(employee):
        allowed_departs=[]
        for depart in employee.depart.all():
            permit = DepartModelPermit(WorkRecord, employee,department=depart)
            if permit.can_add():
                allowed_departs.append(depart)
        return allowed_departs
                

    class WRselfValidDepart(ValidDepart):
        data_key='work_self'
        # 这里重载函数，进行处理
        def get_allowed_depart(self):
            return get_depart_can_submit_work(self.employee)

    class WRselfTablePage(TablePage):
        tableCls=WRselfTable
        template='work/workself_f7.html'
        
        def __init__(self,request):
            self.request=request
            self.table = self.tableCls.parse_request(request)
            self.crt_user=request.user
            employee=self.crt_user.employee_set.first()
            self.valid_depart=WRselfValidDepart(employee,self.request.GET.get('_depart'))
            self.permit= DepartModelPermit(WorkRecord,employee, self.valid_depart.get_crt_depart())

能够从get_context函数中获取到depart列表，能够返回的字段key的代码片段

::

    ctx['depart_list']=[{'pk':x.pk,'label':unicode(x)} for x in allowed_departs]
    ctx['crt_depart']=to_dict( self.get_crt_depart())
    ctx['data_key']=self.data_key
    ctx['child_depart_list']=[to_dict(x) for x in self.get_query_depart()[:-1]]

