<script lang="ts" setup>
import { definePageMeta } from '#imports'
import { formatTime } from '~/utils/helper'

const userStore = useUserStore()
const { communications } = storeToRefs(userStore)

definePageMeta({
  pageTransition: {
    mode: 'default',
  },
})

const selectedCommunicationIndex = ref(0)

const selectedCommunication = computed(() => {
  const result = communications.value[selectedCommunicationIndex.value]
  if (!result) return null
  result.messages.sort(
    (a, b) =>
      new Date(a.timeCreated).getTime() - new Date(b.timeCreated).getTime(),
  )

  return result
})

const handleItemClick = (index: number) => {
  selectedCommunicationIndex.value = index
}
</script>

<template>
  <div class="home">
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
          <button class="communications__action">Compose</button>
        </div>
        <div class="communications__content">
          <div class="communications__messages">
            <ion-content v-if="selectedCommunication">
              <ion-list lines="none">
                <ion-item
                  v-for="message in selectedCommunication?.messages"
                  :key="message.id"
                  class="message"
                >
                  <ion-label>
                    <div class="messages">
                      {{ message.text }}
                    </div>
                  </ion-label>
                </ion-item>
              </ion-list>
            </ion-content>
          </div>
          <div class="communications__footer">
            <chat-input />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
