import { defineStore } from 'pinia'
import { persistedState } from '#imports'
import type { PingerPhone, User, UserStore } from '~/types/app'

export const useUserStore = defineStore('user', {
  state: (): UserStore => ({
    user: {
      id: '6725f36796311e9560857712',
      role: '',
      username: '',
      phoneNumber: '',
      balance: 0,
      pingerPhones: [],
    },
    communications: [],
  }),
  persist: {
    storage: persistedState.localStorage,
  },
  actions: {
    getUserId() {
      return this.user.id
    },
    setUser(user: User) {
      this.user = user
    },
    setCommunications(communications: any[]) {
      this.communications = communications
    },
    setCurrentPingerPhone(pingerPhone: PingerPhone) {
      this.currentPingerPhone = pingerPhone
    },
  },
})
