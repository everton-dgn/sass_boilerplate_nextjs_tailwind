import { useSyncExternalStore } from 'react'

import { getLocaleFromPathname } from '@/helpers/getLocaleFromPathname'
import { routing } from '@/i18n/routing'

const subscribeToLocale = () => {
  const unsubscribe = () => undefined
  return unsubscribe
}

const getServerLocale = () => routing.defaultLocale

export const useBoundaryLocale = () =>
  useSyncExternalStore(
    subscribeToLocale,
    getLocaleFromPathname,
    getServerLocale
  )
