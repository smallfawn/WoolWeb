<script setup>
import { ref, onBeforeMount, onMounted, watch } from "vue"
import { AppList, AppInfo, SendSMSRequest, getWeb, up, LoginRequest } from "../assets/Request"
import Geetest3Captcha from "./Geetest3Captcha.vue";
import TencentCaptcha from "./TencentCaptcha.vue";
import YiDunCapacha from "./YiDunCapacha.vue";
import { useCounterStore } from "../stores/counter";
import { setCaptcha } from "../assets/Captcha";
import Notification from "./Notification.vue";
//import { useRouter } from 'vue-router';
import Message from "./Message.vue";
const store = useCounterStore()
//const router = useRouter();

let appList = ref([])
let username = ref('');
let password = ref('');
let mobile = ref('');
let code = ref("")
let app = ref("")
let AppListResult = ref("")


let selectedMethod = async function (type) {
  store.set_LoginType(type)
  AppListResult = await AppList(type)
  appList.value = AppListResult.data
}

let Login = async function () {
  //检测输入框是否为空
  if (store.LoginType == "username") {
    if (username.value == "") {
      store.setDiaLog(true, "请输入账号")
      return
    }
  }
  if (store.LoginType == "mobile") {
    if (mobile.value == "") {
      store.setDiaLog(true, "请输入手机号")
      return
    }
  }
  //判断总控返回是否正常
  if (store.AppInfo == null || store.AppInfo == undefined) {
    return
  }
  let request_body = new Object()
  console.log(store.AppInfo.default);
  for (let i of store.AppInfo.default) {
    request_body[i] = store[i]
  }
  if (store.AppInfo.return !== null) {
    Object.assign(request_body, store.AppInfo.return)
  }
  if (store.AppInfo.captcha !== null) {
    console.log(`需要验证码`);
    if (store[store.AppInfo.captcha.type].show !== null && store[store.AppInfo.captcha.type].show !== undefined) {
      console.log(`展示执行验证码`);
      store[store.AppInfo.captcha.type].show()
      const unwatch = watch(() => store[store.AppInfo.captcha.type].status.success, async (newVal, oldVal) => {
        //构建请求体
        console.log(`验证码通过`);
        console.log(request_body);
        Object.assign(request_body, store[store.AppInfo.captcha.type].success)
        let result = await LoginRequest(app.value, request_body)
        store.set_AppInfo(result.data)
        store.setDiaLog(true, result.message)
        console.log(result);
        unwatch()
      })
    }
  } else {
    let result = await LoginRequest(app.value, request_body)
    store.set_AppInfo(result.data)
    store.setDiaLog(true, result.message)
  }
}

let sendSMS = async function () {
  if (store.AppInfo == null || store.AppInfo == undefined) {
    return
  }
  let SendSMSRequest_body = new Object()
  console.log(`默认参数` + store.AppInfo.default);
  for (let i of store.AppInfo.default) {
    SendSMSRequest_body[i] = store[i]
  }
  if (store.AppInfo.return !== null) {
    Object.assign(SendSMSRequest_body, store.AppInfo.return)
  }
  let unwatch
  if (store.AppInfo.captcha !== null) {
    console.log(`需要验证码`);
    if (store[store.AppInfo.captcha.type].show !== null && store[store.AppInfo.captcha.type].show !== undefined) {
      //console.log(`展示执行验证码`);
      store[store.AppInfo.captcha.type].show()
      //console.log(store.AppInfo.captcha);//验证码配置
      //console.log(store.AppInfo);//APPINFO
      //console.log(store[store.AppInfo.captcha.type].status.success);//验证码状态
      unwatch = watch(() => store[store.AppInfo.captcha.type].status.success, async (newVal, oldVal) => {
        // 在这里执行相关逻辑
        console.log(`验证码通过`);
        console.log(SendSMSRequest_body);
        Object.assign(SendSMSRequest_body, store[store.AppInfo.captcha.type].success)
        let SendSMSResult = await SendSMSRequest(app.value, SendSMSRequest_body)
        console.log(SendSMSResult);
        store.set_AppInfo(SendSMSResult.data)
        store.setDiaLog(true, SendSMSResult.message)
        if (SendSMSResult.data.captcha == null) {
          unwatch()
          //卸载监视
        }
      })
    }
  } else {
    let SendSMSResult = await SendSMSRequest(app.value, SendSMSRequest_body)
    //console.log(SendSMSResult);
    store.set_AppInfo(SendSMSResult.data)
    store.setDiaLog(true, result.message)
  }
}

onMounted(async () => {
  console.log(`Welcome to WoolWeb - 2w project`);
  console.log(new Date())
  console.log('%cAuthor:github.com/smallfawn', 'color: blue')
  let web = await getWeb()
  console.log(web);
  store.set_Notification({ status: true, message: web.notice, title: "公告" })
})
onBeforeMount(async () => {

})


watch(() => [username.value, password.value], (newValue) => {
  store.set_UsernameAndPassword({
    username: newValue[0],
    password: newValue[1]
  })
})
watch(() => [mobile.value, code.value], (newValue) => {
  store.set_MobileAndCode({
    mobile: newValue[0],
    code: newValue[1]
  })
})

watch(app, async (newValue) => {
  store.set_AppName(newValue)
  console.log(`您当前选择${newValue}`);
  let result = await AppInfo(newValue)
  store.set_AppInfo(result.data)
  if (store.AppInfo.captcha !== null) {
    console.log(`需要验证码`);
    await setCaptcha(store.AppInfo.captcha.type)
    store.set_Captcha({ type: store.AppInfo.captcha.type, config: store.AppInfo.captcha.config })
    console.log(store.TencentCaptcha);
  } else {
    store.set_NoCaptcha()
    console.log(`不需要验证码`);
  }
});


</script>

<template>
  <div class="">
    <div v-if="store.Notification.status">
      <Notification></Notification>
    </div>
    <div v-if="store.dialog.status">
      <Message></Message>
    </div>
    <div>
      <el-button type="primary" @click="selectedMethod(`username`)">密码登录</el-button>
      <el-button type="primary" @click="selectedMethod(`mobile`)">手机登录</el-button>
      <el-button type="primary" @click="selectedMethod(`qrcode`)">扫码登录</el-button>
    </div>
    <br>
    <div>
      <el-select v-model="app" class="m-2" placeholder="APP" size="large">
        <el-option v-for="item in appList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <br>
    <div v-if="store.LoginType == 'username'">
      <el-input type="text" v-model="username" placeholder="用户名" />
      <el-input type="password" v-model="password" placeholder="密码" />
    </div>
    <div v-if="store.LoginType == 'mobile'">
      <el-input type="text" v-model="mobile" placeholder="手机号" />
      <el-input type="text" v-model="code" placeholder="验证码" />
      <el-button type="primary" @click="sendSMS">发送验证码</el-button>
    </div>
    <div v-if="store.LoginType == 'qrcode'">
      <el-table v-loading="true" style="width: 100%">
        <el-table-column prop="date" label="Date" width="180" />
      </el-table>
      <el-button type="primary" @click="">获取二位码</el-button>
    </div>
    <br>
    <el-button type="primary" @click="Login()" :id="store.LoginElementId">登录</el-button>
    <br>
    <div v-if="store.Geetest3Captcha.status.show == true">
      <Geetest3Captcha />
    </div>
    <div v-if="store.TencentCaptcha.status.show == true">
      <TencentCaptcha />
    </div>
    <div v-if="store.YiDunCaptcha.status.show == true">
      <YiDunCapacha />
    </div>
  </div>
</template>

<style scoped></style>
