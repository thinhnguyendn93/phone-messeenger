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
const audioChunks = ref<Blob[]>([])
const isRecording = ref(false)
const uploadedAudio = ref<UploadResponse>()

const disabledSend = computed(() => {
  if (uploadedImages.value.length > 0) {
    return uploadedImages.value.some((item) => item.isUploading)
  }

  if (uploadedVideos.value.length > 0) {
    return uploadedVideos.value.some((item) => item.isUploading)
  }

  if (uploadedAudio.value) {
    return uploadedAudio.value.isUploading
  }

  return !value.value
})

const onSelectEmoji = (emoji: string) => {
  if (!value.value) {
    value.value = emoji
  } else {
    value.value += emoji
  }
}

const uploadVideoClick = () => {
  videoInput.value?.click()
}

const uploadImageClick = () => {
  imageInput.value?.click()
}

const uploadAudioClick = async () => {
  isRecording.value = true
  uploadedAudio.value = undefined
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  mediaRecorder.value = new MediaRecorder(stream)

  mediaRecorder.value.ondataavailable = (event) => {
    audioChunks.value.push(event.data)
  }

  mediaRecorder.value.onstop = async () => {
    isRecording.value = false

    const audioBlob = new Blob(audioChunks.value, { type: 'audio/wav' })
    const audioFile = new File([audioBlob], `${uuidv4()}.wav`, {
      type: 'audio/wav',
    })
    uploadedAudio.value = {
      id: uuidv4(),
      url: '',
      isUploading: true,
      originalFile: audioFile,
      content: '',
      fileType: FileTypeEnum.Audio,
    }
    audioChunks.value = []
    const response = await upload(audioFile)
    uploadedAudio.value = {
      ...uploadedAudio.value,
      ...response,
      isUploading: false,
    }
    console.log('Recording stopped, audio available.')
  }

  mediaRecorder.value.start()
}

const onStopRecording = () => {
  mediaRecorder.value?.stop()
  console.log('Recording stopped.')
}

// TODO: video & audio upload will be implemented later
const UPLOAD_ITEMS = computed(() => [
  { icon: 'icon-video', text: 'Video', onClick: uploadVideoClick },
  {
    icon: 'icon-image',
    text: 'Image',
    onClick: uploadImageClick,
    disabled: uploadedImages.value.length > 0,
  },
  {
    icon: 'icon-audio',
    text: 'Audio',
    onClick: uploadAudioClick,
    disabled: false,
  },
])

const onSendClick = () => {
  if (!disabledSend.value) {
    emits('send', {
      text: value.value,
      images: uploadedImages.value,
      videos: uploadedVideos.value,
      audio: uploadedAudio.value,
    })
    value.value = undefined
    uploadedImages.value = []
    uploadedVideos.value = []
    uploadedAudio.value = undefined
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
  uploadedImages.value = []
  try {
    Array.from(target.files || []).forEach(async (file) => {
      const id = uuidv4()
      const data: UploadResponse = {
        id,
        url: '',
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
  uploadedVideos.value = []
  try {
    const file = target.files?.[0]
    if (!file) return
    const id = uuidv4()
    const data: UploadResponse = {
      id,
      url: '',
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
    <div v-if="uploadedVideos.length > 0" class="chat-input__attachments">
      <div
        v-for="(video, index) in uploadedVideos"
        :key="index"
        class="uploaded-image p-0"
      >
        <video :src="video.url" alt="video" class="max-h-[120px]" />
        <loading-spin v-if="video.isUploading" />
        <i
          v-else
          class="icon-close chat-input__attachment-close"
          @click="uploadedVideos.splice(index, 1)"
        ></i>
      </div>
      <uploaded-videos
        v-for="(video, index) in uploadedVideos"
        :key="video.id"
        :video="video"
        @remove="uploadedVideos.splice(index, 1)"
      />
    </div>
    <div v-if="uploadedAudio" class="chat-input__attachments">
      <loading-spin v-if="uploadedAudio.isUploading" />
      <audio id="audioPlayback" controls :src="uploadedAudio.url"></audio>
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
          <emoji-popover @select="onSelectEmoji" />
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
<style scoped>
ion-popover {
  --width: 180px;
}

ion-popover::part(backdrop) {
  background-color: transparent;
}
</style>
