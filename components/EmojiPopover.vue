<script lang="ts" setup>
import EmojiPicker from 'vue3-emoji-picker'
import type { Emoji } from '~/types/app'

const isOpen = ref(false)
const event = ref<Event>()
const emits = defineEmits(['select'])

const handleWindowResize = () => {
  isOpen.value = false
}

onMounted(() => {
  window.addEventListener('resize', handleWindowResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleWindowResize)
})

const openPopover = (e: Event) => {
  event.value = e
  isOpen.value = true
}

const onSelectEmoji = (emoji: Emoji) => {
  isOpen.value = false
  emits('select', emoji.i)
}
</script>
<template>
  <div class="emoji-popover">
    <i class="icon-icon emoji-popover__icon" @click="openPopover($event)"></i>
    <ion-popover :event="event" :is-open="isOpen" @did-dismiss="isOpen = false">
      <EmojiPicker @select="onSelectEmoji" />
    </ion-popover>
  </div>
</template>
<style scoped>
ion-popover {
  --width: 280px;
}
ion-popover::part(backdrop) {
  background-color: transparent;
}

.v3-emoji-picker {
  border-radius: 0;
}
</style>
