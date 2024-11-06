<script lang="ts" setup>
import { definePageMeta } from '#imports'
import { useUserServices } from '~/services/use-user-services'
import { formatTime, formatDate } from '~/utils/helper'
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const route = useRoute()
const { error } = useToast()
const { fetchUserConversations, fetchUserInfo } = useUserServices()
const { communications, currentPingerPhone } = storeToRefs(userStore)

const FETCH_CONVERSATION_INTERVAL = 5000

const interval = ref<NodeJS.Timeout>()
const slug = route.params.slug
const isLoading = ref(false)

definePageMeta({
  pageTransition: {
    mode: 'default',
  },
})

onMounted(async () => {
  try {
    isLoading.value = true
    userStore.$reset()
    userStore.setUserId(slug as string)
    await fetchUserInfo()
  } catch {
    error('User not found')
  } finally {
    isLoading.value = false
  }
  clearInterval(interval.value)
  interval.value = setInterval(() => {
    fetchUserConversations(currentPingerPhone.value)
  }, FETCH_CONVERSATION_INTERVAL)
})

onUnmounted(() => {
  clearInterval(interval.value)
})

const selectedCommunicationIndex = ref(0)
const isComposingNew = ref(false)

const selectedCommunication = computed(() => {
  const result = communications.value[selectedCommunicationIndex.value]
  if (!result) return null
  let lastMessageDate = ''
  result.messages.sort(
    (a, b) =>
      new Date(a.timeCreated).getTime() - new Date(b.timeCreated).getTime(),
  )

  result.messages.forEach((message) => {
    const messageDate = formatDate(message.timeCreated)
    if (messageDate !== lastMessageDate) {
      message.showDate = true
      lastMessageDate = messageDate
    }
  })

  return result
})

const handleItemClick = (index: number) => {
  selectedCommunicationIndex.value = index
  isComposingNew.value = false
}

const onComposeClick = () => {
  isComposingNew.value = true
  selectedCommunicationIndex.value = -1
}

const onConversationCreated = () => {
  selectedCommunicationIndex.value = communications.value.length - 1
  isComposingNew.value = false
}
</script>

<template>
  <div class="home">
    <div v-if="isLoading" class="home__loading">
      <svg
        aria-hidden="true"
        class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    </div>
    <div class="home__left-content">
      <div class="conversation">
        <div class="conversation__header">
          <h1>Inbox</h1>
          <ion-button fill="clear" class="conversation__action"
            >Edit</ion-button
          >
        </div>
        <div class="conversation__content">
          <ion-content>
            <ion-list>
              <ion-item
                v-for="(item, index) in communications"
                :key="index"
                :class="{
                  conversation__conversation: true,
                  'conversation__conversation--selected':
                    index === selectedCommunicationIndex,
                }"
                @click="handleItemClick(index)"
              >
                <ion-avatar slot="start">
                  <img src="/default-avatar.png" alt="avatar" />
                </ion-avatar>
                <ion-label>
                  <div class="messages">
                    <div class="messages__info">
                      <h2>{{ item.to.map((x) => x.name).join(', ') }}</h2>
                      <p>{{ item.messages[0]?.text }}</p>
                    </div>
                    <div class="messages__time">
                      <p>{{ formatTime(item.timeCreated) }}</p>
                    </div>
                  </div>
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-content>
        </div>
      </div>
    </div>
    <div class="home__right-content">
      <div class="communications">
        <div class="communications__header">
          <button class="communications__action" @click="onComposeClick">
            Compose
          </button>
        </div>
        <compose-conversation
          v-if="isComposingNew"
          @create-conversation="onConversationCreated"
        />
        <phone-conversation
          v-if="selectedCommunication && !isComposingNew"
          :key="selectedCommunicationIndex"
          :conversation="selectedCommunication"
        />
      </div>
    </div>
  </div>
</template>
<style>
ion-toast {
  --width: 300px;
}
</style>
