
const { httpRequest } = require('../utils/httpRequest')
const { checkParams } = require("../utils/checkParams")
module.exports = {
    SendSMS_GeelyApp,
    Login_Geely
}
async function SendSMS_GeelyApp(phone, captcha) {
    let mobile = phone
    let ticket = captcha.ticket
    let randstr = captcha.randstr
    let options = {
        url: "https://app.geely.com/api/v1/message/sendSmsCode",
        method: "POST",
        headers: {
            "Host": "app.geely.com",
            "x-refresh-token": true,
            "devicesn": 356697505697247,
            "txcookie": "",
            "token": "",
            "appversion": "3.11.1",
            "platform": "Android",
            "cache-control": "no-cache",
            "content-type": "application/json; charset=utf-8",
            "accept-encoding": "gzip",
            "user-agent": "okhttp/4.9.3"
        },
        data: JSON.stringify({ "mobile": mobile, "ticket": ticket, "randStr": randstr, "scene": "login" })
    }
    let { data: result } = await httpRequest(options)
    //console.log(result);
    if (result.code == "success") {
        if (result.data.msg == "success") {
            return { status: true, message: "获取验证码成功", data: { type: 2, data: { txCookie: result.data.txCookie }, captcha: null } }
        } else {
            return { status: false, message: "获取验证码失败", data: null }
        }
    } else { return { status: false, message: "获取验证码失败", data: null } }
}
async function Login_Geely(phone, code, data) {
    let mobile = phone
    let txCookie = data.txCookie
    if (checkParams(mobile, code, txCookie)) {
        let options = {
            url: "https://app.geely.com/api/v1/userCenter/login/useCode",
            method: "POST",
            headers: {
                "Host": "app.geely.com",
                "x-refresh-token": true,
                "devicesn": 356697505697247,
                "txcookie": txCookie,
                "token": "",
                "appversion": "3.11.1",
                "platform": "Android",
                "cache-control": "no-cache",
                "content-type": "application/json; charset=utf-8",
                "accept-encoding": "gzip",
                "user-agent": "okhttp/4.9.3"
            },
            data: JSON.stringify(
                { "phone": mobile, "identifyCode": code })
        }
        let { data: result } = await httpRequest(options)
        //console.log(result);
        if (result.code == "success") {
            return {
                status: true, message: "登录成功", data:
                    { "variable": "WoolWeb_Geely", value: `token=${result.data.token}&txCookie=${result.data.txCookie}&refreshToken=${result.data.refreshToken}` }
            }
        } else {
            return { status: false, message: result.message, data: null }
        }
    } else {
        return { status: false, message: "缺少参数", data: null }
    }
}