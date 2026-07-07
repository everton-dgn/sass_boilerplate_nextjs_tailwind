'use client'

import { useEffect, useState } from 'react'

import { Moon, Sun } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

import { Button } from '../Button'

import type { ThemeToggleProps } from './types'

export const ThemeToggle = ({ className, ...props }: ThemeToggleProps) => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const t = useTranslations('ThemeToggle')

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  if (!mounted) {
    return (
      <Button
        aria-hidden
        className={className}
        disabled
        size="icon"
        variant="ghost"
      >
        <span className="size-5" />
      </Button>
    )
  }

  return (
    <Button
      aria-label={theme === 'dark' ? t('toLight') : t('toDark')}
      className={className}
      onClick={toggleTheme}
      size="icon"
      variant="ghost"
      {...props}
    >
      {theme === 'dark' ? (
        <Sun className="size-5" />
      ) : (
        <Moon className="size-5" />
      )}
    </Button>
  )
}
