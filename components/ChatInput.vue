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
const videoInput = ref<HTMLInputElement>()
const imageInput = ref<HTMLInputElement>()

const uploadedImages = ref<UploadResponse[]>([])
const uploadedVideos = ref<UploadResponse[]>([])

const mediaRecorder = ref<MediaRecorder>()
// const audioChunks = ref<Blob[]>([])
const isRecording = ref(false)
const audioUrl = ref<string>()

const disabledSend = computed(() => {
  if (uploadedImages.value.length > 0) {
    return uploadedImages.value.some((item) => item.isUploading)
  }

  return !value.value && uploadedVideos.value.length === 0 && !audioUrl.value
})

// const uploadPdfClick = () => {
//   videoInput.value?.click()
// }

const uploadImageClick = () => {
  imageInput.value?.click()
}

// const uploadAudioClick = async () => {
//   isRecording.value = true
//   audioUrl.value = ''
//   const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
//   mediaRecorder.value = new MediaRecorder(stream)

//   mediaRecorder.value.ondataavailable = (event) => {
//     audioChunks.value.push(event.data)
//   }

//   mediaRecorder.value.onstop = () => {
//     isRecording.value = false
//     const audioBlob = new Blob(audioChunks.value, { type: 'audio/wav' })
//     audioUrl.value = URL.createObjectURL(audioBlob)
//     audioChunks.value = []
//     console.log('Recording stopped, audio available.')
//   }

//   mediaRecorder.value.start()
// }

const onStopRecording = () => {
  mediaRecorder.value?.stop()
  console.log('Recording stopped.')
}

// TODO: video & audio upload will be implemented later
const UPLOAD_ITEMS = computed(() => [
  // { icon: 'icon-video', text: 'Video', onClick: uploadPdfClick },
  {
    icon: 'icon-image',
    text: 'Image',
    onClick: uploadImageClick,
    disabled: uploadedImages.value.length > 0,
  },
  // {
  //   icon: 'icon-audio',
  //   text: 'Audio',
  //   onClick: uploadAudioClick,
  //   disabled: Boolean(audioUrl.value),
  // },
])

const onSendClick = () => {
  if (!disabledSend.value) {
    emits('send', {
      text: value.value,
      images: uploadedImages.value,
      videos: uploadedVideos.value,
      audio: audioUrl.value,
    })
    value.value = undefined
    uploadedImages.value = []
    uploadedVideos.value = []
    audioUrl.value = ''
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
    Array.from(target.files || []).forEach(async (file) => {
      const id = uuidv4()
      const data: UploadResponse = {
        id,
        filename: '',
        meta: {
          key: 'value',
        },
        uploaded: '',
        requireSignedURLs: false,
        variants: [],
        isUploading: true,
        originalFile: file,
        content: await readFile(file),
        fileType: FileTypeEnum.Image,
      }
      uploadedImages.value.push(data)
      const response = await upload(file)
      const index = uploadedImages.value.findIndex((item) => item.id === id)
      uploadedImages.value[index] = {
        ...uploadedImages.value[index],
        ...response,
        isUploading: false,
      }
    })
  } catch (error) {
    console.error(error)
  }
}

const onVideoChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  try {
    Array.from(target.files || []).forEach(async (file) => {
      const id = uuidv4()
      const data: UploadResponse = {
        id,
        filename: '',
        meta: {
          key: 'value',
        },
        uploaded: '',
        requireSignedURLs: false,
        variants: [],
        isUploading: true,
        originalFile: file,
        content: await readFile(file),
        fileType: FileTypeEnum.Video,
      }
      uploadedVideos.value.push(data)
      const response = await upload(file)
      const index = uploadedVideos.value.findIndex((item) => item.id === id)
      uploadedVideos.value[index] = {
        ...uploadedVideos.value[index],
        ...response,
        isUploading: false,
      }
    })
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="chat-input__wrapper">
    <div v-if="uploadedImages.length > 0" class="chat-input__attachments">
      <uploaded-image
        v-for="(image, index) in uploadedImages"
        :key="image.id"
        :image="image"
        @remove="uploadedImages.splice(index, 1)"
      />
    </div>
    <!-- <div v-if="uploadedVideos.length > 0" class="chat-input__attachments">
      <uploaded-video
        v-for="(video, index) in uploadedVideos"
        :key="video.id"
        :image="video"
        @remove="uploadedVideos.splice(index, 1)"
      />
    </div> -->
    <!-- <div v-if="audioUrl" class="chat-input__attachments">
      <audio id="audioPlayback" controls :src="audioUrl"></audio>
    </div> -->
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
            :class="{
              'chat-input__attach-item': true,
              'chat-input__attach-item--disabled': item.disabled,
            }"
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
        <button
          v-if="isRecording"
          class="chat-input__stop-recording"
          :disabled="!isRecording"
          @click="onStopRecording"
        >
          <i class="icon-stop"></i>
        </button>
        <template v-else>
          <i class="icon-icon chat-input__icon"></i>
          <button
            class="chat-input__send"
            :disabled="disabledSend"
            @click="onSendClick"
          >
            <i class="icon-arrow-up"></i>
          </button>
        </template>
      </div>
      <input
        ref="videoInput"
        type="file"
        accept="video/*"
        style="display: none"
        @change="onVideoChange"
      />
      <input
        ref="imageInput"
        type="file"
        accept="image/*"
        style="display: none"
        @change="onImageChange"
      />
    </div>
  </div>
</template>
<style>
ion-popover {
  --width: 180px;
}
</style>
