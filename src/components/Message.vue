<script setup>
import { useCounterStore } from "../stores/counter";
const store = useCounterStore();
// 确认按钮点击事件
const confirm = () => {
    store.setDiaLog(false, "")
};

// 取消按钮点击事件
const cancel = () => {
    store.setDiaLog(false, "")
};
</script>

<template>
    <el-dialog v-model="store.dialog.status" title="Tips" width="30%">
        <span>{{ store.dialog.message }}</span>
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