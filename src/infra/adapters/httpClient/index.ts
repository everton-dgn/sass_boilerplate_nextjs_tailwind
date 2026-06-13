import axios from 'axios'

import type { HttpClientConfig } from './types'

const defaultConfig: HttpClientConfig = {
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10_000
}

export const createHttpClient = (config?: HttpClientConfig) =>
  axios.create({ ...defaultConfig, ...config })
