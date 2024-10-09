const { httpRequest } = require("../utils/httpRequest")
const { checkParams } = require("../utils/checkParams")
module.exports = {
    SendSMS_BeiJingEv, Login_BeiJingEv
}
async function SendSMS_BeiJingEv(phone, captcha) {
    let mobile = phone
    let ticket = captcha.ticket
    let randstr = captcha.randstr
    function get_headers(method, url, body = "") {
        url = url.replace("https://beijing-gateway-customer.app-prod.bjev.com.cn", "")
        let path = url.split('?')[0]
        let params = url.split('?')[1].split('&').sort().join("").toLowerCase()
        method = method.toUpperCase();
        let timestamp = new Date().getTime()
        const key = `96189e76b405f63f8460367ab2ec74ac`
        let str
        if (method == "POST") {
            str = `${method}${path}ice-auth-appkey:5795393720ice-auth-timestamp:${timestamp}json=${body}${params}${key}`
        } else {
            str = `${method}${path}ice-auth-appkey:5795393720ice-auth-timestamp:${timestamp}${params}${key}`
        }
        const { Crypto_SHA256 } = require("../utils/crypto")
        const sign = Crypto_SHA256(encodeURIComponent(str))
        return {
            "User-Agent": "(Android 10; Xiaomi MI 8 Lite Build/V12.0.1.0.QDTCNXM 3.11.1 135 release bjApp baic-app-android)",
            "versionInfo": "(Android 10; Xiaomi MI 8 Lite Build/V12.0.1.0.QDTCNXM 3.11.1 135 release bjApp baic-app-android)",
            "Cache-Control": "no-cache",
            //"userId": "",
            "appKey": 5795393720,
            "ice-auth-appkey": 5795393720,
            "ice-auth-timestamp": timestamp,
            "ice-auth-sign": sign,
            "Host": "beijing-gateway-customer.app-prod.bjev.com.cn",
            "Connection": "Keep-Alive",
            "Accept-Encoding": "gzip"
        }
    }
    const { uuid } = require("../utils/utils")
    let uuidd = uuid()
    let options = {
        url: `https://beijing-gateway-customer.app-prod.bjev.com.cn/beijing-auth-iam-customer/smsCode/sendLoginCode?phone=${mobile}&ticket=${ticket}&rand=${randstr}&uuid_check=${uuidd}`,
        method: "GET",
    }
    options.headers = get_headers(options.method, options.url)
    let { data: result } = await httpRequest(options)
    //console.log(result);
    if (result.code == 0) {
        return { status: true, message: "获取验证码成功", data: { type: 2, data: null, captcha: null } }
    } else { return { status: false, message: "获取验证码失败", data: null } }
}

async function Login_BeiJingEv(phone, code) {

    let mobile = phone
    function get_headers(method, url, body = "") {
        body = body.replaceAll("&", "").toLowerCase()//BODY=无值删除这个键值对 例如下面
        body = body.replaceAll("referralcode=", "")
        url = url.replace("https://beijing-gateway-customer.app-prod.bjev.com.cn", "")
        let path = url.split('?')[0]
        let params = url.split('?')[1].split('&').sort().join("").toLowerCase()
        method = method.toUpperCase();
        let timestamp = new Date().getTime()
        const key = `96189e76b405f63f8460367ab2ec74ac`
        let str
        if (method == "POST") {
            str = `${method}${path}ice-auth-appkey:5795393720ice-auth-timestamp:${timestamp}${body}${params}${key}`
        } else {
            str = `${method}${path}ice-auth-appkey:5795393720ice-auth-timestamp:${timestamp}${params}${key}`

        }
        //console.log(str);
        const { Crypto_SHA256 } = require("../utils/crypto")
        const sign = Crypto_SHA256(encodeURIComponent(str))
        return {
            "Add-Oauth": true,
            "User-Agent": "(Android 10; Xiaomi MI 8 Lite Build/V12.0.1.0.QDTCNXM 3.11.1 135 release bjApp baic-app-android)",
            "versionInfo": "(Android 10; Xiaomi MI 8 Lite Build/V12.0.1.0.QDTCNXM 3.11.1 135 release bjApp baic-app-android)",
            "Cache-Control": "no-cache",
            "Authorization": "Basic MjAwMDAxOmFwcEAyMDIy",
            "appKey": 5795393720,
            "ice-auth-appkey": 5795393720,
            "ice-auth-timestamp": timestamp,
            "ice-auth-sign": sign,
            "Content-Type": "application/x-www-form-urlencoded",
            //"Content-Length": 145,
            "Host": "beijing-gateway-customer.app-prod.bjev.com.cn",
            "Connection": "Keep-Alive",
            "Accept-Encoding": "gzip"
        }
    }
    const { uuid } = require("../utils/utils")
    let uuidd = uuid()
    let options = {
        url: `https://beijing-gateway-customer.app-prod.bjev.com.cn/beijing-auth-iam-customer/oauth/token?uuid_check=${uuidd}`,
        method: "POST",
        data: `buildVersion=135&code=${code}&device_uid=f3baf8eedf65abca6448065ee6e125c1@1700907484087&grant_type=mobile_sms&referralCode=&username=${mobile}`
    }

    options.headers = get_headers(options.method, options.url, options.data)
    //console.log(options)
    let { data: result } = await httpRequest(options)

    //console.log(result);
    if (result.code == 0) {
        return { status: true, message: "登录成功", data: { "variable": "WoolWeb_BeiJingEv", value: result.data.accessToken } }
    } else { return { status: false, message: "登录失败", data: null } }
}