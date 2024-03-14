import oracledb

un = 'ADMIN'
pw = '.5wBPW3qSwJuWC!'
dsn = '(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1521)(host=adb.eu-madrid-1.oraclecloud.com))(connect_data=(service_name=g70802e41303b93_debuggingdollarsdatabase_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))'


with oracledb.connect(user=un, password=pw, dsn=dsn) as connection:
  with connection.cursor() as cursor:
      sql = """select sysdate from dual"""
      for r in cursor.execute(sql):
          print(r)