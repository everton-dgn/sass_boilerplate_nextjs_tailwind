'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ThemeToggle } from '@/components/atoms/ThemeToggle'
import { cn } from '@/helpers/cn'

import { NAV_LINKS } from './constants'
import type { TopbarProps } from './types'

export const Topbar = ({ children, className }: TopbarProps) => {
  const pathname = usePathname()

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
        {children ?? 'SaaS Boilerplate'}
      </span>
      <nav className="flex items-center gap-6">
        {NAV_LINKS.map(({ href, label }) => {
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
              {label}
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
      <ThemeToggle />
    </header>
  )
}
