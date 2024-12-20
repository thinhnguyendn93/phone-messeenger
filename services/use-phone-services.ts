import { useAPI } from '~/composables/use-api'
import type { Media, PhoneConversationResponse } from '~/types/app'
import { useUserServices } from './use-user-services'

export const usePhoneServices = () => {
  const userStore = useUserStore()
  const { error } = useToast()
  const { fetchUserConversations } = useUserServices()
  const { post } = useAPI()

  const sendMessage = async (toPhones: any, message: string, media?: Media) => {
    try {
      const currentPhone = userStore.getCurrentPingerPhone()
      const hasMedia = Object.values(media || {}).filter((m) => m).length > 0
      const MESSAGE_API_BODY: any = {
        to: toPhones,
        text: message,
      }
      if (hasMedia) {
        MESSAGE_API_BODY.media = media
      }
      const response = await post<
        typeof MESSAGE_API_BODY,
        PhoneConversationResponse
      >(`/user/phone/${currentPhone._id}/message`, MESSAGE_API_BODY)
      if (response.success === 'OK') {
        await fetchUserConversations(currentPhone)
        return response
      }
      return null
    } catch (ex: any) {
      error(ex.response._data)
    }
  }

  return {
    sendMessage,
    fetchUserConversations,
  }
}
