<script lang="ts" setup>
import { usePhoneServices } from '~/services/use-phone-services'
import type { ChatInputSend, Communication } from '~/types/app'
import { formatDate, formatTime } from '~/utils/helper'

const { sendMessage } = usePhoneServices()

const props = defineProps({
  conversation: {
    type: Object as PropType<Communication>,
    required: true,
  },
})

const scrollToLastMessage = () => {
  setTimeout(() => {
    document.getElementById('scroll-content')?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, 200)
}

const onSend = async (data: ChatInputSend) => {
  try {
    await sendMessage(props.conversation.to, data.text, {
      image: data.images[0]?.url,
      audio: data.audio?.url,
      video: data.videos[0]?.url,
    })
    scrollToLastMessage()
  } catch {
    //
  }
}

onMounted(() => {
  scrollToLastMessage()
})
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
                <div class="message__wrapper">
                  <div v-if="message.media?.image" class="message__media">
                    <img :src="message.media.image" alt="media" />
                  </div>
                  <div v-if="message.media?.audio" class="message__media">
                    <audio controls :src="message.media.audio" />
                  </div>
                  <div v-if="message.media?.video" class="message__media">
                    <video controls :src="message.media.video" />
                  </div>
                  <div v-if="message.text" class="message__content">
                    {{ message.text }}
                  </div>
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
