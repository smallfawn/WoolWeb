<template>
    <div>
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
                        <span>青龙Url: 例如http://127.0.0.1:5700</span><el-input v-model="qinglongInit.url"></el-input>
                        <span>青龙应用id: 青龙系统设置 应用设置</span><el-input v-model="qinglongInit.id"></el-input>
                        <span>青龙应用secret: 青龙系统设置 应用设置</span><el-input v-model="qinglongInit.secret"></el-input>
                        <span>青龙版本: 暂时只支持大于版本</span>
                        <el-radio-group v-model="qinglongVersion">
                            <el-radio label="new" size="large">大于>V2.11.X</el-radio>
                            <el-radio label="old" size="large">小于>V2.11.X</el-radio>
                        </el-radio-group>
                        <el-button type="primary" @click="set_qinglong">修改</el-button>
                    </table>
                </div>
            </el-tab-pane>
            <el-tab-pane label="变量配置" name="third">
                <div>
                    <span>功能测试中: 暂不可用</span>
                    <table>
                        <span>变量正则:</span>
                        <span>请输入变量名</span>
                        <el-input></el-input>
                        <span>请输入一个账号需要几个变量</span>
                        <el-input></el-input>
                        <span>请输入一个账号几个变量的分隔符</span>
                        <el-input></el-input>
                        <span>请输入多个账号的分隔符</span>
                        <el-input></el-input>
                        <el-button type="primary" @click="">修改</el-button>
                    </table>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script setup>
let activeName = ref("first")
let qinglongVersion = ref("")
let variableRegExp = ref("")
import { ref, onBeforeMount, onMounted, watch } from "vue"
import { useCounterStore } from "../stores/counter";
import { get, set } from "../assets/Request"
async function set_qinglong() {
    let res = await set("qinglong", {
        url: qinglongInit.value.url,
        id: qinglongInit.value.id,
        secret: qinglongInit.value.secret,
        version: qinglongVersion.value
    })
    console.log(res)
}

async function set_web() {
    let res = await set("web", {
        name: webInit.value.name,
        notice: webInit.value.notice
    })
    console.log(res)
}

const store = useCounterStore()
let webInit = ref({})
let qinglongInit = ref({})
onMounted(async () => {
    let qinglong = await get("qinglong")
    let web = await get("web")
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
})
</script>
<style scoped></style>