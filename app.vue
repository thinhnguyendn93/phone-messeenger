<script setup>
import { useMeta } from '~/composables/common/use-meta'
import { MODAL_LOGIN, MODAL_SIGN_UP } from '~/constants'
import { AuthTabEnum } from '~/enums'
import { useModalsStore } from '#lib/stores'

const { layout } = useResponsiveComponent()
const { currentMeta } = useMeta()
const route = useRoute()
const { setOpenAuthModal } = useModalsStore()
const authStore = useAuthStore()
const { fetchAllGames } = useFetchGames()
const { initSocket } = useSocket()
const { checkAndLoginWithToken } = useLoginWithToken()
const SITE_DOMAIN = useRuntimeConfig().public.SITE_DOMAIN

useHttpServer()

onMounted(() => {
  useRegisterAddon()
  checkAndLoginWithToken()
  initSocket()
  fetchAllGames()
  useHttpClient()
})

useSeoMeta({
  title: () => currentMeta.value.meta_title,
  ogTitle: () => currentMeta.value.meta_title,
  description: () => currentMeta.value.meta_description,
  ogDescription: () => currentMeta.value.meta_description,
  ogUrl: () => SITE_DOMAIN + route.fullPath.replace(/^\/+/, ''),
  twitterCard: () => 'summary_large_image',
  twitterDescription: () => currentMeta.value.meta_description,
  twitterTitle: () => currentMeta.value.meta_title,
  keywords: () => currentMeta.value.meta_keywords,
})


watch(
  () => route.query,
  (value) => {
    if (value.modal === MODAL_LOGIN) {
      authStore.setSelectedAuthTab(AuthTabEnum.Login)
      setOpenAuthModal(true)
      return
    }
    if (value.modal === MODAL_SIGN_UP) {
      authStore.setSelectedAuthTab(AuthTabEnum.Register)
      setOpenAuthModal(true)
    }
  },
  { immediate: true },
)
</script>
<template>
  <div>
    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<style lang="scss">
@import '/assets/icomoon/style.css';
@import '/assets/styles/index.scss';
</style>
