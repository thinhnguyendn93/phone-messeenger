<script lang="ts" setup>
const props = defineProps({
  disabled: Boolean,
})
const value = ref<string>()

const emits = defineEmits(['send'])
const isOpenAttachPopover = ref(false)
const event = ref<Event>()

const UPLOAD_ITEMS = [
  { icon: 'icon-pdf', text: 'PDF' },
  { icon: 'icon-image', text: 'Image' },
]

const onSendClick = () => {
  if (value.value) {
    emits('send', value.value)
    value.value = undefined
  }
}

const handleKeyPress = (event: any) => {
  if (event.key === 'Enter') {
    onSendClick()
    event.preventDefault()
  }
}

const openPopover = (e: Event) => {
  if (props.disabled) return
  
  event.value = e
  isOpenAttachPopover.value = true
}
</script>

<template>
  <div class="chat-input">
    <ion-popover
      :event="event"
      :is-open="isOpenAttachPopover"
      @did-dismiss="isOpenAttachPopover = false"
    >
      <p class="text-center mt-2">Attachment</p>
      <ion-list lines="none">
        <ion-item
          v-for="(item, index) in UPLOAD_ITEMS"
          :key="index"
          class="chat-input__attach-item"
          @click="isOpenAttachPopover = false"
        >
          <i :class="item.icon"></i>
          <ion-label>{{ item.text }}</ion-label>
        </ion-item>
      </ion-list>
    </ion-popover>
    <i class="icon-add" @click="openPopover($event)"></i>
    <div class="chat-input__text-message" @keypress="handleKeyPress">
      <ion-textarea
        v-model="value"
        placeholder="Text message"
        :disabled="disabled"
        @keydown="handleKeyPress"
      ></ion-textarea>
      <i class="icon-icon chat-input__icon"></i>
      <button class="chat-input__send" :disabled="!value" @click="onSendClick">
        <i class="icon-arrow-up"></i>
      </button>
    </div>
  </div>
</template>
<style>
ion-popover {
  --width: 180px;
}
</style>
