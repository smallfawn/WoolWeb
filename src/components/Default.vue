<script setup>
import { ref, onBeforeMount, onMounted, watch } from "vue"
import { appsApi, sendSMSRequest, getWeb, up, loginRequest, valueApi, qrcodeGetApi, qrcodeLoginApi } from "../assets/Request"
import Geetest3Captcha from "./Geetest3Captcha.vue";
import TencentCaptcha from "./TencentCaptcha.vue";
import YiDunCapacha from "./YiDunCapacha.vue";
import { useCounterStore } from "../stores/counter";
import { setCaptcha } from "../assets/Captcha";
import Notification from "./Notification.vue";
//import { useRouter } from 'vue-router';
import DiaLog from "./DiaLog.vue";
import Message from "./Message.vue";
import QRCode from 'qrcode'
import { testPhoneNumber } from "../assets/Utils"
let isUpdate = ref(true)
let remark = ref("")
watch(isUpdate, (newVal, oldVal) => {
  console.log(newVal);
})
let customValueTestText = ref(`格式校验中`)
let isDisabled = ref(false);
const store = useCounterStore()
//const router = useRouter();
let sendSMSText = ref(`发送验证码`)
let sendSMSTime = ref(0)
let testTips = ref("")
let appList = ref([])
let username = ref('');
let password = ref('');
let phone = ref('');
let code = ref("")
let app = ref("")
let AppListResult = ref("")
let customValueUpdateConfig = ref({})
let variable = ref("")
let value = ref("")
let valueAppList = ref([])
let qrCodeImage = ref('')
let qrstatus = ref(true)
let tips = ref('')
let qrcodeValue = ref('')
let selectDefault = ref(`APP`)
let selectedMethod = async function (type) {
  store.set_loginType(type)
  //如果是自定义上传则不需要从总控获取APPLIST 而是从私有后端获取
  if (store.loginType == "custom") {
    app.value = ""
    valueAppList.value = (await valueApi("list", null)).data
    return
  } else {
    app.value = ""
    //清除默认菜单选项
    appList.value = (await appsApi("list", type)).data
    return
  }

}

