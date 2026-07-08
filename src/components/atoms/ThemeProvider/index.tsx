'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { IS_SERVER } from '@/constants/sharedEnv'
import type { ResolvedTheme, Theme } from '@/constants/theme'
import {
  DARK_MEDIA_QUERY,
  THEME_BROADCAST_CHANNEL,
  THEMES
} from '@/constants/theme'

import { applyThemeToDOM, getSystemTheme } from './applyThemeToDOM'
import {
  readInitialTheme,
  readThemeCookie,
  writeThemeCookie
} from './themeCookie'
import type { ThemeProviderProps } from './types'
import { ThemeContext } from './useTheme'

const readInitialSystemTheme = (): ResolvedTheme | undefined =>
  IS_SERVER ? undefined : getSystemTheme()

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme | undefined>(readInitialTheme)
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme | undefined>(
    readInitialSystemTheme
  )
  const channelRef = useRef<BroadcastChannel | null>(null)
  const themeRef = useRef(theme)
  themeRef.current = theme

  const setTheme = useCallback((nextTheme: Theme) => {
    if (nextTheme === themeRef.current) return

    themeRef.current = nextTheme
    setThemeState(nextTheme)
    writeThemeCookie(nextTheme)
    applyThemeToDOM(nextTheme)
    channelRef.current?.postMessage(nextTheme)
  }, [])

  useEffect(() => {
    applyThemeToDOM(readThemeCookie())

    if (!('BroadcastChannel' in window)) return

    const channel = new BroadcastChannel(THEME_BROADCAST_CHANNEL)
    channelRef.current = channel

    const handleMessage = (event: MessageEvent<Theme>) => {
      if (!THEMES.includes(event.data)) return

      setThemeState(event.data)
      applyThemeToDOM(event.data)
    }

    channel.addEventListener('message', handleMessage)

    return () => {
      channelRef.current = null
      channel.removeEventListener('message', handleMessage)
      channel.close()
    }
  }, [])

  useEffect(() => {
    if (!('matchMedia' in window)) return

    const mediaQuery = window.matchMedia(DARK_MEDIA_QUERY)

    if (!('addEventListener' in mediaQuery)) return

    const handleChange = () => {
      setSystemTheme(getSystemTheme())

      if (readThemeCookie() === 'system') applyThemeToDOM('system')
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme: theme === 'system' ? systemTheme : theme,
      systemTheme,
      setTheme
    }),
    [theme, systemTheme, setTheme]
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}
