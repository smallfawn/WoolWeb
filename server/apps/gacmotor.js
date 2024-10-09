const { httpRequest } = require("../utils/httpRequest")
const {checkParams} = require("../utils/checkParams")
const appVersion = "5.1.12"
async function Login_GacmotorApp(phone, code) {
    let mobile = phone
    if (checkParams(mobile, code)) {
        let { Crypto_MD5 } = require("../utils/crypto")
        let { randomString } = require("../utils/utils")
        let timestamp1 = new Date().getTime();
        let timestamp2 = new Date().getTime();
        let nonce = Math.floor(100000 + Math.random() * 900000);
        let appid = `8c4131ff-e326-43ea-b333-decb23936673`
        let key = `46856407-b211-4a10-9cb2-5a9b94361614`
        let sig = Crypto_MD5(`${timestamp1}${nonce}${appid}${key}`)
        let apiSignKey = `a361588rt20dpol`
        let apiSign = (Crypto_MD5(`${timestamp2}${apiSignKey}`)).toUpperCase()
        let deviceCode = randomString(16)
        let registrationID = randomString(19)
        let options = {
            url: `https://next.gacmotor.com/app/app-api/login/loginBySms`,
            method: `POST`,
            headers: {
                "Accept": "application/json",
                "deviceCode": deviceCode,
                "current-time": timestamp2,
                "deviceId": registrationID,
                "version": appVersion,
                "nonce": nonce,
                "sig": sig,
                "platformNo": "Android",
                "osVersion": 10,
                "operateSystem": "android",
                "appId": appid,
                "registrationID": registrationID,
                "api-sign": apiSign,
                "deviceModel": "MI 8 Lite",
                "timestamp": timestamp1,
                "Content-Type": "application/json; charset=UTF-8",
                "Host": "next.gacmotor.com",
                "Connection": "Keep-Alive",
                "Accept-Encoding": "gzip",
                "User-Agent": "okhttp/4.8.1"
            },
            data: JSON.stringify({ "mobilePhone": `${mobile}`, "registrationId": registrationID, "smsCode": `${code}` })
        }
        //console.log(options);
        let { data: result } = await httpRequest(options)
        //console.log(result);
        if (result.resultCode == "0") {
            return { status: true, message: "登录成功", data: { "variable": "WoolWeb_GacmotorApp", "value": `accessToken=${result.data.accessToken}&refreshToken=${result.data.refreshToken}` } }
        } else {
            return { status: false, message: "登录失败", data: null }
        }
    } else {
        return { status: false, message: "登录失败", data: null }
    }
}
async function SendSMS_GacmotorApp(phone) {
    let mobile = phone
    if (checkParams(mobile)) {
        let { Crypto_MD5 } = require("../utils/crypto")
        let timestamp1 = new Date().getTime();
        let timestamp2 = new Date().getTime();
        let nonce = Math.floor(100000 + Math.random() * 900000);
        let appid = `8c4131ff-e326-43ea-b333-decb23936673`
        let key = `46856407-b211-4a10-9cb2-5a9b94361614`
        let sig = Crypto_MD5(`${timestamp1}${nonce}${appid}${key}`)
        let apiSignKey = `a361588rt20dpol`
        let apiSign = (Crypto_MD5(`${timestamp2}${apiSignKey}`)).toUpperCase()
        let options = {
            url: `https://next.gacmotor.com/app/app-api/sms/sendSmsCodeV2`,
            method: `POST`,
            headers: {
                "Accept": "application/json",
                "deviceCode": "3cf4cc2a5fcf407a",
                "current-time": timestamp2,
                "deviceId": "1a0018970ba16cd9f17",
                "version": appVersion,
                "nonce": nonce,
                "sig": sig,
                "platformNo": "Android",
                "osVersion": 10,
                "operateSystem": "android",
                "appId": appid,
                "registrationID": "1a0018970ba16cd9f17",
                "api-sign": apiSign,
                "deviceModel": "MI 8 Lite",
                "timestamp": timestamp1,
                "Content-Type": "application/json; charset=UTF-8",
                "Host": "next.gacmotor.com",
                "Connection": "Keep-Alive",
                "Accept-Encoding": "gzip",
                "User-Agent": "okhttp/4.8.1"
            },
            data: JSON.stringify({ "mobile": `${mobile}` })
        }
        let { data: result } = await httpRequest(options)
        //console.log(result);
        if (result.resultCode == "0") {
            return { status: true, message: "获取验证码成功", data: { type: 2, data: null, captcha: null } }
        } else {
            return { status: false, message: "获取验证码失败", data: null }
        }
    } else {
        return { status: false, message: "获取验证码失败", data: null }
    }
}

