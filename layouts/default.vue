<script lang="ts" setup>
const userStore = useUserStore()
const { currentPingerPhone } = storeToRefs(userStore)
const isOpenConversationContext = ref(false)
const event = ref<Event>()

const onRenameClick = () => {
  console.log('rename')
}

const onDeleteConversationClick = () => {
  console.log('delete')
}

const onBlockNumberClick = () => {
  console.log('block')
}

const onSetTextToneClick = () => {
  console.log('set text tone')
}

const OPTIONS = [
  {
    text: 'Mark All Messages as Read',
    disabled: false,
    onClick: onRenameClick,
  },
  {
    divider: true,
  },
  {
    text: 'Settings',
    disabled: false,
    onClick: onDeleteConversationClick,
  },

  {
    text: 'Help',
    disabled: false,
    onClick: onBlockNumberClick,
  },
  {
    text: 'Log Out',
    disabled: false,
    onClick: onSetTextToneClick,
  },
]

const onItemClicked = (item: any) => {
  item.onClick()
  isOpenConversationContext.value = false
}

const onMoreClick = (e: Event) => {
  e.stopPropagation()
  isOpenConversationContext.value = true
  event.value = e
}
</script>
<template>
  <div class="app-layout">
    <div class="header">
      <nuxt-link to="/">
        <img src="/logo.svg" alt="Logo" class="logo" />
      </nuxt-link>
      <div class="header__right">
        <h1>{{ currentPingerPhone?.phoneNumber }}</h1>
        <i class="icon-arrow-down" @click="onMoreClick($event)"></i>
      </div>
    </div>
    <div class="content">
      <slot />
    </div>
    <ion-popover
      :event="event"
      :is-open="isOpenConversationContext"
      @did-dismiss="isOpenConversationContext = false"
    >
      <ion-list lines="none">
        <ion-item button>
          <ion-label>
            <ion-toggle>Desktop Notifications</ion-toggle>
          </ion-label>
        </ion-item>
        <template v-for="(item, index) in OPTIONS" :key="index">
          <div v-if="item.divider" class="divider"></div>
          <ion-item v-else button @click="onItemClicked(item)">
            <ion-label>{{ item.text }}</ion-label>
          </ion-item>
        </template>
      </ion-list>
    </ion-popover>
  </div>
</template>
<style lang="scss" scoped>
.divider {
  width: calc(100% - 32px);
  border-top: 1px solid #ccc;
  margin: 0 16px;
}

ion-label {
  font-size: 14px !important;
}

ion-item {
  --background-hover: #f2f2f5;
}
</style>
