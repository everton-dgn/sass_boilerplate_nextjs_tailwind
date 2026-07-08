'use client'

import { useTranslations } from 'next-intl'

import { ThemeToggle } from '@/components/atoms/ThemeToggle'
import { LocaleSwitcher } from '@/components/molecules/LocaleSwitcher'
import { cn } from '@/helpers/cn'
import { Link, usePathname } from '@/i18n/navigation'
import { NAV_LINKS } from './constants'
import type { TopbarProps } from './types'

export const Topbar = ({ children, className }: TopbarProps) => {
  const pathname = usePathname()
  const t = useTranslations('Topbar')

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50',
        'flex h-14 items-center justify-between px-6',
        'border-border border-b',
        'bg-background/80 backdrop-blur-sm',
        className
      )}
    >
      <span className="font-semibold text-sm tracking-tight">
        {children ?? t('brand')}
      </span>
      <nav className="flex items-center gap-6">
        {NAV_LINKS.map(({ href, labelKey }) => {
          const isActive = pathname === href

          return (
            <Link
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative text-sm transition-colors',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              href={href}
              key={href}
            >
              {t(labelKey)}
              <span
                className={cn(
                  'absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-foreground',
                  'transition-opacity',
                  isActive ? 'opacity-100' : 'opacity-0'
                )}
              />
            </Link>
          )
        })}
      </nav>
      <div className="flex items-center gap-2">
        <LocaleSwitcher />
        <ThemeToggle />
      </div>
    </header>
  )
}
