const { checkParams } = require("../utils/checkParams")
const { EncryptAES } = require("../utils/crypto")
const { httpRequest } = require("../utils/httpRequest");
async function SendSMS_CrazyReader(phone) {
    let mobile = phone
    //console.log(mobile);
    mobile = mobile.toString()
    if (checkParams(mobile)) {
        const mobileStr = EncryptAES(mobile, 'xoxmx7fqw9m4ejda')
        //console.log(mobileStr);
        let options = {
            url: `https://ws2.fengduxiaoshuo.com/auth/send_verification?_token=366c9c5a-bc78-4ff8-af52-989e1da28925&_ts=1700204697&_v=1&_sign=`,
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            data: JSON.stringify({ "account_name": mobileStr, "account_type": "com.cootek.auth.phone", "type": "sms", "is_phone_encode": 1 })
        }
        try {
            let { data: result } = await httpRequest(options)
            if (result.result_code == "2000") {
                return { status: true, message: "获取验证码成功", data: { type: 2, data: null, captcha: null } }
            } else {
                return { status: false, message: "获取验证码失败", data: null }
            }
        } catch (error) {
            console.log(`报错`);
            console.log(options);
            return { status: false, message: "获取验证码失败", data: null }
        }

    } else {
        return { status: false, message: "获取验证码失败", data: null }
    }
}
async function Login_CrazyReader(phone, code) {
    let mobile = phone
    if (checkParams(mobile, code)) {
        const mobileStr = EncryptAES(mobile, 'xoxmx7fqw9m4ejda')
        let options = {
            url: `https://ws2.fengduxiaoshuo.com/auth/login?_token=366c9c5a-bc78-4ff8-af52-989e1da28925&_ts=1700204697&_v=1&_sign=`,
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            data: JSON.stringify({ "account_name": mobileStr, "account_group": "com.cootek.crazyreader", "account_type": "com.cootek.auth.phone", "verification": code, "is_phone_encode": 1 })
        }
        let result = await httpRequest(options)
        if (result.data.result_code == "2000") {
            return {
                status: true, message: "登录成功", data: {
                    variable: "WoolWeb_CrazyReader", value: `${result.headers["set-cookie"][0]}`
                }
            }
        } else {
            return { status: false, message: "登录失败", data: null }
        }
    } else {
        return { status: false, message: "登录失败", data: null }
    }
}
module.exports = {
    SendSMS_CrazyReader, Login_CrazyReader
}