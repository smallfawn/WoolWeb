# WoolWeb

🟢: 已完成 🔴: 未完成 🟡: 正开发

| 状态 | 功能 | 详细 | 版本代号 |
| --- | ---  | --- | --- |
| 🟢 | Docker搭建 | 使用Docker一键搭建 | docker正式版-V1 |
| 🟢 | 对接青龙面板 | 上传变量（V2.11青龙） | docker正式版-V1 |
| 🟢️ | 管理员注册与登录 | 管理员页面 | docker正式版-V1 |
| 🟡 | 二维码登录 | 实现扫描二维码获取COOKIE | docker正式版-V1 |
| 🟢 | 短信登录 | 实现扫描二维码获取COOKIE | docker正式版-V1 |
| 🟢 | 账号密码登录 | 实现扫描二维码获取COOKIE | docker正式版-V1 |
| 🟢 | 自定义变量上传 | 实现自定义变量上传到青龙 | docker正式版-V1 |

| 状态 | APP | COOKIE | 版本代号 |
| --- | ---  | --- | --- |
| 🟢 | 哔哩哔哩 | 接口返回 | test |
| 🟢️ | 广汽传祺 | 接口返回 | test |
| 🟢 | 吉利汽车 | 接口返回 | test |
| 🟢 | 滨江发布 | 接口返回 | test |
| 🟢 | 北京汽车 | 接口返回 | test |
| 🟢 | 疯读小说 | 接口返回 | test |
| 🔴 | 待增加 | 接口返回 | test |
| 🔴 | 金彩云 | 接口返回 | test |

# 项目搭建：
# 1.前端
1).把前端文件放到网站目录(宝塔面板为网站根目录 1panel面板为网站根目录index文件下)

2).配置接口(设置反向代理/Public代理到公共api,设置/private代理到私有api,本项目共使用两个后端)

# 2.后端(私有)
1).把后端文件放到任意目录下(确保环境存在node -v)

2).安装基本依赖(cd到项目目录)
``````shell
npm install
``````
``````shell
npm install pm2 -g
``````
``````shell
pm2 start Api.js
``````

# 3.前端

``````shell
npm install
``````
打包
``````shell
npm run build
``````
调试
``````shell
npm run dev
``````