'use client'

import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { DEFAULT_THEME, THEMES, type Theme } from '@/constants/theme'
import { useTheme } from '@/hooks/useTheme'

import { Button } from '../Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '../DropdownMenu'
import { THEME_ICONS } from './constants'
import type { ThemeToggleProps } from './types'

export const ThemeToggle = ({ className, ...props }: ThemeToggleProps) => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const t = useTranslations('ThemeToggle')

  useEffect(() => {
    setMounted(true)
  }, [])

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

  const activeTheme = theme ?? DEFAULT_THEME
  const ActiveIcon = THEME_ICONS[activeTheme]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={t('label')}
          className={className}
          size="icon"
          variant="ghost"
          {...props}
        >
          <ActiveIcon className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          onValueChange={nextTheme => setTheme(nextTheme as Theme)}
          value={activeTheme}
        >
          {THEMES.map(availableTheme => {
            const Icon = THEME_ICONS[availableTheme]
            const isActive = availableTheme === activeTheme

            return (
              <DropdownMenuRadioItem
                key={availableTheme}
                value={availableTheme}
              >
                <Icon className="size-4" />
                <span className="flex-1">{t(availableTheme)}</span>
                {isActive && <Check className="size-4" />}
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