async function SendSMS_GacmotorH5(phone) {
    const mobile = phone
    if (checkParams(mobile)) {
        let options = {
            url: `https://mall.gacmotor.com/customer-app/customer/oneid/sendMsg/${mobile}`,
            method: "GET",
            headers: {
                "Host": "mall.gacmotor.com",
                "Referer": "https://mall.gacmotor.com/act/answer-activity?id=464",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0",
                "sec-ch-ua": `"Microsoft Edge";v="119", "Chromium";v="119", "Not?A_Brand";v="24"`,
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": `"Windows"`,
                "Accept": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "Connection": "keep-alive",
                "Content-Type": "application/json;charset=utf-8"
            }
        }
        let { data: result } = await httpRequest(options)
        console.log(result);
        if (result.code == "0000") {
            return { status: true, message: "获取验证码成功", data: { type: 2, data: null, captcha: null } }
        } else {
            return { status: false, message: "获取验证码失败", data: null }
        }
    } else {
        return { status: false, message: "获取验证码失败", data: null }
    }
}

async function Login_GacmotorH5(phone, code) {
    let mobile = phone
    if (checkParams(mobile, code)) {
        let { Crypto_MD5, JSEncrypt } = require("../utils/crypto")
        let publicKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjGTyMPIG3P+ebXJeZi1fLkqW67JH93gGKZsO5lvv6BVkr/MReBtCDy3VnovY4JUxJJbEj6sfcMoHK0yC3pfDGhuEP3blOQWkwg4IcDSHUhAiZqtQQ34UkZYCTxP1g2fLhR7W/JUf6eA5rNM9l1MJuErS0ijEBtB9IiK6QUlw4lRt+9qe1SuK7oGoai6eyfW7yvPvS9EPIoFxZFzl7GsUFNcPjctMs7Gw4AveS+uM42P2yMGTsSrh9oEUmin+8lOYgxfJYLtHND6Nba/Hzfjxx/yVqcfiCVs9QIoqJXfisy2XDnbiC9vFlM1B45EyhbL8b4DDdnc20VZKnQJD/wM0vwIDAQAB"
        const mobilestr = JSEncrypt(publicKey, `${mobile}`)
        let md5Data = JSON.stringify({ 'mobile': mobilestr, 'mobileCaptcha': `${code}`, 'channel': 'm_channel', 'source': '' })
        let md5Hash = Crypto_MD5(md5Data + `ds890%$`)
        //let deviceCode = generateRandomString(16)
        //let registrationID = generateRandomString(19)
        let options = {
            method: 'POST',
            url: 'https://mall.gacmotor.com/customer-app/customer/oneid/sms/login',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
                Connection: 'keep-alive',
                //'Content-Length': '472',
                'Content-Type': 'application/json;charset=UTF-8',
                //Cookie: 'Hm_lvt_998a970b58c68b11573410ac4bb31c9f=1700452109,1700815736; Hm_lvt_6a0d1dcaf9ddec933029987d0f007ecf=1700452109,1700815736; sensorsdata2015jssdkcross=dfm-enc-{"Va28a6y8_aV":"EturiVtAuAnEru-AIEsrStGgAsAGni-SynHRuHt-EIsREAS-EturiVtAuARESVr","gae28_aV":"","OemO2":{"$ki8r28_8eiggay_2mbeyr_8cOr":"直接流量","$ki8r28_2rieyz_lrcMmeV":"未取到值_直接打开","$ki8r28_ergreere":""},"aVr68a8ar2":"rc3liZ7ku67OV5kgPsGCiskkDskl3qmawFzaWZTlpXLawXPJWZ38wXwJwoKApXkowX3MpFWzBF7qQqKIPqKSBF1hwqyJwXN8wFzaWZTlpXLawXyJQ97k36A=","za28mec_kmfa6_aV":{"6ior":"","Cikbr":""},"$VrCayr_aV":"EturiVtAuAnEru-AIEsrStGgAsAGni-SynHRuHt-EIsREAS-EturiVtAuARESVr"}; xn_dvid_kf_20081=34F98D-91E67A48-7665-AF48-F723-00CA77FE63C6; xn_sid_kf_20081=1700820318411256; HWWAFSESID=0c75a79a4c28eaf693; HWWAFSESTIME=1700822527447',
                Host: 'mall.gacmotor.com',
                Origin: 'https://mall.gacmotor.com',
                Referer: 'https://mall.gacmotor.com/act/answer-activity?id=464',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0',
                'sec-ch-ua': '"Microsoft Edge";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'content-type': 'application/json'
            },
            data: {
                md5Data: md5Data,
                md5Hash: md5Hash
            }
        }
        //console.log(options);
        let { data: result } = await httpRequest(options)
        //console.log(JSON.stringify(result));
        if (result.code == "0000") {
            return { status: true, message: "登录成功", data: { "variable": "WoolWeb_GacmotorH5", "value": `accessToken=${result.data.userInfo.oneIdLoginResVo.token.accessToken}` } }

        } else {
            return { status: false, message: "登录失败", data: null }
        }
    } else {
        return { status: false, message: "登录失败", data: null }
    }
}
async function GetQrCode_Gacmotor() {
    const { getUUID,
        getSdkTicket,
        getAccessToken } = require("../WXAuth/gacmotor")
    async function main() {
        let uuid = await getUUID()
        console.log(uuid);
        if (uuid !== false) {
            return uuid
        } else {
            let sdkTicket = await getSdkTicket()
            console.log(sdkTicket)
            if (sdkTicket !== false) {
                let uuid = await getUUID()
                if (uuid !== false) {
                    return uuid
                }
            } else {
                await getAccessToken()
                let sdkTicket = await getSdkTicket()
                if (sdkTicket !== false) {
                    let uuid = await getUUID()
                    return uuid
                }

            }
        }
    }
    let mainResult = await main()
    return {
        status: true, message: "获取成功", data: { type: `url`, data: `https://open.weixin.qq.com/connect/confirm?uuid=${mainResult}`, value: mainResult, tips: `请使用微信扫码登录` }
    }
}

