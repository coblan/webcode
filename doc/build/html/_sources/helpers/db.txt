

==============
数据库快捷函数
==============

redis
=======
目标是全局只有一个到redis的连接::

    from helpers.db.redis_utils import redis_conn
