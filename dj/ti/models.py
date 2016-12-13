from django.db import models

class AccessToken(models.Model):
    appid=models.CharField('appid',max_length=200,blank=True)
    content=models.CharField('token',max_length=500,blank=True)
    update=models.DateTimeField(verbose_name='update at',auto_now=True)
    