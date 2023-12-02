<template>
    <div>
        <div v-if="store.dialog.status">
            <Message></Message>
        </div>
        <el-tabs v-model="activeName" @tab-click="">
            <el-tab-pane label="网站配置" name="first">
                <div>
                    <table>
                        <span>网站名称:</span><el-input v-model="webInit.name"></el-input>
                        <span>网站公告:</span><el-input v-model="webInit.notice"></el-input>
                        <el-button type="primary" @click="set_web">修改</el-button>
                    </table>
                </div>
            </el-tab-pane>
            <el-tab-pane label="青龙配置" name="second">
                <div>
                    <table>
                        先连通测试后修改
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
            <el-tab-pane label="变量配置" name="third">
                <div>
                    <span>功能测试中: </span>
                    <table>
                        <span>添加APP</span>
                        <el-input v-model="createApp"></el-input>
                        <el-select v-model="app" class="m-2" placeholder="APP" size="large">
                            <el-option v-for="item in applist" :value="item" />
                        </el-select>
                        <el-button type="primary" @click="create_">添加</el-button>
                        <br>
                        <span>修改以下时请选择APP</span>
                        <br>
                        <span>请输入变量名(必填)</span>
                        <el-input v-model="appVariable"></el-input>
                        <span>请输入变量值示例(默认为空)</span>
                        <el-input v-model="appTest"></el-input>
                        <span>变量正则(留空默认不校验参数)</span>
                        <el-input v-model="appRegular"></el-input>
                        <span>请输入一个账号几个变量的分隔符(留空默认&)=功能复用暂时不用管</span>
                        <el-input v-model="appStrSplitor"></el-input>
                        <span>请输入多个账号的分隔符(留空默认@)</span>
                        <el-input v-model="appEnvSplitor"></el-input>
                        <el-button type="primary" @click="update_">修改</el-button>
                    </table>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script setup>
import Message from "./Message.vue";
import { ref, onMounted, watch } from "vue"
import { useCounterStore } from "../stores/counter";
import { adminGet, adminSet, valueApi, createValue, updateValue, testQingLong } from "../assets/Request"
import { useRouter } from 'vue-router'
const router = useRouter()
let activeName = ref("first")
let qinglongVersion = ref("")
let appVariable = ref("")
let appTest = ref("")
let appRegular = ref("")
let appStrSplitor = ref("")
let appEnvSplitor = ref("")
const store = useCounterStore()
let webInit = ref({})
let qinglongInit = ref({})
let applist = ref([])
let app = ref("")
let createApp = ref("")

async function set_qinglong() {
    let result = await adminSet("qinglong", {
        url: qinglongInit.value.url,
        id: qinglongInit.value.id,
        secret: qinglongInit.value.secret,
        version: qinglongVersion.value
    })
    store.setDiaLog(true, result.message)
}
async function test_qinglong() {
    let options = {
        url: qinglongInit.value.url,
        id: qinglongInit.value.id,
        secret: qinglongInit.value.secret
    }
    let result = await testQingLong(options)
    console.log(result);
    store.setDiaLog(true, result.message)
}
async function create_() {
    let result = await createValue(createApp.value)
    if (result.status == true) {
        applist.value = (await valueApi("list", null)).data
    }
    store.setDiaLog(true, result.message)
}
async function search_() {
    let result = await valueApi("info", app.value)
    if (result.status == true) {
        appVariable.value = result.data.variable
        appTest.value = result.data.test
        appRegular.value = result.data.regular
        appStrSplitor.value = result.data.strSplitor
        appEnvSplitor.value = result.data.envSplitor
    }

}
async function update_() {
    let result = await updateValue(app.value, {
        variable: appVariable.value,
        test: appTest.value,
        regular: appRegular.value,
        strSplitor: appStrSplitor.value,
        envSplitor: appEnvSplitor.value
    })
    store.setDiaLog(true, result.message)
}
async function set_web() {
    let result = await adminSet("web", {
        name: webInit.value.name,
        notice: webInit.value.notice
    })
    store.setDiaLog(true, result.message)
}


watch(app, () => {
    search_()
})
onMounted(async () => {
    if (localStorage.getItem("WoolWebAdminToken") == "" || localStorage.getItem("WoolWebAdminToken") == null || localStorage.getItem == undefined) {
        store.setDiaLog(true, `未登录 即将跳转到登录页面`)
        const unwatch1 = watch(() => store.dialog.dialogStatus, async (newVal, oldVal) => {
            router.push("/Login")
            unwatch1()

        })
    }
    let qinglong = await adminGet("qinglong")
    let web = await adminGet("web")
    if (web.status == true) {
        webInit.value.name = web.data.name
        webInit.value.notice = web.data.notice
    }
    if (qinglong.status == true) {
        qinglongVersion.value = qinglong.data.version
        qinglongInit.value.url = qinglong.data.url
        qinglongInit.value.id = qinglong.data.id
        qinglongInit.value.secret = qinglong.data.secret
    }
    applist.value = (await valueApi("list", null)).data
})
</script>
<style scoped></style>