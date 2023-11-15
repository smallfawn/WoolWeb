<template></template>
<script setup>
import { useCounterStore } from '../stores/counter'
const store = useCounterStore()
window.initGeetest4({
    captchaId: store.Geetest4Captcha.init.captchaId
}, function (captcha) {
    // captcha为验证码实例
    /*var loginBtn = document.getElementById("Geetest4Captcha");
    loginBtn.addEventListener('click', function () {
        captcha.appendTo("#captcha");// 调用appendTo将验证码插入到页的某一个元素中，这个元素用户可以自定义
    })*/
});
</script>
<style scoped></style>