async function createQRCODE() {
  if (app.value !== "") {
    let qrcodeResult = await qrcodeGetApi(app.value)
    //console.log(app.value);
    if (qrcodeResult.data.type == "url") {
      getQRCode(qrcodeResult.data.data)
      qrcodeValue.value = qrcodeResult.data.value
      tips.value = qrcodeResult.data.tips
    } else if (qrcodeResult.data.type == "base64") {
      qrCodeImage.value = qrcodeResult.data.data
      qrcodeValue.value = qrcodeResult.data.value
      tips.value = qrcodeResult.data.tips
    }
  } else {
    store.set_Message(true, "请先选择App", "error")
  }
}
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
let login = async function () {
  if (app.value == "" || store.appInfo == {}) {
    store.set_Message(true, "请选择对应的App", "error")
  }
  //检测输入框是否为空
  if (store.loginType == 1) {
    if (username.value == "") {
      store.set_Message(true, "请输入账号", "error")
      return
    }
  }
  if (store.loginType == 2) {
    if (phone.value == "") {
      store.set_Message(true, "请输入手机号", "error")
      return
    } else {
      if (testPhoneNumber(store.phone) !== true) {
        store.set_Message(true, "请输入正确的手机号", "error")
        return
      }
    }
  }
  if (store.loginType == "custom") {
    /*if ( !== null)
      let regexp = new RegExp("patternString");*/
    let upResult = await up(store.loginType, customValueUpdateConfig.value.variable, value.value, remark.value, customValueUpdateConfig.value.envSplitor)
    if (upResult.status == true) {
      store.set_Message(true, upResult.message, "success")
    } else {
      store.set_Message(true, upResult.message, "error")
    }
  } else if (store.loginType == 3) {
    let result = await qrcodeLoginApi(app.value, qrcodeValue.value)
    //console.log(result);
    if (result.status == true) {
      store.setDiaLog(true, `获取变量成功${JSON.stringify(result.data.value)}`)
    } else {
      store.set_Message(true, result.message, "error")
    }
    if (isUpdate.value == true) {
      console.log("YES 上传青龙");
      let upResult = await up(store.loginType, result.data.variable, result.data.value, remark.value)
      if (upResult.status == true) {
        store.set_Message(true, upResult.message, "success")
      } else {
        store.set_Message(true, upResult.message, "error")
      }
    }
  } else {
    //判断总控返回是否正常
    if (store.appInfo == null || store.appInfo == undefined) {
      return
    }
    let loginResult
    let request_body = new Object()
    Object.assign(request_body, { app: app.value })
    //console.log(store.appInfo.type);
    if (store.appInfo.type == 1) {
      let defaultBody = ["username", "password"]
      for (let key of defaultBody) {
        request_body[key] = store[key]
      }
    } else if (store.appInfo.type == 2) {
      let defaultBody = ["phone", "code"]
      for (let key of defaultBody) {
        request_body[key] = store[key]
      }
    }
    if (store.appInfo.data !== null) {
      Object.assign(request_body, { data: store.appInfo.data })
    } else {
      Object.assign(request_body, { data: null })
    }
    if (store.appInfo.captcha !== null) {
      console.log(`需要验证码`);
      if (store[store.appInfo.captcha.type].show !== null && store[store.appInfo.captcha.type].show !== undefined) {
        console.log(`展示执行验证码`);
        store[store.appInfo.captcha.type].show()
        //解决无需卸载监视的方法
        //1.在创建验证码后给store一个captchaIsSuccess 默认0  验证码成功后 设置为1 然后侦听captchaIsSuccess 如果为1则 构建请求
        //该方法无需根据后端返回null的情况而找不到type从而找不到对应验证码状态的store,但是需要考虑无需验证码时和返回null时
        //还需要考虑 这个方法是否影响全局 比如重新选择APP时 和重新登录账号时 是否重新获取appInfo和captchaIsSuccess
        const watchCaptcha = watch(() => store[store.appInfo.captcha.type].status.success, async (newVal, oldVal) => {
          //构建请求体
          //console.log(request_body);
          Object.assign(request_body, { captcha: store[store.appInfo.captcha.type].success })
          loginResult = await loginRequest(request_body)
          if (loginResult.status == true) {
            store.setDiaLog(true, `获取变量成功${JSON.stringify(loginResult.data.value)}`)
          } else {
            store.set_Message(true, loginResult.message, "error")
          }
          //console.log(loginResult);
          watchCaptcha()
          if (isUpdate.value == true) {
            console.log("YES 上传青龙");
            let upResult = await up(store.loginType, loginResult.data.variable, loginResult.data.value, remark.value)
            if (upResult.status == true) {
              store.set_Message(true, upResult.message, "success")
            } else {
              store.set_Message(true, upResult.message, "error")
            }
          }
          await RefreshAppInfo(2)
        })
      }
    } else {
      Object.assign(request_body, { captcha: null })
      let result = await loginRequest(request_body)
      if (result.status == true) {
        store.setDiaLog(true, `获取变量成功${JSON.stringify(result.data.value)}`)
      } else {
        store.set_Message(true, result.message, "error")
      }
      await RefreshAppInfo(2)
      if (isUpdate.value == true) {
        console.log("YES 上传青龙");
        let upResult = await up(store.loginType, result.data.variable, result.data.value, remark.value)
        if (upResult.status == true) {
          store.set_Message(true, upResult.message, "success")
        } else {
          store.set_Message(true, upResult.message, "error")
        }
      }

    }
  }

}

