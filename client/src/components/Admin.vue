<template>
    <div>
        <div v-if="store.Message.status">
            <Message></Message>
        </div>
        <div v-if="store.dialog.status">
            <Dialog></Dialog>
        </div>
        <el-tabs v-model="activeName" @tab-click="">
            <el-tab-pane label="网站配置" name="web">
                <div>
                    <table>
                        <span>网站名称:</span><el-input v-model="webInit.name"></el-input>
                        <span>网站公告:</span><el-input v-model="webInit.notice"></el-input>
                        <el-button type="primary" @click="set_web">修改</el-button>
                    </table>
                </div>
            </el-tab-pane>
            <el-tab-pane label="青龙配置" name="qinglong">
                <div>
                    <table>
                        <br>
                        <span>青龙Url: 例如http://127.0.0.1:5700</span><el-input v-model="qinglongInit.url"></el-input>
                        <span>青龙应用id: 青龙系统设置 应用设置</span><el-input v-model="qinglongInit.id"></el-input>
                        <span>青龙应用secret: 青龙系统设置 应用设置</span><el-input v-model="qinglongInit.secret"></el-input>
                        <span>青龙版本: 暂时只支持大于版本</span>
                        <el-radio-group v-model="qinglongVersion">
                            <el-radio label="new" size="large">大于>V2.11.X</el-radio>
                            <el-radio label="old" size="large">小于>V2.11.X</el-radio>
                        </el-radio-group>
                        <br>
                        <el-button type="primary" @click="test_qinglong">连通测试</el-button>
                        <el-button type="primary" @click="set_qinglong">修改</el-button>
                    </table>
                </div>
            </el-tab-pane>
            <el-tab-pane label="变量配置" name="value">
                <div>
                    <table>
                        <el-select v-model="app" class="m-2" placeholder="APP" size="large">
                            <el-option v-for="item of applist" :value="item.name" />
                        </el-select>
                        <br>
                        <span>项目昵称</span>
                        <el-input v-model="appName"></el-input>
                        <br>
                        <span>变量名</span>
                        <el-input v-model="appVariable"></el-input>
                        <span>变量值示例</span>
                        <el-input v-model="appTest"></el-input>
                        <span>变量正则</span><span class="red">非必填</span>
                        <el-input v-model="appRegular"></el-input>
                        <div>一对一变量模式</div>
                        <el-switch v-model="OTO" class="ml-2"
                            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
                        <span v-if="OTO == false">请输入多个账号的分隔符</span>
                        <el-input :disabled="OTO == true" v-model="appEnvSplitor"></el-input>
                        <el-button type="primary" @click="update_">保存</el-button>
                    </table>
                </div>
            </el-tab-pane>
        </el-tabs>


    </div>
    <div class="">
        <div class="div-right-bottom">
            当前版本:v1.3.5 最新版本:{{ config.version }}
            <el-button @click="showConfig">查看更新信息
            </el-button>
        </div>
    </div>
</template>
<script setup>
import Message from "./Message.vue";
import { ref, onMounted, watch } from "vue"
import { useCounterStore } from "../stores/counter";
import { adminGet, adminSet, updateValue, testQingLong, configGet } from "../assets/Request"
import { useRouter } from 'vue-router'
import Dialog from "./Dialog.vue";
const router = useRouter()
let OTO = ref(true)
let activeName = ref("web")
let qinglongVersion = ref("new")
let appVariable = ref("")
let appTest = ref("")
let appRegular = ref("")
let appEnvSplitor = ref(null)
const store = useCounterStore()
let webInit = ref({})
let qinglongInit = ref({})
let applist = ref([])
let app = ref("")
let appName = ref("")
let config = ref({})
async function set_qinglong() {
    let result = await adminSet("qinglong", {
        url: qinglongInit.value.url,
        id: qinglongInit.value.id,
        secret: qinglongInit.value.secret,
        version: qinglongVersion.value
    })
    if (result.status == true) {
        store.set_Message(true, result.message, "success")
    } else {
        store.set_Message(true, result.message, "error")
    }
}
async function test_qinglong() {
    let options = {
        url: qinglongInit.value.url,
        id: qinglongInit.value.id,
        secret: qinglongInit.value.secret
    }
    let result = await testQingLong(options)
    console.log(result);
    if (result.status == true) {
        store.set_Message(true, result.message, "success")
    } else {
        store.set_Message(true, result.message, "error")
    }
}

async function update_() {
    let result = await updateValue({
        name: appName.value,
        variable: appVariable.value,
        test: appTest.value,
        regular: appRegular.value,
        envSplitor: appEnvSplitor.value
    })
    if (result.status == true) {
        store.set_Message(true, result.message, "success")
    } else {
        store.set_Message(true, result.message, "error")
    }
}


async function set_web() {
    let result = await adminSet("web", {
        name: webInit.value.name,
        notice: webInit.value.notice
    })
    if (result.status == true) {
        store.set_Message(true, result.message, "success")
    } else {
        store.set_Message(true, result.message, "error")
    }
}

watch(activeName, async (newVal, oldVal) => {
    let result = await adminGet(newVal)
    if (newVal == "web") {
        if (result.status == true) {
            webInit.value.name = result.data.name
            webInit.value.notice = result.data.notice
        }
    } else if (newVal == "qinglong") {
        if (result.status == true) {
            qinglongVersion.value = result.data.version
            qinglongInit.value.url = result.data.url
            qinglongInit.value.id = result.data.id
            qinglongInit.value.secret = result.data.secret
        }
    } else if (newVal == "value") {
        if (result.status == true) {
            applist.value = result.data
        }
    }
})
watch(app, (newVal, oldVal) => {
    for (let i = 0; i < applist.value.length; i++) {
        if (applist.value[i].name == newVal) {
            appName.value = applist.value[i].name
            appEnvSplitor.value = applist.value[i].envSplitor
            appRegular.value = applist.value[i].regular
            appVariable.value = applist.value[i].variable
            appTest.value = applist.value[i].test
            if (appEnvSplitor.value == null) {
                OTO.value = true
            } else {
                OTO.value = false
            }
        }
    }
})
watch(OTO, (newValue, oldValue) => {
    if (newValue == true) {
        appEnvSplitor.value = null
    }
})
onMounted(async () => {
    if (localStorage.getItem("WoolWebAdminToken") == "" || localStorage.getItem("WoolWebAdminToken") == null || localStorage.getItem == undefined) {
        store.set_Message(true, "未登录 即将跳转到登录页面")
        router.push("/Login")
        return
    }
    console.log("AAA");
    let result = await adminGet("web")
    if (result.status == true) {
        webInit.value.name = result.data.name
        webInit.value.notice = result.data.notice
    } else {
        store.set_Message(true, "登录状态失效或文件异常 即将跳转到登录页面")
        router.push("/Login")
        return
    }
    let configResult = await configGet()
    config.value = configResult
})
function showConfig() {
    store.setDiaLog(true, `${config.value.update}`)
}
</script>
<style scoped>
.red {
    color: red;
}

.container {
    position: relative;
}

.div-right-bottom {
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 20px;
}
</style>