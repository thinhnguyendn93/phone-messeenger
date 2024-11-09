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
const isLoading = ref(true)
const isOpenConversationContext = ref(false)
const event = ref<Event>()

const onRenameClick = () => {
  console.log('rename')
}

const onDeleteConversationClick = () => {
  console.log('delete')
}

const onBlockNumberClick = () => {
  console.log('block')
}

const onSetTextToneClick = () => {
  console.log('set text tone')
}

const CONVERSATION_OPTIONS = [
  {
    text: 'Rename',
    disabled: false,
    onClick: onRenameClick,
  },
  {
    text: 'Delete Conversation',
    disabled: false,
    onClick: onDeleteConversationClick,
  },
  {
    text: 'Block Number',
    disabled: false,
    onClick: onBlockNumberClick,
  },
  {
    text: 'Set Text Tone',
    disabled: false,
    onClick: onSetTextToneClick,
  },
]

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

const onMoreClick = (e: Event) => {
  e.stopPropagation()
  isOpenConversationContext.value = true
  event.value = e
}

const onItemClicked = (item: any) => {
  item.onClick()
  isOpenConversationContext.value = false
}
</script>

<template>
  <div class="home">
    <loading-spin v-if="isLoading" />
    <ion-popover
      :event="event"
      :is-open="isOpenConversationContext"
      @did-dismiss="isOpenConversationContext = false"
    >
      <ion-list lines="none">
        <div
          v-for="(item, index) in CONVERSATION_OPTIONS"
          :key="index"
          @click="onItemClicked(item)"
        >
          <ion-item button>
            <ion-label>{{ item.text }}</ion-label>
          </ion-item>
        </div>
      </ion-list>
    </ion-popover>
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
                      <div class="messages__description">
                        <p>{{ item.messages[0]?.text }}</p>
                      </div>
                    </div>
                    <div class="messages__time">
                      <p>{{ formatTime(item.timeCreated) }}</p>
                      <i
                        class="icon-more-horizontal"
                        @click="onMoreClick($event)"
                      />
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
<style scoped>
ion-popover {
  --width: 180px;
}
ion-toast {
  --width: 300px;
}

ion-item {
  --background-hover: var(--ion-color-white-smoke);
}

ion-label {
  font-size: 14px !important;
}

.loading {
  margin-top: 60px;
  height: calc(100% - 60px);
}
</style>
