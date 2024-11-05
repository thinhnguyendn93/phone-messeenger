<script lang="ts" setup>
defineProps({
  modelValue: {
    type: Object as PropType<string[]>,
    required: true,
  },
})

const emits = defineEmits(['update:modelValue'])

const value = ref<string>('')

const phoneNumbers = ref<string[]>([])

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === ',') {
    addPhoneNumber()
    event.preventDefault()
  }

  if (event.key === 'Backspace' && value.value === '') {
    phoneNumbers.value.pop()
    emits('update:modelValue', phoneNumbers.value)
  }
}

const onBlur = () => {
  addPhoneNumber()
}

const onInput = () => {
  const lastChar = value.value.slice(-1)
  if (!/^[0-9,]*$/.test(lastChar)) {
    value.value = value.value.slice(0, -1)
  }
}

const addPhoneNumber = () => {
  if (value.value) {
    phoneNumbers.value.push(formatPhoneNumbers(value.value))
    value.value = ''
    emits('update:modelValue', phoneNumbers.value)
  }
}
</script>

<template>
  <div class="new-conversation-input">
    <ion-chip v-for="(item, index) in phoneNumbers" :key="index">{{
      item
    }}</ion-chip>
    <input
      v-model="value"
      placeholder="Each contact is separated by , character"
      maxlength="11"
      @keydown="onKeyDown($event)"
      @blur="onBlur"
      @input="onInput"
    />
  </div>
</template>
