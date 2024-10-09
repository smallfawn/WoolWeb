module.exports = {
    Login_BiliBili
}
const { checkParams } = require("../utils/checkParams")
const { httpRequest } = require("../utils/httpRequest")
async function Login_BiliBili(username, password, captcha, data) {
    let validate = captcha.validate
    let challenge = captcha.challenge
    let token = data.token
    if (checkParams(username, password, token, validate, challenge)) {
        //console.log(`参数校验pass`);
        window = {}
        const { JSEncrypt } = require("../utils/crypto")
        let hash = null
        let key = null
        let encryptPassword = null
        let result = await Get_HashAndKey()
        if (result.code == 0) {
            hash = result.data.hash
            key = result.data.key
            if (hash !== null && key !== null) {
                encryptPassword = JSEncrypt(key, hash + password)
                async function Login(encryptPassword) {
                    let options = {
                        url: `https://passport.bilibili.com/x/passport-login/web/login`,
                        method: "POST",
                        headers: {
                            "Host": "passport.bilibili.com",
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Cookie": "buvid3=91ADAFA1-6517-8094-1082-842F7121C96789757infoc; b_nut=1697700289; i-wanna-go-back=-1; b_ut=7; _uuid=F5FA5D55-3766-E4AD-1010C5-738EAD7D10DB690370infoc; enable_web_push=DISABLE; buvid4=1B38D8B9-6D36-5A99-204D-8FA54377FFE390263-023101915-gsOoSd6xWjkYGxwGBoe4TQ%3D%3D; buvid_fp=aa2d0d9ab04f9940905ae774ea2f4aa1; CURRENT_FNVAL=4048; header_theme_version=CLOSE; rpdid=|(J|)JJJkuYk0J'uYm~)lkuJR; innersign=0; home_feed_column=4; browser_resolution=442-708; bp_video_offset_85653675=855171475206832181; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTgyMTAyMzIsImlhdCI6MTY5Nzk1MDk3MiwicGx0IjotMX0.ZkoHRimtxhE2kCLWEKI-wouslqGtdg-PhWocdUStbEA; bili_ticket_expires=1698210172; PVID=2; b_lsid=871010FA93_18B56102C4D; sid=7t27x9g3",
                            "Origin": "https://www.bilibili.com",
                            "Referer": "https://www.bilibili.com/",
                            "Sec-Ch-Ua": `"Chromium";v="118", "Microsoft Edge";v="118", "Not=A?Brand";v="99"`,
                            "Sec-Ch-Ua-Mobile": "?0",
                            "Sec-Ch-Ua-Platform": `"Windows"`,
                            "Sec-Fetch-Dest": "empty",
                            "Sec-Fetch-Mode": "cors",
                            "Sec-Fetch-Site": "same-site",
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.61"
                        },
                        data: `source=main-fe-header&username=${username}&password=${encodeURIComponent(encryptPassword)}&validate=${validate}&token=${token}&seccode=${encodeURIComponent(validate) + `|jordan`}&challenge=${challenge}`
                    }
                    //console.log(options);
                    let { data: result } = await httpRequest(options)
                    return result
                }
                let loginResult = await Login(encryptPassword)
                if (loginResult.code == 0) {
                    if (loginResult.data.status == 0) {//2风险
                        //登录成功 分割url
                        let url = loginResult.data.url
                        const dedeUserID = url.match(/DedeUserID=([^&]*)/)[1];
                        const dedeUserID__ckMd5 = url.match(/DedeUserID__ckMd5=([^&]*)/)[1];
                        const expires = url.match(/Expires=([^&]*)/)[1];
                        const sessData = url.match(/SESSDATA=([^&]*)/)[1];
                        const bili_jct = url.match(/bili_jct=([^&]*)/)[1];
                        return {
                            status: true, message: "登录成功", data: { "variable": `WoolWeb_BiliBili`, value: `DedeUserID:${dedeUserID};DedeUserID__ckMd5:${dedeUserID__ckMd5};Expires:${expires};SESSDATA:${sessData};bili_jct:${bili_jct}&refresh_token${result.data.refresh_token}` }
                        }
                    } else if (loginResult.data.status == 2) {
                        //自行过验证
                        return {
                            status: false, message: "登录风控", data: { url: loginResult.data.url }
                        }
                    } else {
                        console.log(loginResult);
                        return {
                            status: false, message: "登录失败", data: null
                        }
                    }
                } else {
                    console.log(`登录` + JSON.stringify(loginResult));
                    if (result.code == "-629") {
                        return {
                            status: false, message: "账号密码错误", data: null
                        }
                    } else {
                        return {
                            status: false, message: "登录失败", data: result.message
                        }
                    }

                }
            } else {
                return {
                    status: false, message: "登录失败", data: null
                }
            }
        } else {
            console.log("获取KEY" + result);
            return {
                status: false, message: "登录失败", data: null
            }
        }
    } else {
        console.log(username, password, token, validate, challenge)
        return {
            status: false, message: "登录失败", data: null
        }
    }



}
async function Get_HashAndKey() {
    let options = {
        url: `https://passport.bilibili.com/x/passport-login/web/key?_=${new Date().getTime()}`,
        method: "GET",
    }
    let { data: result } = await httpRequest(options)
    return result
}
