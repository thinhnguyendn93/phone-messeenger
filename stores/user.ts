import { defineStore } from 'pinia'
import { persistedState } from '#imports'
import type { PingerPhone, User, UserStore } from '~/types/app'

export const useUserStore = defineStore('user', {
  state: (): UserStore => ({
    user: {
      id: '6728fc87f1f3a97a9fc76369',
      role: '',
      username: '',
      phoneNumber: '',
      balance: 0,
      pingerPhones: [],
    },
    communications: [],
    currentPingerPhone: {
      _id: '',
      phoneCredentials: {
        'x-install-id': '',
        'x-udid': '',
        'x-source': 'ios',
        'Content-Type': 'application/json',
        'x-os': 'ios,15.7.4',
        'x-gid': '0',
        'x-bg': '0',
        Authorization: '',
        'X-Rest-Method': 'POST',
        'x-client': '',
      },
      messageCredentials: {
        'x-udid': '',
        'x-install-id': '',
        'x-source': 'ios',
        'Content-Type': 'application/json',
        'x-os': 'ios,15.7.4',
        'x-gid': '0',
        'x-bg': '0',
        Authorization: '',
        'X-Rest-Method': 'POST',
        'x-client': '',
      },
      createdAt: '',
      isUsingBy: '',
      isPhoneServiceCreated: false,
      lastUpdated: '',
      __v: 0,
      email: '',
      name: '',
      phoneNumber: '',
    },
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
    getCurrentPingerPhone() {
      return this.currentPingerPhone
    },
  },
})