async function LoginQrCode_Gacmotor(value) {
    //console.log(value);
    console.log(`https://lp.open.weixin.qq.com/connect/l/qrconnect?f=json&uuid=${value}&_=${Date.now()}`);
    let { data: result } = await httpRequest({ url: `https://lp.open.weixin.qq.com/connect/l/qrconnect?f=json&uuid=${value}&_=${Date.now()}` })
    //console.log(result);
    if (result.wx_errcode == "405") {
        let { Crypto_MD5 } = require("../utils/crypto")
        let timestamp1 = new Date().getTime();
        let timestamp2 = new Date().getTime();
        let nonce = Math.floor(100000 + Math.random() * 900000);
        let appid = `8c4131ff-e326-43ea-b333-decb23936673`
        let key = `46856407-b211-4a10-9cb2-5a9b94361614`
        let sig = Crypto_MD5(`${timestamp1}${nonce}${appid}${key}`)
        let apiSignKey = `a361588rt20dpol`
        let apiSign = (Crypto_MD5(`${timestamp2}${apiSignKey}`)).toUpperCase()
        let options = {
            url: `https://next.gacmotor.com/app/app-api/login/loginWithThird`,
            method: `POST`,
            headers: {
                "Accept": "application/json",
                "deviceCode": "3cf4cc2a5fcf407a",
                "current-time": timestamp2,
                "deviceId": "1a0018970ba16cd9f17",
                "version": "5.1.0",
                "nonce": nonce,
                "sig": sig,
                "platformNo": "Android",
                "osVersion": 10,
                "operateSystem": "android",
                "appId": appid,
                "registrationID": "1a0018970ba16cd9f17",
                "api-sign": apiSign,
                "deviceModel": "MI 8 Lite",
                "timestamp": timestamp1,
                "Content-Type": "application/json; charset=UTF-8",
                "Host": "next.gacmotor.com",
                "Connection": "Keep-Alive",
                "Accept-Encoding": "gzip",
                "User-Agent": "okhttp/4.8.1"
            },
            data: JSON.stringify({ "code": `${result.wx_code}`, "registrationID": ``, "thirdPartType": "wechat" })
        }
        let { data: loginResult } = await httpRequest(options)
        if (loginResult.resultCode == "0") {
            return { status: true, message: "登录成功", data: { variable: "WoolWeb_GacmotorQr", value: `access_token=${loginResult.data.accessToken}&refresh_token=${loginResult.data.refreshToken}` } }
        } else {
            console.log(loginResult);
            return { status: false, message: "登录失败", data: null, }

        }
    }

}
module.exports = {
    Login_GacmotorApp, SendSMS_GacmotorApp, SendSMS_GacmotorH5, Login_GacmotorH5,
    GetQrCode_Gacmotor, LoginQrCode_Gacmotor
}