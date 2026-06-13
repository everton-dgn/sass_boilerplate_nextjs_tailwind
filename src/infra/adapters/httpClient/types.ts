import type { AxiosRequestConfig } from 'axios'

export type HttpClientConfig = Pick<
  AxiosRequestConfig,
  'baseURL' | 'headers' | 'timeout'
>