let sendSMS = async function () {
  if (app.value == "" || store.appInfo == {}) {
    store.set_Message(true, `请选择对应的App`, "error")
    return
  }
  if (testPhoneNumber(store.phone) !== true) {
    store.set_Message(true, `请输入正确的手机号`, "error")
    return
  }
  if (store.appInfo == null || store.appInfo == undefined) {
    return
  }
  let sendSMSRequest_body = new Object()
  Object.assign(sendSMSRequest_body, { app: app.value })
  if (store.appInfo.type == 2) {
    let defaultBody = ["phone"]
    for (let key of defaultBody) {
      sendSMSRequest_body[key] = store[key]
    }
  }
  if (store.appInfo.data !== null) {
    Object.assign(sendSMSRequest_body, { data: store.appInfo.data })
  } else {
    Object.assign(sendSMSRequest_body, { data: null })
  }
  if (store.appInfo.captcha !== null) {
    console.log(`需要验证码`);
    if (store[store.appInfo.captcha.type].show !== null && store[store.appInfo.captcha.type].show !== undefined) {
      //console.log(`展示执行验证码`);
      store[store.appInfo.captcha.type].show()
      /*console.log(store.appInfo.captcha);//验证码配置
      console.log(store.appInfo.captcha.type);
      console.log(store[store.appInfo.captcha.type].status.success);//验证码状态*/
      const watchCaptcha = watch(() => store[store.appInfo.captcha.type].status.success, async (newVal, oldVal) => {
        // 在这里执行相关逻辑
        //console.log(sendSMSRequest_body);
        Object.assign(sendSMSRequest_body, { captcha: store[store.appInfo.captcha.type].success })
        let SendSMSResult = await sendSMSRequest(sendSMSRequest_body)
        //console.log(SendSMSResult);
        store.set_appInfo(SendSMSResult.data)
        if (SendSMSResult.status == true) {
          store.set_Message(true, SendSMSResult.message, "success")
          time60()
        } else {
          store.set_Message(true, SendSMSResult.message, "error")
        }
        if (SendSMSResult.data.captcha == null) {
          watchCaptcha()
          //卸载监视
        }

      })
    }
  } else {
    Object.assign(sendSMSRequest_body, { captcha: null })
    let SendSMSResult = await sendSMSRequest(sendSMSRequest_body)
    store.set_appInfo(SendSMSResult.data)
    if (SendSMSResult.status == true) {
      store.set_Message(true, SendSMSResult.message, "success")
      time60()
    } else {
      store.set_Message(true, SendSMSResult.message, "error")
    }
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
  if (customValueUpdateConfig.value.regular !== null) {
    let regexp = new RegExp(customValueUpdateConfig.value.regular)
    console.log(regexp);
    if (regexp.test(newValue)) {
      customValueTestText.value = `格式校验通过`
    } else {
      customValueTestText.value = `格式校验错误`
    }
  }

})

watch(() => [username.value, password.value], async (newValue, oldValue) => {
  if (oldValue[0] !== "" && newValue[0] == "") {
    //猜测用户可能重新登录
    //重新get app info
    await RefreshAppInfo(2)
  }
  store.set_UsernameAndPassword({
    username: newValue[0],
    password: newValue[1]
  })
})
watch(() => [phone.value, code.value], async (newValue, oldValue) => {
  if (oldValue[0] !== "" && newValue[0] == "") {
    //行为判断
    //猜测用户可能重新登录
    //重新get app info
    await RefreshAppInfo(2)
  }
  if (testPhoneNumber(newValue[0]) == true) {
    store.set_MobileAndCode({
      phone: newValue[0],
      code: newValue[1]
    })
    testTips.value = ``
  } else {
    testTips.value = `请输入正确格式的手机号`
  }
})

watch(app, async (newValue) => {
  if (app.value !== "") {
    store.set_AppName(newValue)
    console.log(`您当前选择${newValue}`);
    let result
    if (store.loginType == "custom") {
      result = await valueApi("info", newValue)
      customValueUpdateConfig.value = result.data
      console.log(customValueUpdateConfig.value);
    } else {
      await RefreshAppInfo(1)
    }

  }

});

