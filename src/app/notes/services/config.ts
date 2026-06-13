import { sharedEnv } from '@/constants/sharedEnv'
import { createHttpClient } from '@/infra/adapters/httpClient'

export const NOTES_QUERY_KEY = ['notes'] as const

export const ITEMS_PER_PAGE = 3

export const httpClient = createHttpClient({
  baseURL: sharedEnv.NEXT_PUBLIC_API_BASE_URL
})
