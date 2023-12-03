// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
    state: () => {
        return {
            Notification: {
                status: false,
                message: "",
                title: "",
            },
            Message: {
                status: false,
                message: "",
                type: "success",
            },
            variable: "",
            value: "",
            loginType: '',
            LoginElementId: "",
            Geetest3Captcha: {
                success: {
                    variable: "",
                    seccode: "",
                },
                init: {
                    gt: "",
                    challenge: "",
                },
                show: null,
                status: {
                    show: false,
                    success: false
                },
            },
            Geetest4Captcha: {
                success: {
                },
                show: null,
                init: {
                    captchaId: "",
                },
                status: {
                    show: false,
                    success: false
                },
            },
            appInfo: {},
            username: "",
            password: "",
            TencentCaptcha: {
                success: {
                    ticket: "",
                    randstr: "",
                },
                show: null,
                init: {
                    appid: "",

                },
                status: {
                    show: false,
                    success: false
                },
            },
            YiDunCaptcha: {
                show: null,
                status: {
                    show: false,
                    success: false
                },
                init: {
                    captchaId: "",
                },
            },
            AppName: "",
            CaptchaConfig: {},
            phone: "",
            code: "",
            admin: {
                username: "",
                password: "",
            },
            dialog: {
                status: false,
                message: "",
                dialogStatus: null,
            }
        }
    },
    actions: {
        set_custom(variable, value) {
            this.variable = variable;
            this.value = value;
        },
        set_Notification(options) {
            this.Notification.status = options.status
            this.Notification.message = options.message
            this.Notification.title = options.title

        },
        setDiaLog(status, message) {
            this.dialog.status = status
            this.dialog.message = message
        },
        set_Message(status, message, type = "success") {
            //succeess warning error  //message
            this.Message.status = status
            this.Message.message = message
            this.Message.type = type
        },
        setDiaLogStatus(status) {
            this.dialog.dialogStatus = status
        },
        set_Admin(adminUsername, adminPassword) {
            this.admin.username = adminUsername
            this.admin.password = adminPassword
        },
        set_loginType(type) {
            this.loginType = type
        },
        set_UsernameAndPassword(options) {
            this.username = options.username
            this.password = options.password
        },
        set_MobileAndCode(options) {
            this.phone = options.phone
            this.code = options.code
        },
        set_captcha_show(options) {
            this[options.type].show = options.show
        },
        set_NoCaptcha() {
            this.Geetest3Captcha.show = null
            this.TencentCaptcha.show = null
            this.YiDunCaptcha.show = null
        },
        /**
         * 设置验证码
         */
        set_Captcha(options) {
            this.CaptchaConfig = options
            this.LoginElementId = options.type
            this[options.type].status.show = true
            this[options.type].init = options.config
            this[options.type].status.success = false
        },
        set_captcha_success(options) {
            //设置成功的返回
            this[options.type].success = options.success
            //表示完成
            this[options.type].status.success = true
        },
        set_AppName(newValue) {
            this.AppName = newValue
        },
        set_appInfo(newValue) {
            this.appInfo = newValue
        }
    },
})