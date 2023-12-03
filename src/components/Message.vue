<template></template>
<script setup>

import { ElMessage } from 'element-plus'
import { useCounterStore } from "../stores/counter";
import { onMounted, watch } from "vue"
const store = useCounterStore();
onMounted(() => {
    ElMessage({
        message: store.Message.message,
        type: store.Message.type,
    })
    store.set_Message(false, "")
})


</script>