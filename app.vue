<script setup>
import { useUserService } from './services/use-user-service'

const { fetchUserInfo } = useUserService()

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
