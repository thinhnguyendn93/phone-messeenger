<script lang="ts" setup>
const value = ref<string>()

const emits = defineEmits(['send'])

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
</script>

<template>
  <div class="chat-input">
    <i class="icon-add"></i>
    <div class="chat-input__text-message" @keypress="handleKeyPress">
      <ion-textarea
        v-model="value"
        placeholder="Text message"
        @keydown="handleKeyPress"
      ></ion-textarea>
      <i class="icon-icon chat-input__icon"></i>
      <button class="chat-input__send" :disabled="!value" @click="onSendClick">
        <i class="icon-arrow-up"></i>
      </button>
    </div>
  </div>
</template>
