<template>
    <div>
        <span>管理员 - 登录/注册</span>
        <el-input type="text" v-model="adminUsername" placeholder="用户名" />
        <br>
        <el-input type="password" v-model="adminPassword" placeholder="密码" />
        <br>
        <el-button @click="login">登录</el-button>
        <el-button @click="register">注册</el-button>
        <dia-log :parentDialogVisible="store.dialog.status" :parentDialogString="store.dialog.message" />
    </div>
</template>
<script setup>
import diaLog from "../components/Message.vue"
import { ref, onBeforeMount, onMounted, watch } from "vue"
import { useCounterStore } from "../stores/counter";
import { Login_Admin,Register_Admin } from "../assets/Request"
import { useRouter } from 'vue-router'
const router = useRouter()
const store = useCounterStore()
function showDialog(message) {
    store.setDiaLog(true, message)
};
async function register() {
    console.log(store.admin.username, store.admin.password);
    let result = await Register_Admin(store.admin.username, store.admin.password)
    if (result.status == true) {
        showDialog(result.message)
    } else {
        showDialog(result.message)
    }
}
async function login() {
    let result = await Login_Admin(store.admin.username, store.admin.password)
    if (result.status == true) {
        showDialog(result.message)
        localStorage.setItem("WoolWebAdminToken", result.data.token)
        router.push('/Admin')
    } else {
        showDialog(result.message)
    }
}

let adminUsername = ref("")
let adminPassword = ref("")
watch(() => [adminUsername.value, adminPassword.value], (newVal) => {
    store.set_Admin(newVal[0], newVal[1])
})
</script>
<style scoped></style>