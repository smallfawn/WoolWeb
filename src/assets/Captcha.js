/* 
 WoolWeb Captcha
*/
export {
    setCaptcha,
}
const Captcha_Config = {
    "TencentCaptcha": {
        ScriptUrl: "https://turing.captcha.qcloud.com/TCaptcha.js",
        ElementId: "TencentCaptcha"
    },
    "YiDunCaptcha": {
        ScriptUrl: "https://cstaticdun.126.net/load.min.js",
        ElementId: "YiDunCaptcha"
    },
    "Geetest4Captcha": {
        ScriptUrl: "https://static.geetest.com/v4/gt4.js",
        ElementId: "Geetest4Captcha"
    },
    "Geetest3Captcha": {
        ScriptUrl: "https://static.geetest.com/static/js/gt.0.4.9.js",
        ElementId: "Geetest3Captcha"
    }
}

async function setCaptcha(type) {
    // 判断是否已经引入对应的ScriptUrl
    if (document.querySelector(`script[src="${Captcha_Config[type]["ScriptUrl"]}"]`)) {
        //console.log("JS已存在,无需加载");
        return true
    } else {
        let script = document.createElement("script");
        script.type = "text/javascript";
        script.src = Captcha_Config[type]["ScriptUrl"];
        document.head.appendChild(script);
        let result = await scriptLoadStatus(script);
        return result;
    }
}


function scriptLoadStatus(script) {
    return new Promise((resolve, reject) => {
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            reject(false)
        }
    })
}