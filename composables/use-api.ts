import { hash } from 'ohash'
import type { FetchOptions } from 'ofetch'
import { useRuntimeConfig } from 'nuxt/app'

export function useAPI() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const request = async <R, T>(
    url: string,
    params?: any,
    method: string = 'GET',
  ): Promise<T> => {
    const environment = useRuntimeConfig()
    const isGet = method === 'GET'
    const opts: any = {
      key: hash(['api-fetch', url, params]),
      retry: 0,
      baseURL: environment.public.API_URL,
      headers: {
        accept: 'application/json',
      },
      method,
      async onRequest({ options }: { options: FetchOptions }): Promise<void> {
        options.headers = options.headers ?? {}
        options.headers = {
          ...options.headers,
          'Content-Type': 'application/json',
          accept: 'application/json',
        }
      },
      body: !isGet ? JSON.stringify(params) : undefined,
      params: isGet ? params : undefined,
      lazy: false,
    }
    const data = await $fetch(url, opts)
    const response = typeof data === 'string' ? JSON.parse(data) : data
    return response as T
  }

  const get = async <R, T>(url: string, params?: R): Promise<T> => {
    return request(url, params)
  }

  const post = async <R, T>(url: string, params?: R): Promise<T> => {
    return request(url, params, 'POST')
  }
  return {
    get,
    post,
  }
}
