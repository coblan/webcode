# encoding:utf-8
from __future__ import unicode_literals
from django.core.urlresolvers import reverse
import hashlib
import requests
import xmltodict
import random

proxy = {'https': '127.0.0.1:8087'} 

class WXPay(object):
    APPID=''
    APPSECRET=''
    APISECERT=''
    MACHID=''
    
    def unify_order(self,params):
        if not 'sign' in params.keys():
            params['sign'] = self.params_sign(params)
    
        postdata='<xml>'
        for k,v in params.items():
            if v:
                postdata+='<{key}>{value}</{key}>\n'.format(key=k,value=v)
        postdata+='</xml>'
        
        resp = requests.post('https://api.mch.weixin.qq.com/pay/unifiedorder',data=postdata.encode('utf-8'))
        
        #ToDo 判断是否是正确的XML，如果是，才继续解析
        resp =xmltodict.parse(resp.content).get('xml')
        return resp
        
    def process_order_resp(self,resp):
        return resp
    
    def save_order(self,resp):
        pass
    
    def get_nonce_str(self,length=15):
        a='abcdefghijklmnopqrstuvwxyz'
        a+=a.upper()
        return ''.join([random.choice(a) for i in range(length)])
        
    
    def params_sign(self,params):
        sign_str = ''
        for k,v in sorted(params.items(),key=lambda p:p[0]):
            if v:
                sign_str += '{key}={value}&'.format(key=k,value=v)
        sign_str = sign_str + 'key=' + self.APISECERT
        return hashlib.md5(sign_str.encode('utf-8')).hexdigest().upper()    
        

def get_order(appid,mch_id,body,detail,out_trade_no,total_fee,spbill_create_ip,notify_url,trade_type='JSAPI',nonce_str=None,
              fee_type='CNY',device_info='WEB',**kw):
    """
    微信统一下单
    
    params = {
        'appid' : setting.WXPAY_APPID,
        'mch_id' : setting.WXPAY_MACHID,
        'device_info' : 'WEB',
        'nonce_str' : str(int(time.time())),
        'body' : self.meal['meal_name'],
        'detail': self.meal['meal_desc'],
        'out_trade_no' : self.orderno,
        'fee_type' : 'CNY',
        'total_fee' : int(float(self.meal['meal_nowprice'])*100),
        'spbill_create_ip' : (self.request_ip and self.request_ip) or '127.0.0.1',
        'notify_url' : setting.WXPAY_NOTIFY,
        'trade_type' : 'APP'
    }
    """
    params={
        'appid' : appid,
        'mch_id' : mch_id,
        'device_info' : device_info,
        'nonce_str' : nonce_str if nonce_str else str(int(time.time())),
        'body' : body,
        'detail': detail,
        'out_trade_no' : self.orderno,
        'fee_type' : fee_type,
        'total_fee' : total_fee,
        'spbill_create_ip' : spbill_create_ip,
        'notify_url' : notify_url,
        'trade_type' : trade_type        
    }
    params.update(kw)
    if not 'sign' in params.keys():
        params['sign'] = wx_params_sign(params)
    
    #postdata = '''
            #<xml>
                #<appid>{appid}</appid>
                #<mch_id>{mch_id}</mch_id>
                #<device_info>{device_info}</device_info>
                #<nonce_str>{nonce_str}</nonce_str>
                #<body>{body}</body>
                #<detail>{detail}</detail>
                #<out_trade_no>{out_trade_no}</out_trade_no>
                #<fee_type>{fee_type}</fee_type>
                #<total_fee>{total_fee}</total_fee>
                #<spbill_create_ip>{spbill_create_ip}</spbill_create_ip>
                #<notify_url>{notify_url}</notify_url>
                #<trade_type>{trade_type}</trade_type>
                #<sign>{sign}</sign>
            #</xml>
        #'''.format(**params)  
        
    postdata='<xml>'
    for k,v in params.items():
        postdata+='<{key}>{value}</key>'.format(key=k,value=v)
    postdata+='</xml>'
    
    resp = requests.post('https://api.mch.weixin.qq.com/pay/unifiedorder',data=postdata)
    

    def get_wx_order(self):
        '''
            微信统一下单
        '''
        params = {
            'appid' : setting.WXPAY_APPID,
            'mch_id' : setting.WXPAY_MACHID,
            'device_info' : 'WEB',
            'nonce_str' : str(int(time.time())),
            'body' : self.meal['meal_name'],
            'detail': self.meal['meal_desc'],
            'out_trade_no' : self.orderno,
            'fee_type' : 'CNY',
            'total_fee' : int(float(self.meal['meal_nowprice'])*100),
            'spbill_create_ip' : (self.request_ip and self.request_ip) or '127.0.0.1',
            'notify_url' : setting.WXPAY_NOTIFY,
            'trade_type' : 'APP'
        }
        params['sign'] = self.wx_params_sign(params)

        postdata_tpl = '''
            <xml>
                <appid>%s</appid>
                <mch_id>%s</mch_id>
                <device_info>%s</device_info>
                <nonce_str>%s</nonce_str>
                <body>%s</body>
                <detail>%s</detail>
                <out_trade_no>%s</out_trade_no>
                <fee_type>%s</fee_type>
                <total_fee>%s</total_fee>
                <spbill_create_ip>%s</spbill_create_ip>
                <notify_url>%s</notify_url>
                <trade_type>%s</trade_type>
                <sign>%s</sign>
            </xml>
        '''

        postdata = postdata_tpl % (params['appid'],params['mch_id'],params['device_info'],params['nonce_str'],
                                   params['body'],params['detail'],params['out_trade_no'],params['fee_type'],params['total_fee'],
                                   params['spbill_create_ip'],params['notify_url'],params['trade_type'],params['sign'])


        from tornado import httpclient
        try:
            url = 'api.mch.weixin.qq.com'
            import httplib
            conn = httplib.HTTPSConnection(host=url,port=443)
            conn.request(url='/pay/unifiedorder',method='POST',body=postdata)
            response = conn.getresponse()
#           http_client = httpclient.HTTPClient()
#           response = http_client.fetch(host=url,url='/pay/unifiedorder',method='POST',body=postdata)
            resp = xmltodict.parse(response.read())
            resp = resp['xml']
            self.resp['code'],self.resp['msg'] = 1,resp.get('return_msg')      
            self.resp['ret'] = (resp.get('return_code') == 'SUCCESS' and 1) or 0
            self.resp['data'] = self.wx_mobile_sign(resp)
            if self.resp['ret']==1:
                dmoney = float(self.meal['meal_price'])-float(self.meal['meal_nowprice'])
                _orderctl.add_payorder(self.userid,self.orderno,self.productid,0,self.meal['meal_price'],dmoney,self.meal['meal_nowprice'],self.platform,self.meal['meal_name'])
        except Exception ,ex:
            logger.error('error in getwxorder:%s' % str(ex))
            self.resp['code'],self.resp['msg'] = 3,str(ex)
        self.send()

def wx_params_sign(WXPAY_APISECERT,params):
    sign_str = ''
    for k,v in sorted(params.items(),key=lambda p:p[0]):
        sign_str += '{key}={value}&'.format(key=k,value=v)
    sign_str = sign_str + 'key=' + WXPAY_APISECERT
    return hashlib.md5(sign_str).hexdigest().upper()