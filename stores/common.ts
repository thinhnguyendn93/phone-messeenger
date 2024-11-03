import { defineStore } from 'pinia'

export const useCommonStore = defineStore('common', {
  state: () => ({
    isClosedSidebar: false,
  }),
  actions: {
    updateClosedSidebar(isClosed: boolean) {
      this.isClosedSidebar = isClosed
    },
  },
  persist: true,
})
