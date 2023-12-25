<template>
    <div>
    </div>
</template>
<script setup>
import { useCounterStore } from '../stores/counter'
import { onMounted } from "vue"
const store = useCounterStore()
// 在setup中定义点击事件处理函数
onMounted(() => {
    //let loginBtn = document.getElementById("Geetest3Captcha");
    window.initGeetest({
        // 省略必须的配置参数
        gt: store.Geetest3Captcha.init.gt,
        challenge: store.Geetest3Captcha.init.challenge,
        //product: 'popup',
        product: 'bind',
        new_captcha: true
    }
        , function (captchaObj) {
            captchaObj.appendTo("#Geetest3Captcha"); //将验证按钮插入到宿主页面中captchaBox元素内
            captchaObj.onReady(function () {
                //验证码ready之后才能调用verify方法显示验证码
            }).onSuccess(function () {
                console.log(`极验三滑块验证通过`);
                let result = captchaObj.getValidate();
                store.set_captcha_success({
                    type: "Geetest3Captcha", success: {
                        validate: result.geetest_validate,
                        seccode: result.geetest_seccode,
                        challenge: result.geetest_challenge,

                    }
                })
                //your code

            }).onError(function () {
                //your code
            })
            const Geetest3CaptchaShow = function () {
                captchaObj.verify()
            }
            store.set_captcha_show({ type: "Geetest3Captcha", show: Geetest3CaptchaShow })
        })
})

</script>

<style scoped></style>