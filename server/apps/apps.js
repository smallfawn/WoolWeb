const { httpRequest } = require("../utils/httpRequest")
const { checkParams } = require("../utils/checkParams")
module.exports = {
    applist,
    appinfo
}
async function applist(type) {
    if (checkParams(type)) {
        if (type == 1) {
            return {
                status: true,
                message: "获取列表成功",
                data: [
                    {
                        value: 'BiliBili',
                        label: '哔哩哔哩',
                    },
                    {
                        value: 'GeegaPD',
                        label: '雷达汽车APP账密',
                    },

                ]
            }
        } else if (type == 2) {
            return {
                status: true,
                message: "获取列表成功",
                data: [
                    {
                        value: 'Geely',
                        label: '吉利汽车',
                    },
                    {
                        value: 'GacmotorApp',
                        label: '广汽传祺App接口(会顶App但会刷新TOKKEN)',
                    },
                    {
                        value: 'GacmotorH5',
                        label: '广汽传祺H5接口(不顶App不会刷新TOKKEN)',
                    },
                    {
                        value: 'CrazyReader',
                        label: '疯读小说(时不时收不到码)',
                    },
                    {
                        value: 'BeiJingEv',
                        label: '北京汽车APP',
                    },
                    {
                        value: 'GeegaSMS',
                        label: '雷达汽车APP短信',
                    },
                ]
            }
        } else if (type == 3) {
            return {
                status: true,
                message: "获取列表成功",
                data: [{
                    value: `GacmotorQr`,
                    label: `广汽传祺QR接口`
                }
                ]
            }
        }
    } else {
        return {
            status: false,
            message: "参数错误",
            data: null
        }
    }
}

async function appinfo(app) {
    if (checkParams(app)) {
        if (app == "BiliBili") {
            let options = {
                url: "https://passport.bilibili.com/x/passport-login/captcha?source=main-fe-header&t=0.0775400585207293",
                method: "GET",
            }
            let { data: result } = await httpRequest(options)
            if (result.code == 0) {
                return {
                    status: true, message: "获取成功", data:
                        { type: 1, data: { token: result.data.token }, captcha: { type: "Geetest3Captcha", config: { challenge: result.data.geetest.challenge, gt: result.data.geetest.gt } } }
                }
            } else {
                return { status: false, message: "获取失败", data: null }

            }
        } else if (app == "Geely") {
            return {
                status: true, message: "获取成功", data: { type: 2, data: null, captcha: { type: "TencentCaptcha", config: { appid: "2042700728" } } }
            }
        } else if (app == "GacmotorApp") {
            return {
                status: true, message: "获取成功", data: { type: 2, data: null, captcha: null }
            }

        } else if (app == "CrazyReader") {
            return {
                status: true, message: "获取成功", data: { type: 2, data: null, captcha: null }
            }
        } else if (app == "GacmotorH5") {
            return {
                status: true, message: "获取成功", data: { type: 2, data: null, captcha: null }
            }
        } else if (app == "BeiJingEv") {
            return {
                status: true, message: "获取成功", data: { type: 2, data: null, captcha: { type: "TencentCaptcha", config: { appid: "190206436" } } }
            }
        } else if (app == "GacmotorQr") {
            //const {GetQrCode_Gacmotor} = require("../apps/gacmotor")
            //let mainResult = await GetQrCode_Gacmotor()
            /*return {
                status: true, message: "获取成功", data: { type: `url`, data: `https://open.weixin.qq.com/connect/confirm?uuid=${mainResult}`, value: mainResult, tips: `请使用微信扫码登录` }
            }*/
            return {
                status: true, message: "获取成功", data: { type: 3, data: null }
            }
        } else if (app == "GeegaSMS") {
            return {
                status: true, message: "获取成功", data: {
                    type: 2, data: null, captcha: {
                        type: "AliCaptcha", config: { appKey: "FFFF0N0000000000AC64", scene: "nc_other_h5" }
                    }
                }
            }
        } else if (app == "GeegaPD") {
            return {
                status: true, message: "获取成功", data: {
                    type: 1, data: null, captcha: {
                        type: "AliCaptcha", config: { appKey: "FFFF0N0000000000AC64", scene: "nc_other_h5" }
                    }
                }
            }
        }
    } else {
        return { status: false, message: "获取失败", data: null }
    }
}
