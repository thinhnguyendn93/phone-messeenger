<script setup>
import { useUserServices } from './services/use-user-services'

const { fetchUserInfo } = useUserServices()

onMounted(() => {
  fetchUserInfo()
})
</script>
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<style lang="scss">
@import 'assets/styles/index.scss';
@import '/assets/icomoon/style.css';
</style>
