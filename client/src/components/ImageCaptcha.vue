<template>
    <div>
        <img :src=img alt="">
    </div>
</template>
  
<script setup>
import { ref } from "vue";
import { useCounterStore } from "../stores/counter";
const store = useCounterStore()
let img = ref("")
if (store.imageCaptcha.type == "url") {
    img.value = store.imageCaptcha.data
} else if (store.imageCaptcha.type == "base64") {
    img.value = 'data:image/png;base64,' + store.imageCaptcha.data
}


</script>
  