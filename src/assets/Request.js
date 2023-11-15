import HttpRequest from "./HttpRequest"
export { AppList, AppInfo,  Login_Admin, Register_Admin, get, set, getWeb, up,LoginRequest,SendSMSRequest }
const AppList = async function (type) {
    let { data: result } = await HttpRequest({ url: `/Public/api/Get/AppList?type=${type}` })
    return result
}
const AppInfo = async function (appname) {
    let { data: result } = await HttpRequest({ url: `/Public/api/Get/AppInfo?app=${appname}` })
    return result
}
//根据后端返回需要什么参数 请求的时候加上就可以？
//判断下拉菜单的选择  传入app  根据本次后端返回返回需要的参数 [mobile,TencentCaptcha:[Ticket,randstr]]
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
//

const LoginRequest = async function (app,request_body){
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
const getWeb = async function () {
    let options = {
        url: "/Private/api/get/web",
        method: "GET",
    }
    let { data: result } = await HttpRequest(options)
    return result
}
const up = async function (variable, value) {
    let options = {
        url: "/Private/api/up",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({ variable: variable, value: value })
    }
    let { data: result } = await HttpRequest(options)
    return result
}