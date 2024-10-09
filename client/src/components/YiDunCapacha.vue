<template>
    <div id="captcha"></div>
</template>
<script setup>
import { useCounterStore } from '../stores/counter'
const store = useCounterStore()
import { onMounted } from "vue"

onMounted(() => {
    var captchaIns = null
    // 若使用降级方案接入
    // initNECaptcha 替换成 initNECaptchaWithFallback
    window.initNECaptcha({
        //captchaId: store.YiDunCaptcha_captchaId,
        captchaId: store.YiDunCaptcha.init.captchaId,
        element: '#captcha',
        mode: 'popup',
        //width: '320px',
        apiVersion: 2,

        onVerify: (err, data) => {
            // 当验证失败时, 内部会自动 refresh 方法, 无需手动再调用一次
            if (err) return
            // 以下为业务侧逻辑
            console.log(`网易滑块验证通过`);
        }
    }, function onload(instance) {
        captchaIns = instance
    }, function onerror(err) {
        // 初始化失败后触发该函数, err 对象描述当前错误信息
        console.log(err)
    })
    const YiDunCapachaShow = function () {
        captchaIns && captchaIns.verify()
    }
    store.set_captcha_show({ type: "YiDunCapacha", show: YiDunCapachaShow() })
})

</script>
<style scoped></style>