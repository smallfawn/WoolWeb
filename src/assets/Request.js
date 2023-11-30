import HttpRequest from "./HttpRequest"
export { AppList, AppInfo, Login_Admin, Register_Admin, get, set, getWeb, up, LoginRequest, SendSMSRequest, AppListPrivate, AppInfoPrivate, CreateValuePrivate, UpdateValuePrivate, GetQrCode,LoginQrCode }
//顾名思义
const AppList = async function (type) {
    let { data: result } = await HttpRequest({ url: `/Public/api/Get/AppList?type=${type}` })
    return result
}
//顾名思义
const AppInfo = async function (appname) {
    let { data: result } = await HttpRequest({ url: `/Public/api/Get/AppInfo?app=${appname}` })
    return result
}
const GetQrCode = async function (appname) {
    let { data: result } = await HttpRequest({ url: `/Public/api/QrCode/Get/${appname}` })
    return result
}
const LoginQrCode = async function (appname, value) {
    let { data: result } = await HttpRequest({ url: `/Public/api/QrCode/Login/${appname}?value=${value}` })
    return result
}
const AppListPrivate = async function () {
    let { data: result } = await HttpRequest({ url: `/Private/api/value/AppList` })
    return result
}
const AppInfoPrivate = async function (appname) {
    let { data: result } = await HttpRequest({ url: `/Private/api/value/AppInfo?app=${appname}` })
    return result
}
const CreateValuePrivate = async function (appname) {
    let { data: result } = await HttpRequest({
        url: `/Private/api/value/CreateValue`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8', token: localStorage.getItem("WoolWebAdminToken") },
        data: JSON.stringify({ app: appname })
    })
    return result
}
const UpdateValuePrivate = async function (appname, options) {
    let { data: result } = await HttpRequest({
        url: `/Private/api/value/UpdateValue`, method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            token: localStorage.getItem("WoolWebAdminToken")
        },
        data: JSON.stringify({ app: appname, options: options })
    })
    return result
}
/**
 * 发送短信通用API
 * @param {*} app APPNAME
 * @param {*} request_body 其他组件构建的body
 * @returns 
 */
const SendSMSRequest = async function (app, request_body) {
    let options = {
        url: `/Public/api/SendSMS/${app}`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(request_body),
    }
    let { data: result } = await HttpRequest(options)
    return result
}
/**
 * 登录通用API
 * @param {*} app APPNAME
 * @param {*} request_body 其他组件构建的body
 * @returns 
 */
const LoginRequest = async function (app, request_body) {
    console.log(request_body);
    let options = {
        url: `/Public/api/Login/${app}`,
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
const Login_Admin = async function (username, password) {
    let options = {
        url: "/Private/api/login",
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
const Register_Admin = async function (username, password) {
    let options = {
        url: "/Private/api/register",
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
const get = async function (variable) {
    let options = {
        url: "/Private/api/get",
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
const set = async function (variable, value) {
    let options = {
        url: "/Private/api/set",
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
        url: "/Private/api/get/web",
        method: "GET",
    }
    let { data: result } = await HttpRequest(options)
    return result
}
/**
 * 上传变量
 */
const up = async function (variable, value, envSplitor = "@") {
    let options = {
        url: "/Private/api/up",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({ variable: variable, value: value, envSplitor: envSplitor })
    }
    let { data: result } = await HttpRequest(options)
    return result
}