import type { ResponseStatus } from '~/enums/app'

export type BaseTabItem = {
  key?: string
  title: string
  htmlTitle?: string
}

export interface PhoneCredentials {
  'x-install-id': string
  'x-udid': string
  'x-source': string
  'Content-Type': string
  'x-os': string
  'x-gid': string
  'x-bg': string
  Authorization: string
  'X-Rest-Method': string
  'x-client': string
}

export interface PingerPhone {
  _id: string
  phoneCredentials: PhoneCredentials
  messageCredentials: PhoneCredentials
  createdAt: string
  isUsingBy: string
  isPhoneServiceCreated: boolean
  lastUpdated: string
  __v: number
  email: string
  name: string
  phoneNumber: string
}

export type User = {
  id: string
  role: string
  username: string
  phoneNumber?: string
  balance?: number
  pingerPhones?: PingerPhone[]
}

export interface BaseResponse<T> {
  data: T
  status: ResponseStatus
  statusText: string
}

export type UserStore = {
  user: User
  communications: Communication[]
  currentPingerPhone: PingerPhone
}

export type PhoneConversationResult = {
  body: string
  contentType: string
}

export type PhoneConversationResponse = {
  result: PhoneConversationResult[]
  success: string
}

interface From {
  TN: string
  own: boolean
}

interface To {
  TN: string
  name: string
}

interface Message {
  text: string
  id: string
  myStatus: string
  timeCreated: string
  direction: string
  showDate?: boolean
  media?: Media
}

export interface Communication {
  type: string
  direction: string
  from: From
  to: To[]
  messages: Message[]
  timeCreated: string
}

export interface UploadResponse {
  id: string
  originalFile: File
  fileType: string
  content?: string
  isUploading?: boolean
  url: string
}

export interface ChatInputSend {
  text: string
  images: UploadResponse[]
  videos: UploadResponse[]
  audio: UploadResponse
}

export interface Media {
  image: string
  audio: string
  video: string
}

export interface Emoji {
  n: string[]
  u: string
  r: string
  t: string
  i: string
}
