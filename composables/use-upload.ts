import { useRuntimeConfig } from 'nuxt/app'
import type { UploadResponse } from '~/types/app'

export function useUpload() {
  const { API_URL } = useRuntimeConfig().public

  const upload = async (uploadFile: File): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('file', uploadFile)

    const opts: any = {
      retry: 0,
      baseURL: API_URL,
      headers: {
        Accept: 'application/json',
      },
      method: 'POST',
      body: formData,
      lazy: false,
    }
    const data = await $fetch('/pinger/attachments/upload', opts)
    const response = typeof data === 'string' ? JSON.parse(data) : data
    return response?.result as UploadResponse
  }

  return {
    upload,
  }
}
