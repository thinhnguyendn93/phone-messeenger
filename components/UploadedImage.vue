<script lang="ts" setup>
import type { UploadResponse } from '~/types/app'

defineProps({
  image: {
    type: Object as PropType<UploadResponse>,
    required: true,
  },
})

defineEmits(['remove'])
</script>
<template>
  <div class="uploaded-image">
    <img :src="image.content" alt="attachment image" />
    <loading-spin v-if="image.isUploading" />
    <i
      v-else
      class="icon-close chat-input__attachment-close"
      @click="$emit('remove')"
    ></i>
  </div>
</template>
