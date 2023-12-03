<template>
    <div>
    </div>
</template>
<script setup>
import { useCounterStore } from '../stores/counter'
import { onMounted } from "vue"
const store = useCounterStore()
// 定义回调函数
onMounted(() => {

    function callback(res) {
        // 第一个参数传入回调结果，结果如下：
        // ret         Int       验证结果，0：验证成功。2：用户主动关闭验证码。
        // ticket      String    验证成功的票据，当且仅当 ret = 0 时 ticket 有值。
        // CaptchaAppId       String    验证码应用ID。
        // bizState    Any       自定义透传参数。
        // randstr     String    本次验证的随机串，后续票据校验时需传递该参数。
        //console.log('callback:', res);




        // res（用户主动关闭验证码）= {ret: 2, ticket: null}
        // res（验证成功） = {ret: 0, ticket: "String", randstr: "String"}
        // res（请求验证码发生错误，验证码自动返回terror_前缀的容灾票据） = {ret: 0, ticket: "String", randstr: "String",  errorCode: Number, errorMessage: "String"}
        // 此处代码仅为验证结果的展示示例，真实业务接入，建议基于ticket和errorCode情况做不同的业务处理
        if (res.ret === 0) {
            console.log(`腾讯滑块验证通过`);
            store.set_captcha_success({
                type: "TencentCaptcha", success: {
                    ticket: res.ticket,
                    randstr: res.randstr
                }
            })
            // 复制结果至剪切板
            //var str = '【randstr】->【' + res.randstr + '】      【ticket】->【' + res.ticket + '】';
            // 获取div标签
            //var resultDiv = document.getElementById("result");

            // 给div标签添加内容
            //resultDiv.innerHTML = str;
            /*var ipt = document.createElement('input');
            ipt.value = str;
            document.body.appendChild(ipt);
            ipt.select();
            document.execCommand("Copy");
            document.body.removeChild(ipt);
            alert('1. 返回结果（randstr、ticket）已复制到剪切板，ctrl+v 查看。2. 打开浏览器控制台，查看完整返回结果。');*/

        }
    }


    // 定义验证码js加载错误处理函数
    function loadErrorCallback() {
        //var appid = appid;
        // 生成容灾票据或自行做其它处理
        /*var ticket = 'terror_1001_' + window.captcha_id + '_' + Math.floor(new Date().getTime() / 1000);
        callback({
            ret: 0,
            randstr: '@' + Math.random().toString(36).substr(2),
            ticket: ticket,
            errorCode: 1001,
            errorMessage: 'jsload_error'
        });*/
    }

    // 定义验证码触发事件

    (function () {
        try {
            // 生成一个验证码对象
            // CaptchaAppId：登录验证码控制台，从【验证管理】页面进行查看。如果未创建过验证，请先新建验证。注意：不可使用客户端类型为小程序的CaptchaAppId，会导致数据统计错误。
            //callback：定义的回调函数
            let captcha = new window.TencentCaptcha(store.TencentCaptcha.init.appid, callback, {});
            // 调用方法，显示验证码
            const TencentCaptchaShow = function () {
                captcha.show();
            }
            store.set_captcha_show({ type: 'TencentCaptcha', show: TencentCaptchaShow })
        } catch (error) {
            // 加载异常，调用验证码js加载错误处理函数
            loadErrorCallback();
        }
    })();
})


</script>
<style scoped></style>