import 'server-only'

import { cookies } from 'next/headers'

import type { Theme } from '@/constants/theme'
import { THEME_COOKIE_NAME } from '@/constants/theme'
import { resolveTheme } from '@/helpers/resolveTheme'

export const getServerTheme = async (): Promise<Theme> => {
  const cookieStore = await cookies()

  return resolveTheme(cookieStore.get(THEME_COOKIE_NAME)?.value)
}