async function RefreshAppInfo(times) {
  let appInfoResult = await appsApi("info", app.value)
  if (times == 1) {
    //首次
    if (appInfoResult.data.type == 3) {
    } else {
      store.set_appInfo(appInfoResult.data)
      //console.log(store.appInfo.type);
      if (store.appInfo.captcha !== null) {
        console.log(`Need Captcha`);
        await setCaptcha(store.appInfo.captcha.type)
        store.set_Captcha({ type: store.appInfo.captcha.type, config: store.appInfo.captcha.config })
      } else {
        store.set_NoCaptcha()
        console.log(`No Captcha`);
      }
    }
  } else if (times == 2) {
    //登录后重新获取 //防止验证码失效
    console.log(`重新获取APPINFO`);
    store.set_appInfo(appInfoResult.data)
    if (store.appInfo.captcha !== null) {
      console.log(`Need Captcha`);
      store.set_Captcha({ type: store.appInfo.captcha.type, config: store.appInfo.captcha.config })
    } else {
      store.set_NoCaptcha()
      console.log(`No Captcha`);
    }
  }
}
function time60() {
  isDisabled.value = true
  sendSMSTime.value = 60;
  const timer = setInterval(() => {
    if (sendSMSTime.value > 0) {
      sendSMSTime.value--;
      sendSMSText.value = `${sendSMSTime.value}s`;
    } else {
      isDisabled.value = false
      clearInterval(timer);
      sendSMSText.value = "发送验证码";
    }
  }, 1000);
}
</script>

<template>
  <div class="">
    <div v-if="store.Message.status">
      <Message></Message>
    </div>
    <div v-if="store.Notification.status">
      <Notification></Notification>
    </div>
    <div v-if="store.dialog.status">
      <DiaLog></DiaLog>
    </div>
    <div>
      <el-button type="primary" @click="selectedMethod(`1`)">密码登录</el-button>
      <el-button type="primary" @click="selectedMethod(`2`)">手机登录</el-button>
      <el-button type="primary" @click="selectedMethod(`3`)">扫码登录</el-button>
      <el-button type="primary" @click="selectedMethod(`custom`)">自定义上传</el-button>
    </div>
    <br>
    <div v-if="store.loginType !== 'custom'">
      <el-select v-model="app" class="m-2" :placeholder="selectDefault" size="large">
        <el-option v-for="item in appList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <div v-if="store.loginType == 'custom'">
      <el-select v-model="app" class="m-2" :placeholder="selectDefault" size="large">
        <el-option v-for="item in valueAppList" :value="item" />
      </el-select>
    </div>
    <br>
    <div v-if="store.loginType == 1">
      <el-input type="text" v-model="username" placeholder="用户名" />
      <el-input type="password" v-model="password" placeholder="密码" />
    </div>
    <div v-if="store.loginType == 2">
      <div>{{ testTips }}</div>
      <div class="sendsms-container">
        <el-input type="text" v-model="phone" placeholder="手机号"></el-input>
        <div class="flex-container">
          <el-input type="text" v-model="code" placeholder="验证码"></el-input>
          <el-button type="default" :disabled="isDisabled" @click="sendSMS">{{ sendSMSText }}</el-button>
        </div>
      </div>
    </div>
    <div v-if="store.loginType == 3">
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
    <div v-if="store.loginType == 'custom'">
      <span>变量名</span>
      <br>
      <div v-if="customValueUpdateConfig.regular !== null"><span>{{ customValueTestText }}</span></div>
      <br>
      <span>
        {{ customValueUpdateConfig.test }}
      </span><el-input type="text" v-model="customValueUpdateConfig.variable" disabled placeholder="变量名" />
      <span>变量值</span><el-input type="text" v-model="value" placeholder="变量值" />
    </div>
    <br>
    <div v-if="store.loginType != ``">
      <el-input type="text" v-model="remark" placeholder="备注"></el-input>
      <el-button type="primary" @click="login" :id="store.LoginElementId">登录</el-button>
    </div>
    <br>
    <div>上传变量</div>
    <el-switch v-model="isUpdate" class="ml-2" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
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

<style scoped>
.sendsms-container {
  display: flex;
  flex-direction: column;
}

.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>