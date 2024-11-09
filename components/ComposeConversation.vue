<script lang="ts" setup>
import { usePhoneServices } from '~/services/use-phone-services'
import type { ChatInputSend } from '~/types/app'

const { sendMessage } = usePhoneServices()

const phones = ref<string[]>([])
const emits = defineEmits(['createConversation'])

const toPhones = computed(() => {
  return phones.value.map((phone) => {
    return {
      name: phone,
      TN: phone.replace(/\D/g, ''),
    }
  })
})

const onSend = async (data: ChatInputSend) => {
  try {
    const response = await sendMessage(toPhones.value, data.text, {
      image: data.images[0]?.url,
      audio: data.audio?.url,
      video: data.videos[0]?.url,
    })
    if (response) {
      emits('createConversation')
    }
  } catch {
    //
  }
}
</script>
<template>
  <div class="communications__content">
    <div class="communications__header">
      <new-conversation-input v-model="phones" />
    </div>
    <div class="communications__messages"></div>
    <div class="communications__footer">
      <chat-input :disabled="toPhones.length == 0" @send="onSend" />
    </div>
  </div>
</template>
