<script lang="ts" setup>
defineProps({
  image: {
    type: String,
    required: true,
  },
})

defineEmits(['remove'])
</script>
<template>
  <div class="uploaded-attachment">
    <img :src="image" alt="attachment" />
    <i
      class="icon-close chat-input__attachment-close"
      @click="$emit('remove')"
    ></i>
  </div>
</template>
