<script setup>
import { useCounterStore } from "../stores/counter";
const store = useCounterStore();
//let unwatch1 = null
// 确认按钮点击事件
const confirm = () => {
    store.setDiaLogStatus(true);
    store.setDiaLog(false, "")

};

// 取消按钮点击事件
const cancel = () => {
    store.setDiaLogStatus(false)
    store.setDiaLog(false, "")
    /*if (unwatch1) {
        unwatch1()
        unwatch1 = null // 将 unwatch1 置空
    }*/
};
</script>

<template>
    <el-dialog v-model="store.dialog.status" title="Tips" width="40%">
        <span class="dialog-message">{{ store.dialog.message }}</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="confirm">
                    确认
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<style scoped>
.dialog-message {
    display: block;
    overflow: auto;
    max-height: 200px;
    /* 根据实际情况设置最大高度 */
}
</style>