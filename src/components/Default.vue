<script setup>
import { ref, onBeforeMount, onMounted, watch } from "vue"
import { AppList, AppInfo, SendSMSRequest, getWeb, up, LoginRequest, AppInfoPrivate, AppListPrivate, GetQrCode, LoginQrCode } from "../assets/Request"
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
import QRCode from 'qrcode'
let appList = ref([])
let username = ref('');
let password = ref('');
let mobile = ref('');
let code = ref("")
let app = ref("")
let AppListResult = ref("")
let variable = ref("")
let value = ref("")
let valueAppList = ref([])
let valueTest = ref("")
let valueEnvSplitor = ref("")
const qrCodeImage = ref('')

let selectedMethod = async function (type) {
  store.set_LoginType(type)
  //如果是自定义上传则不需要从总控获取APPLIST 而是从私有后端获取
  if (store.LoginType == "custom") {
    valueAppList.value = (await AppListPrivate()).data
    return
  } else {
    appList.value = (await AppList(type)).data
    return
  }

}
let tips = ref('')
let qrcodeValue = ref('')
async function createQRCODE() {

  let qrcodeResult = await GetQrCode(app.value)
  if (qrcodeResult.data.type == "url") {
    getQRCode(qrcodeResult.data.data)
    qrcodeValue.value = qrcodeResult.data.value
    tips.value = qrcodeResult.data.tips
  }


}
let qrstatus = ref(true)
function getQRCode(text) {
  QRCode.toDataURL(text, { width: 200 })
    .then(url => {
      qrCodeImage.value = url
      qrstatus.value = false
      console.log(`获取二维码成功`);
    })
    .catch(err => {
      console.error(err)
    })
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
  if (store.LoginType == "custom") {
    let result = await up(variable.value, value.value, valueEnvSplitor.value)
    store.setDiaLog(true, result.message)
  } else if (store.LoginType == "qrcode") {
    let result = await LoginQrCode(app.value, qrcodeValue.value)
    console.log(result);
    store.setDiaLog(true, `获取变量成功 点击确认上传到青龙自动化,点击取消不上传\n${JSON.stringify(result.data.value)}`)
    const unwatch1 = watch(() => store.dialog.dialogStatus, async (newVal, oldVal) => {
      if (newVal == true) {
        console.log("YES 上传青龙");
        await up(result.data.variable, result.data.value)
      }
      unwatch1()

    })
  } else {
    //判断总控返回是否正常
    if (store.AppInfo == null || store.AppInfo == undefined) {
      return
    }
    let request_body = new Object()
    //console.log(store.AppInfo.default);
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
        //解决无需卸载监视的方法
        //1.在创建验证码后给store一个captchaIsSuccess 默认0  验证码成功后 设置为1 然后侦听captchaIsSuccess 如果为1则 构建请求
        //该方法无需根据后端返回null的情况而找不到type从而找不到对应验证码状态的store,但是需要考虑无需验证码时和返回null时
        //还需要考虑 这个方法是否影响全局 比如重新选择APP时 和重新登录账号时 是否重新获取APPINFO和captchaIsSuccess
        const unwatch = watch(() => store[store.AppInfo.captcha.type].status.success, async (newVal, oldVal) => {
          //构建请求体
          console.log(`验证码通过`);
          console.log(request_body);
          Object.assign(request_body, store[store.AppInfo.captcha.type].success)
          let result = await LoginRequest(app.value, request_body)
          store.set_AppInfo(result.data)
          store.setDiaLog(true, `获取变量成功 点击确认上传到青龙自动化,点击取消不上传\n${JSON.stringify(result.data.value)}`)
          const unwatch1 = watch(() => store.dialog.dialogStatus, async (newVal, oldVal) => {
            if (newVal == true) {
              console.log("YES 上传青龙");
              await up(result.data.variable, result.data.value)
            }
            unwatch1()

          })
          console.log(result);
          unwatch()
        })
      }
    } else {
      let result = await LoginRequest(app.value, request_body)
      store.setDiaLog(true, `获取变量成功 点击确认上传到青龙自动化,点击取消不上传\n${JSON.stringify(result.data.value)}`)
      const unwatch1 = watch(() => store.dialog.dialogStatus, async (newVal, oldVal) => {
        if (newVal == true) {
          console.log("YES 上传青龙");
          await up(result.data.variable, result.data.value)
        }
        unwatch1()
      })
      console.log(result);
    }
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

  if (store.AppInfo.captcha !== null) {
    console.log(`需要验证码`);
    if (store[store.AppInfo.captcha.type].show !== null && store[store.AppInfo.captcha.type].show !== undefined) {
      //console.log(`展示执行验证码`);
      store[store.AppInfo.captcha.type].show()
      //console.log(store.AppInfo.captcha);//验证码配置
      //console.log(store.AppInfo);//APPINFO
      //console.log(store[store.AppInfo.captcha.type].status.success);//验证码状态
      const unwatch = watch(() => store[store.AppInfo.captcha.type].status.success, async (newVal, oldVal) => {
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
    store.setDiaLog(true, SendSMSResult.message)
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

watch(value, async (newValue, oldValue) => {

  store.set_custom(variable.value, newValue)
})

watch(() => [username.value, password.value], async (newValue, oldValue) => {
  if (oldValue[0] !== "" && newValue[0] == "") {
    //猜测用户可能重新登录
    //重新get app info
    let result = await AppInfo(store.AppName)
    store.set_AppInfo(result.data)
    if (store.AppInfo.captcha !== null) {
      console.log(`需要验证码`);
      await setCaptcha(store.AppInfo.captcha.type)
      store.set_Captcha({ type: store.AppInfo.captcha.type, config: store.AppInfo.captcha.config })
    } else {
      store.set_NoCaptcha()
      console.log(`不需要验证码`);
    }
  }
  store.set_UsernameAndPassword({
    username: newValue[0],
    password: newValue[1]
  })
})
watch(() => [mobile.value, code.value], async (newValue, oldValue) => {
  if (oldValue[0] !== "" && newValue[0] == "") {
    //猜测用户可能重新登录
    //重新get app info
    let result = await AppInfo(store.AppName)
    store.set_AppInfo(result.data)
    if (store.AppInfo.captcha !== null) {
      console.log(`需要验证码`);
      await setCaptcha(store.AppInfo.captcha.type)
      store.set_Captcha({ type: store.AppInfo.captcha.type, config: store.AppInfo.captcha.config })
    } else {
      store.set_NoCaptcha()
      console.log(`不需要验证码`);
    }
  }
  store.set_MobileAndCode({
    mobile: newValue[0],
    code: newValue[1]
  })
})

watch(app, async (newValue) => {
  store.set_AppName(newValue)
  console.log(`您当前选择${newValue}`);
  let result
  if (store.LoginType == "custom") {
    result = await AppInfoPrivate(newValue)
    valueTest.value = result.data.test
    valueEnvSplitor.value = result.data.envSplitor
    variable.value = result.data.variable
  } else {
    result = await AppInfo(newValue)
    if (result.data.default[0] == "qrcode") {

    } else {
      store.set_AppInfo(result.data)
      if (store.AppInfo.captcha !== null) {
        console.log(`需要验证码`);
        await setCaptcha(store.AppInfo.captcha.type)
        store.set_Captcha({ type: store.AppInfo.captcha.type, config: store.AppInfo.captcha.config })
      } else {
        store.set_NoCaptcha()
        console.log(`不需要验证码`);
      }
    }

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
      <el-button type="primary" @click="selectedMethod(`custom`)">自定义上传</el-button>
    </div>
    <br>
    <div v-if="store.LoginType !== 'custom'">
      <el-select v-model="app" class="m-2" placeholder="APP" size="large">
        <el-option v-for="item in appList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <div v-if="store.LoginType == 'custom'">
      <el-select v-model="app" class="m-2" placeholder="APP" size="large">
        <el-option v-for="item in valueAppList" :value="item" />
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
      {{ tips }}
      <div v-if="qrstatus">
        <el-table v-loading="true" style="width: 100%">
        </el-table>
      </div>
      <div v-else>
        <img :src="qrCodeImage" alt="QR Code" />
      </div>
      <el-button type="primary" @click="createQRCODE">获取/刷新 二维码</el-button>
    </div>
    <div v-if="store.LoginType == 'custom'">
      <span>变量名</span>
      <br>
      <span>示例</span>
      <br>
      <span>
        {{ valueTest }}
      </span><el-input type="text" v-model="variable" disabled placeholder="变量名" />
      <span>变量值</span><el-input type="text" v-model="value" placeholder="变量值" />
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