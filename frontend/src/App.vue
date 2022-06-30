<template>
  <div>测试异步组件打包</div>
  <Test></Test>
</template>


<script setup lang="ts">
import { defineAsyncComponent,shallowRef } from 'vue'

const path = './components/Test.vue'
const components = import.meta.glob('./components/*.vue')
console.log(components)
const Test = components[path]
console.log(Test)


</script>



<style>

</style>
