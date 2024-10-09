const express = require('express')
const app = express()
const path = require('path');
app.use(express.json());
const { getKey, setKey, creatKey } = require("./Funtion/key")
const { getParams, updateParams, deleteParams } = require("./Funtion/webApi")
const { getValue, updateValue } = require("./Funtion/valueApi")
const { checkParams } = require("./Funtion/utils")
const { setToken, checkToken } = require("./Funtion/jwt")
const axios = require('axios');
/**登录API */
app.post('/api/user/login', async (req, res) => {
    const { username, password } = req.body
    if (checkParams(username, password)) {
        let admin = await getParams("admin")
        if (username == admin.username && password == admin.password) {
            let key = await getKey()
            let token = setToken({ username: username }, key)
            res.send({
                status: true, message: "登录成功", data: { token: token }
            })
        } else {
            res.send({ status: false, message: "登录失败", data: null })
        }
    } else {
        res.send({ status: false, message: "登录失败", data: null })
    }
})
/**注册API */
app.post('/api/user/register', async (req, res) => {
    let key = await getKey();
    if (key == "" || key == null || key == undefined) {
        await setKey()
    }
    const { username, password } = req.body
    let admin = await getParams("admin")
    if (admin.username == "" && admin.password == "") {
        await updateParams('admin', {
            username: username,
            password: password
        })
        res.send({ status: true, message: "注册成功", data: null })
    } else {
        res.send({ status: false, message: "已注册", data: null })
    }
})
/**上传青龙API */
app.post('/api/user/update', async (req, res) => {
    const { variable, value, remark, envSplitor } = req.body;
    const { getParams } = require("./Funtion/webApi")
    const { getToken, update, setdata } = require("./Funtion/ql")
    let ql = await getParams("qinglong")
    let token = await getToken(ql)
    if (envSplitor !== null) {
        //非一对一
        if (checkParams(variable, value)) {
            let updateResult = await update(ql.url, token, variable, value, envSplitor)
            res.send(updateResult)
        }
    } else if (envSplitor == null) {
        if (checkParams(variable, value)) {
            //OTO模式 one to one 一对一
            let updateResult = await setdata(ql.url, token, variable, value, remark)
            if (updateResult.code == 200) {
                res.send({ status: true, message: "创建变量成功", data: variable })
            }
        }
    }
})
/**获取网站设置API */
app.post('/api/user/get', async (req, res) => {
    const { variable } = req.body;
    if (variable == "value") {
        res.send({ status: true, message: "获取成功", data: await getValue() })
    } else {
        const { token } = req.headers
        if (checkParams(token)) {
            let key = await getKey()
            if (await checkToken(token, key)) {
                if (variable == "qinglong") {
                    res.send({ status: true, message: "获取成功", data: await getParams("qinglong") })
                } else if (variable == "web") {
                    res.send({ status: true, message: "获取成功", data: await getParams("web") })
                } else {
                    res.send({ status: false, message: "获取失败", data: null })
                }
            }
        } else {
            res.send({ status: false, message: "获取失败", data: null })
        }
    }

})
/**设置网站设置API */
app.post('/api/user/set', async (req, res) => {
    const { variable, value } = req.body;
    const { token } = req.headers
    if (checkParams(token)) {
        let key = await getKey()
        if (await checkToken(token, key)) {
            if (variable == "qinglong") {
                updateParams("qinglong", {
                    url: value.url,
                    id: value.id,
                    secret: value.secret,
                    version: value.version
                })
                res.send({
                    status: true, message: "设置成功", data: null
                })
            } else if (variable == "web") {
                updateParams("web", {
                    name: value.name,
                    notice: value.notice
                })
                res.send({
                    status: true, message: "设置成功", data: null
                })
            } else {
                res.send({ status: false, message: "设置失败", data: null })
            }
        } else {
            res.send({ status: false, message: "设置失败", data: null })
        }
    } else {
        res.send({ status: false, message: "设置失败", data: null })
    }
})
/**测试青龙API */
app.post('/api/user/test', async (req, res) => {
    const { url, id, secret } = req.body;
    if (checkParams(url, id, secret)) {
        let testUrl = `${url}/open/auth/token?client_id=${id}&client_secret=${secret}`
        try {
            let { data: result } = await axios.request({ url: testUrl })
            if (result.code === 200) {
                res.send({ status: true, message: "青龙连通测试成功", data: null })
            } else {
                res.send({ status: false, message: "青龙连通测试失败", data: null })
            }
        } catch (error) {
            res.send({ status: false, message: "青龙连通测试失败", data: null })
        }
    }
})
/**INIT API */
app.get('/api/user/init', async (req, res) => {
    let result = await getParams("web")
    res.send({ status: true, message: "获取成功", data: result })
})

/**变量信息更新API */
app.post('/api/user/value/update', async (req, res) => {
    const { name, variable, test, regular, envSplitor } = req.body
    let result = await updateValue({ name: name, variable: variable, test: test, regular: regular, envSplitor: envSplitor })
    if (result == true) {
        res.send({ status: true, message: "保存成功", data: { name: name, variable: variable, test: test, regular: regular, envSplitor: envSplitor } })
    } else {
        res.send({ status: true, message: "保存失败", data: null })
    }
})// 设置静态资源目录（dist 文件夹）
app.use(express.static(path.join(__dirname, 'dist')));

// 处理根路径请求，返回 index.html
app.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});
//读取DIST目录的index.html文件
app.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});
app.get('/ping', function (req, res, next) {
    res.send("pong")
})
app.listen(1433, () => {
    console.log('Server is running on port 1433');
});