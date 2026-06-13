import { z } from 'zod'

export const IS_SERVER = typeof window === 'undefined'
export const IS_CLIENT = typeof window !== 'undefined'

export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

const schema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().default(''),
  NEXT_PUBLIC_GITHUB_API_URL: z.url().default('https://api.github.com'),
  NEXT_PUBLIC_GITHUB_USER: z.string().min(1).default('everton-dgn')
})

export const sharedEnv = schema.parse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_GITHUB_API_URL: process.env.NEXT_PUBLIC_GITHUB_API_URL,
  NEXT_PUBLIC_GITHUB_USER: process.env.NEXT_PUBLIC_GITHUB_USER
})
