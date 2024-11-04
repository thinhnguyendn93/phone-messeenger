<script lang="ts" setup>
import type { Communication } from '~/types/app'
import { formatDate, formatTime } from '~/utils/helper'

defineProps({
  conversation: {
    type: Object as PropType<Communication>,
    required: true,
  },
})

const onSend = (text: string) => {
  console.log('Sending message:', text)
  document.getElementById('scroll-content')?.scrollIntoView({
    behavior: 'smooth',
  })
}
</script>
<template>
  <div class="communications__content">
    <div class="communications__header">
      <p class="communications__header-title">
        {{ conversation?.to.map((x) => x.name).join(', ') }}
      </p>
    </div>
    <div class="communications__messages">
      <ion-content v-if="conversation">
        <ion-list lines="none">
          <template v-for="message in conversation.messages" :key="message.id">
            <div v-if="message.showDate" class="date-header text-center my-2">
              <small class="text-muted">{{
                formatDate(message.timeCreated)
              }}</small>
            </div>
            <ion-item>
              <ion-label
                :class="{
                  message: true,
                  'message--received': message.direction === 'in',
                }"
              >
                <div class="message__content">
                  {{ message.text }}
                </div>
              </ion-label>
            </ion-item>
            <div
              :class="{
                'text-xs pl-4': true,
                'text-end pr-4': message.direction === 'out',
              }"
            >
              {{ formatTime(message.timeCreated) }}
            </div>
          </template>
        </ion-list>
        <div id="scroll-content" />
      </ion-content>
    </div>
    <div class="communications__footer">
      <chat-input @send="onSend" />
    </div>
  </div>
</template>
