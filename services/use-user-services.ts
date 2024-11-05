import { useAPI } from '~/composables/use-api'
import type { PhoneConversationResponse, PingerPhone, User } from '~/types/app'
import { groupCommunications } from '~/utils/helper'

export const useUserServices = () => {
  const userStore = useUserStore()
  const { get, post } = useAPI()

  const fetchUserInfo = async () => {
    const response = await get<void, User>(`/user/${userStore.getUserId()}`)

    if (response) {
      userStore.setUser(response)
      if (response.pingerPhones?.length) {
        const pingerPhone = response.pingerPhones[0]
        if (pingerPhone) {
          userStore.setCurrentPingerPhone(pingerPhone)
          await fetchUserConversations(pingerPhone)
        }
      }
    }
  }

  const fetchUserConversations = async (phone: PingerPhone) => {
    try {
      const MESSAGE_API_BODY = {
        requests: [
          {
            queryParams: [
              { createdSince: '2024-10-10 04:23:36.512952' },
              { updatedSince: '2024-10-24 04:23:36.467539' },
            ],
            contentType: 'application/json',
            useHTTPS: '1',
            resource: '/2.0/communications/sync',
            method: 'GET',
          },
        ],
      }
      const response = await post<
        typeof MESSAGE_API_BODY,
        PhoneConversationResponse
      >(`/user/phone/${phone._id}/request`, MESSAGE_API_BODY)

      if (response) {
        const data = JSON.parse(response.result[0].body)
        const groupedCommunications = groupCommunications(
          data.result.newCommunications,
          phone.phoneNumber,
        )
        userStore.setCommunications(groupedCommunications)
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (ex) {
      console.log('🚀 ~ fetchUserConversations ~ ex:', ex)
      //
    }
  }

  return {
    fetchUserInfo,
    fetchUserConversations,
  }
}
