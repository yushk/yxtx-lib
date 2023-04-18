## mongoDB

+ 数据库备份

```bash
  mongodump -h host --port port -u user -p ps --authenticationDatabase admin --forceTableScan -d dbname -o exportpath
```

+ 数据库恢复

```bash
  mongorestore -h host --port port -u user -p ps --authenticationDatabase admin -d dbname  path
```