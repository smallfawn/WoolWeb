```yml
services:
  woolweb:
    image:  dockerpull.com/smallfawn/woolweb
    ports:
      - "1433:1433"  # 映射 1433 端口
    volumes:
      - ./data.json:/app/data.json  # 映射 data.json
      - ./value.json:/app/value.json  # 映射 value.json
```

# QLScriptpublic
# JD 京东账密登录协议版本已发布 DOCKER一键部署 对接青龙 对接BOT
购买地址
http://smshop.back1.idcfengye.com/

体验地址
http://smjd.back1.idcfengye.com/
# data.json 后台http://127.0.0.1:1433/#/admin 先注册后登录 然后必填qinglong配置
```json
{
  "web": {
    "name": "A",
    "notice": "A"
  },
  "qinglong": {
    "url": "",
    "id": "",
    "secret": "",
    "version": "new"
  },
  "admin": {
    "username": "",
    "password": ""
  }
}
```
# value.json 配置 不懂不要动
```json
{
  "applist": [
    {
      "name": "测试",
      "variable": "demoaaaa",
      "test": "测试哦",
      "regular": "",
      "envSplitor": null
    }
  ]
}
```
