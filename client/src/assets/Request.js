import HttpRequest from "./HttpRequest"

export { appsApi, adminLogin, adminRegister, adminGet, adminSet, getWeb, up, loginRequest, sendSMSRequest, updateValue, qrcodeGetApi, qrcodeLoginApi, testQingLong, }
const appsApi = async function (type, data) {
    let options = {
        method: 'GET',
        url: `/api/main/apps?type=${type}&data=${data}`,
        headers: {}
    }
    let { data: result } = await HttpRequest(options)
    return result
}
const qrcodeGetApi = async function (appname) {
    let options = {
        method: 'GET',
        url: `/api/main/qrcode/get?app=${appname}`,
        headers: {

        }
    }
    let { data: result } = await HttpRequest(options)
    return result
}
const qrcodeLoginApi = async function (appname, value) {
    let options = {
        url: `/api/main/qrcode/login`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        data: JSON.stringify({ app: appname, value: value })
    }
    let { data: result } = await HttpRequest(options)
    return result
}


const testQingLong = async function (options) {
    let url = options.url
    let id = options.id
    let secret = options.secret
    let { data: result } = await HttpRequest({
        url: `/api/user/test`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        data: JSON.stringify({ url: url, id: id, secret: secret })
    })
    return result
}
const updateValue = async function (options) {
    let { data: result } = await HttpRequest({
        url: `/api/user/value/update`, method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            token: localStorage.getItem("WoolWebAdminToken")
        },
        data: JSON.stringify(options)
    })
    return result
}
/**
 * 发送短信通用API
 * @param {*} request_body 其他组件构建的body
 * @returns 
 */
const sendSMSRequest = async function (request_body) {
    let options = {
        url: `/api/main/sms`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(request_body),
    }
    let { data: result } = await HttpRequest(options)
    return result
}
/**
 * 登录通用API
 * @param {*} request_body 其他组件构建的body
 * @returns 
 */
const loginRequest = async function (request_body) {
    //console.log(request_body);
    let options = {
        url: `/api/main/login`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(request_body),
    }
    let { data: result } = await HttpRequest(options)
    return result
}
/**
 * 后台登陆
 * @param {*} username 用户名
 * @param {*} password 密码
 * @returns token
 */
const adminLogin = async function (username, password) {
    let options = {
        url: "/api/user/login",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ username: username, password: password }),
    }
    let { data: result } = await HttpRequest(options)
    return result
}
/**
 * 后台注册
 * @param {*} username 用户名
 * @param {*} password 密码
 * @returns 状态
 */
const adminRegister = async function (username, password) {
    let options = {
        url: "/api/user/register",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ username: username, password: password }),
    }
    let { data: result } = await HttpRequest(options)
    return result
}
/**
 * 获取后台设置的数据
 * @param {*} variable 键
 * @returns 值
 */
const adminGet = async function (variable) {
    let options = {
        url: "/api/user/get",
        method: "POST",
        headers: { "Content-Type": "application/json", token: localStorage.getItem("WoolWebAdminToken") },
        data: JSON.stringify({ variable: variable }),
    }
    let { data: result } = await HttpRequest(options)
    return result
}

/**
 * 设置数据
 * @param {*} variable 键
 * @param {*} value 值
 * @returns 状态
 */
const adminSet = async function (variable, value) {
    let options = {
        url: "/api/user/set",
        method: "POST",
        headers: { "Content-Type": "application/json", token: localStorage.getItem("WoolWebAdminToken") },
        data: JSON.stringify({ variable: variable, value: value }),
    }
    let { data: result } = await HttpRequest(options)
    return result
}
/**
 * 获取WEB
 * @returns 信息
 */
const getWeb = async function () {
    let options = {
        url: "/api/user/init",
        method: "GET",
        headers: {

        }
    }
    let { data: result } = await HttpRequest(options)
    return result
}
/**
 * 上传变量
 */
const up = async function (variable, value, remark = null, envSplitor = null) {
    let options = {
        url: "/api/user/update",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({ variable: variable, value: value, remark: remark, envSplitor: envSplitor })
    }
    let { data: result } = await HttpRequest(options)
    return result
}