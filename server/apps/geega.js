/**
 * 雷达汽车APP
 */

const { checkParams } = require("../utils/checkParams")
const { EncryptAES } = require("../utils/crypto")
const { httpRequest } = require("../utils/httpRequest");
module.exports = {
    SendSMS_Geega,
    Login_Geega,
    UserPassLogin_Geega
}
async function SendSMS_Geega(phone, captcha) {
    let sig = captcha.sig
    let token = captcha.token
    let sessionId = captcha.sessionId
    let options = {
        url: `https://app-api.radar-ev.com/appapi/common/common/sendSmsCode?mobile=${phone}&needCheckSlither=1&sig=${sig}&token=${encodeURIComponent(token)}&sessionId=${sessionId}`,
        method: "GET",
        /* headers: {
             Host: `app-api.radar-ev.com`
         }*/
    }
    let { data: result } = await httpRequest(options)
    //console.log(options);
    //console.log(result);
    if (result.code == 0) {
        return { status: true, message: `获取验证码成功`, data: { type: 2, data: null, captcha: null } }
    } else if (result.code == 1) {
        return { status: false, message: `获取验证码频繁`, data: null }
    } else {
        return { status: false, message: `获取验证码频繁`, data: null }
    }

}
async function Login_Geega(phone, code) {
    let options = {
        url: `https://app-api.radar-ev.com/appapi/auth/oauth/sms`,
        method: "POST",
        headers: {
            "system": "ios",
            "Content-Type": `application/json;charset=utf-8`
        },
        data: JSON.stringify({ "mobile": phone.toString(), "code": code.toString() })
    }
    let { data: result } = await httpRequest(options)
    //console.log(options);
    //console.log(result);
    if (result.code == 0) {
        return { status: true, message: `登录成功`, data: { "variable": "WoolWeb_Geega", "value": `rid=${result.data.rId}#aId=${result.data.aId}` } }
    } else {
        return { status: false, message: `登录失败`, data: null }
    }

}


async function UserPassLogin_Geega(phone, password, captcha) {
    let sig = captcha.sig
    let token = captcha.token
    let sessionId = captcha.sessionId
    let options = {
        url: `https://app-api.radar-ev.com/appapi/auth/oauth/sign/pd`,
        method: "POST",
        headers: {
            "system": "ios",
            "Content-Type": `application/json;charset=utf-8`
        },
        data: JSON.stringify({ "password": password, "sig": sig, "mobile": phone.toString(), "sessionId": sessionId, "token": token })
    }
    let { data: result } = await httpRequest(options)
    //console.log(options);
    console.log(result);
    if (result.code == 0) {
        return { status: true, message: `登录成功`, data: { "variable": "WoolWeb_Geega", "value": `rid=${result.data.rId}#aId=${result.data.aId}` } }
    } else {
        return { status: false, message: `登录失败`, data: null }
    }

}
