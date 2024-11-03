<script lang="ts" setup>
const userStore = useUserStore()
const { currentPingerPhone } = storeToRefs(userStore)
</script>
<template>
  <div class="app-layout">
    <div class="header">
      <img src="/logo.svg" alt="Logo" class="logo" />
      <h1>{{ currentPingerPhone?.phoneNumber }}</h1>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>
<style lang="scss"></style>
