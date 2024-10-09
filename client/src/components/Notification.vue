<template>
    <div></div>
</template>
<script setup>
import { ElNotification } from 'element-plus'
import { useCounterStore } from "../stores/counter";
import { onMounted } from "vue"
const store = useCounterStore();
onMounted(() => {
    ElNotification({
        title: store.Notification.title,
        message: store.Notification.message,
    })
})


</script>
<style scoped></style>