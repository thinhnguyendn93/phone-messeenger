<script lang="ts" setup>
import { FileTypeEnum } from '~/enums/app'
import type { UploadResponse } from '~/types/app'

const { upload } = useUpload()

const props = defineProps({
  disabled: Boolean,
})
const value = ref<string>()

const emits = defineEmits(['send'])
const isOpenAttachPopover = ref(false)
const event = ref<Event>()
const pdfInput = ref<HTMLInputElement>()
const imageInput = ref<HTMLInputElement>()
const audioInput = ref<HTMLInputElement>()

const uploadedImages = ref<UploadResponse[]>([])
const uploadedPdfs = ref<UploadResponse[]>([])
const uploadedAudios = ref<UploadResponse[]>([])

const disabledSend = computed(
  () =>
    !value.value &&
    uploadedImages.value.length === 0 &&
    uploadedPdfs.value.length === 0,
)

const uploadPdfClick = () => {
  pdfInput.value?.click()
}

const uploadImageClick = () => {
  imageInput.value?.click()
}

const uploadAudioClick = () => {
  audioInput.value?.click()
}

const UPLOAD_ITEMS = [
  { icon: 'icon-pdf', text: 'PDF', onClick: uploadPdfClick },
  { icon: 'icon-image', text: 'Image', onClick: uploadImageClick },
  { icon: 'icon-audio', text: 'Audio', onClick: uploadAudioClick },
]

const onSendClick = () => {
  if (!disabledSend.value) {
    emits('send', value.value)
    value.value = undefined
  }
}

const handleKeyPress = (event: any) => {
  if (event.key === 'Enter' && !disabledSend.value) {
    onSendClick()
    event.preventDefault()
  }
}

const openPopover = (e: Event) => {
  if (props.disabled) return

  event.value = e
  isOpenAttachPopover.value = true
}

const clickAttachmentItem = (item: any) => {
  item.onClick()
  isOpenAttachPopover.value = false
}

const onImageChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  try {
    const file = target.files?.[0]
    if (file) {
      const response = await upload(file)
      response.originalFile = file
      response.fileType = FileTypeEnum.Image
      uploadedImages.value.push(response)
    }
  } catch (error) {
    console.error(error)
  }
}

const onAudioChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  try {
    const file = target.files?.[0]
    if (file) {
      const response = await upload(file)
      response.originalFile = file
      response.fileType = FileTypeEnum.Audio
      uploadedAudios.value.push(response)
    }
  } catch (error) {
    console.error(error)
  }
}

const onPDFChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  try {
    const file = target.files?.[0]
    if (file) {
      const response = await upload(file)
      response.originalFile = file
      response.fileType = FileTypeEnum.Pdf
      uploadedPdfs.value.push(response)
    }
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="chat-input__wrapper">
    <div v-if="uploadedImages.length > 0" class="chat-input__attachments">
      <uploaded-attachment
        v-for="(image, index) in uploadedImages"
        :key="index"
        :image="image.variants[0]"
        @remove="uploadedImages.splice(index, 1)"
      />
    </div>
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
            @click="clickAttachmentItem(item)"
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
        <button
          class="chat-input__send"
          :disabled="disabledSend"
          @click="onSendClick"
        >
          <i class="icon-arrow-up"></i>
        </button>
      </div>
      <input
        ref="pdfInput"
        type="file"
        accept="application/pdf"
        style="display: none"
        @change="onPDFChange"
      />
      <input
        ref="imageInput"
        type="file"
        accept="image/*"
        style="display: none"
        @change="onImageChange"
      />
      <input
        ref="audioInput"
        type="file"
        accept="audio/*"
        style="display: none"
        @change="onAudioChange"
      />
    </div>
  </div>
</template>
<style>
ion-popover {
  --width: 180px;
}
</style>
